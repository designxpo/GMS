"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import crypto from "crypto";
import { prisma } from "@/lib/db";
import { getServerSession } from "@/lib/auth/session";
import { CreateAccreditationDto, UpdateAccreditationDto } from "@/types";
import { writeAuditLog } from "@/lib/audit";
import { sendNotification } from "@/lib/notifications";

export async function createAccreditation(dto: CreateAccreditationDto) {
  const session = await getServerSession();
  const tenantId = session!.user.tenantId;

  // Generate unique QR token
  const qrCode = crypto.randomBytes(32).toString("hex");

  // Auto-assign badge number: TYPE-YEAR-SEQ
  const count = await prisma.accreditation.count({ where: { tenantId, type: dto.type } });
  const badgeNumber = `${dto.type.toUpperCase().slice(0, 3)}-${new Date().getFullYear()}-${String(count + 1).padStart(4, "0")}`;

  const accreditation = await prisma.accreditation.create({
    data: {
      tenantId,
      riderId: dto.riderId,
      eventId: dto.eventId ?? null,
      type: dto.type,
      status: "PENDING",
      accessZones: dto.accessZones ?? [],
      expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
      qrCode,
      badgeNumber,
      photoUrl: dto.photoUrl ?? null,
      notes: dto.notes ?? null,
    },
  });

  await writeAuditLog({ tenantId, userId: session!.user.id, action: "accreditation.create", entityType: "Accreditation", entityId: accreditation.id, newValues: dto });

  revalidatePath("/accreditation");
  redirect(`/accreditation/${accreditation.id}`);
}

export async function approveAccreditation(accreditationId: string) {
  const session = await getServerSession();

  const updated = await prisma.accreditation.update({
    where: { id: accreditationId },
    data: { status: "APPROVED", issuedAt: new Date() },
    include: { rider: true, event: true },
  });

  // Notify rider if associated
  if (updated.riderId && updated.rider) {
    await sendNotification({
      templateKey: "accreditation_approved",
      recipientIds: [updated.riderId],
      variables: {
        riderName: `${updated.rider.firstName} ${updated.rider.lastName}`,
        badgeNumber: updated.badgeNumber ?? "",
        eventName: updated.event?.name ?? "General",
        accessZones: updated.accessZones.join(", "),
      },
      channels: ["EMAIL", "WHATSAPP"],
    });
  }

  await writeAuditLog({ tenantId: updated.tenantId, userId: session!.user.id, action: "accreditation.approve", entityType: "Accreditation", entityId: accreditationId, newValues: { status: "APPROVED" } });
  revalidatePath("/accreditation");
  revalidatePath(`/accreditation/${accreditationId}`);
}

export async function revokeAccreditation(accreditationId: string, reason: string) {
  const session = await getServerSession();
  const updated = await prisma.accreditation.update({
    where: { id: accreditationId },
    data: { status: "REVOKED", revokedAt: new Date(), revokedReason: reason },
  });

  await writeAuditLog({ tenantId: updated.tenantId, userId: session!.user.id, action: "accreditation.revoke", entityType: "Accreditation", entityId: accreditationId, newValues: { status: "REVOKED", reason } });
  revalidatePath("/accreditation");
}

export async function scanAccreditationBadge(qrToken: string) {
  const accreditation = await prisma.accreditation.findFirst({
    where: { qrCode: qrToken },
    include: { rider: true, event: true },
  });

  if (!accreditation) return { valid: false, message: "Badge not found" };
  if (accreditation.status !== "APPROVED") return { valid: false, message: `Badge status: ${accreditation.status}` };
  if (accreditation.expiresAt && accreditation.expiresAt < new Date()) return { valid: false, message: "Badge expired" };

  return {
    valid: true,
    accreditation: {
      badgeNumber: accreditation.badgeNumber,
      type: accreditation.type,
      riderName: accreditation.rider ? `${accreditation.rider.firstName} ${accreditation.rider.lastName}` : "Guest",
      accessZones: accreditation.accessZones,
      eventName: accreditation.event?.name ?? "General",
    },
  };
}
