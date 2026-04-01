"use server";
import { prisma } from "@/lib/db";
import { getServerSession } from "@/lib/auth/session";
import { revalidatePath } from "next/cache";

export async function createScheduleSlot(formData: any) {
  const session = await getServerSession();
  if (!session) throw new Error("Unauthorized");
  const tenantId = session.user.tenantId;

  // Conflict detection logic (Simplified)
  const existing = await prisma.scheduleSlot.findFirst({
    where: {
      eventId: formData.eventId,
      ringId: formData.ringId,
      startTime: { lte: formData.endTime },
      endTime: { gte: formData.startTime },
    },
  });

  const slot = await prisma.scheduleSlot.create({
    data: {
      ...formData,
      hasConflict: !!existing,
    },
  });

  revalidatePath("/(admin)/scheduling", "page");
  return slot;
}

export async function deleteScheduleSlot(id: string) {
  const session = await getServerSession();
  if (!session) throw new Error("Unauthorized");
  const tenantId = session.user.tenantId;

  await prisma.scheduleSlot.delete({
    where: { id },
  });

  revalidatePath("/(admin)/scheduling", "page");
  return { success: true };
}
