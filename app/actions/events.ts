"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getServerSession } from "@/lib/auth/session";
import { EventWizardDraft } from "@/types";
import { writeAuditLog } from "@/lib/audit";

// Save wizard draft — called on every step change
export async function saveDraft(draft: EventWizardDraft): Promise<void> {
  const session = await getServerSession();
  const tenantId = session!.user.tenantId;

  const existing = await prisma.event.findFirst({
    where: { tenantId, status: "DRAFT", draftData: { path: ["step"], equals: draft.step } },
  });

  if (existing) {
    await prisma.event.update({ where: { id: existing.id }, data: { draftData: draft as any } });
  } else {
    await prisma.event.create({
      data: { tenantId, name: draft.basicInfo?.name ?? "Untitled Draft", startDate: new Date(), endDate: new Date(), status: "DRAFT", draftData: draft as any },
    });
  }
}

export async function publishEvent(eventId: string) {
  const session = await getServerSession();
  const tenantId = session!.user.tenantId;

  // Block if conflicts exist (UI also disables the button, this is a server-side guard)
  const conflicts = await prisma.scheduleSlot.count({ where: { eventId, hasConflict: true } });
  if (conflicts > 0) return;

  await prisma.event.update({
    where: { id: eventId, tenantId },
    data: { status: "SCHEDULED", isPublic: true },
  });

  await writeAuditLog({ tenantId, userId: session!.user.id, action: "event.publish", entityType: "Event", entityId: eventId, newValues: { status: "SCHEDULED" } });
  revalidatePath("/events");
  revalidatePath(`/events/${eventId}`);
}

export async function cloneEvent(sourceEventId: string) {
  const session = await getServerSession();
  const tenantId = session!.user.tenantId;

  const source = await prisma.event.findUnique({
    where: { id: sourceEventId },
    include: { activities: true },
  });
  if (!source) { revalidatePath("/events"); return; }

  const clone = await prisma.event.create({
    data: {
      tenantId,
      name: `${source.name} (Copy)`,
      description: source.description,
      discipline: source.discipline,
      startDate: source.startDate,
      endDate: source.endDate,
      venueId: source.venueId,
      status: "DRAFT",
      clonedFromId: sourceEventId,
    },
  });

  for (const ea of source.activities) {
    await prisma.eventActivity.create({ data: { eventId: clone.id, activityId: ea.activityId, fee: ea.fee } });
  }

  revalidatePath("/events");
  redirect(`/events/${clone.id}/edit`);
}
