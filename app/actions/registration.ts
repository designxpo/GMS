"use server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { getServerSession } from "@/lib/auth/session";
import { CreateRegistrationDto } from "@/types";
import { writeAuditLog } from "@/lib/audit";
import { sendNotification } from "@/lib/notifications";

export async function createRegistration(dto: CreateRegistrationDto) {
  const session = await getServerSession();
  const tenantId = session!.user.tenantId;

  // Check eligibility
  const horse = await prisma.horse.findUnique({ where: { id: dto.horseId }, include: { vaccinations: true } });
  if (!horse) return { error: "Horse not found" };
  if (horse.status === "INELIGIBLE") return { error: "Horse is currently ineligible — please resolve outstanding issues first" };

  // Check for duplicate
  const existing = await prisma.registration.findFirst({
    where: { eventId: dto.eventId, riderId: dto.riderId, horseId: dto.horseId, status: { notIn: ["CANCELLED", "REFUNDED"] } },
  });
  if (existing) return { error: "Already registered for this event with this horse" };

  // Calculate fee
  const activity = dto.eventActivityId
    ? await prisma.eventActivity.findUnique({ where: { id: dto.eventActivityId } })
    : null;
  const totalFee = activity?.fee ?? 0;

  const registration = await prisma.registration.create({
    data: {
      tenantId,
      eventId: dto.eventId,
      riderId: dto.riderId,
      horseId: dto.horseId,
      eventActivityId: dto.eventActivityId ?? null,
      status: "DRAFT",
      totalFee,
      termsAccepted: dto.termsAccepted,
      notes: dto.notes ?? null,
    },
  });

  await writeAuditLog({ tenantId, userId: session!.user.id, action: "registration.create", entityType: "Registration", entityId: registration.id, newValues: dto });
  revalidatePath("/registration");
  return { success: true, registrationId: registration.id };
}

export async function submitRegistration(registrationId: string) {
  const registration = await prisma.registration.update({
    where: { id: registrationId },
    data: { status: "SUBMITTED", submittedAt: new Date() },
    include: { rider: true, event: true },
  });

  // Also create a check-in record for day-of operations
  await prisma.checkIn.create({
    data: {
      eventId: registration.eventId,
      riderId: registration.riderId,
      horseId: registration.horseId,
      qrToken: crypto.randomUUID(),
      status: "AWAITING",
      docStatus: "PENDING",
    },
  });

  await sendNotification({
    templateKey: "registration_submitted",
    recipientIds: [registration.riderId],
    variables: {
      riderName: `${registration.rider.firstName} ${registration.rider.lastName}`,
      eventName: registration.event.name,
      registrationId: registration.id,
    },
    channels: ["EMAIL", "WHATSAPP"],
  });

  revalidatePath("/registration");
  revalidatePath(`/registration/${registrationId}`);
  return { success: true };
}

export async function cancelRegistration(registrationId: string, reason: string) {
  const session = await getServerSession();
  const registration = await prisma.registration.update({
    where: { id: registrationId },
    data: { status: "CANCELLED" },
  });

  await writeAuditLog({ tenantId: registration.tenantId, userId: session!.user.id, action: "registration.cancel", entityType: "Registration", entityId: registrationId, newValues: { reason } });
  revalidatePath("/registration");
}
