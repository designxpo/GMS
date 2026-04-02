"use server";
import { prisma } from "@/lib/db";
import { getServerSession } from "@/lib/auth/session";
import { revalidatePath } from "next/cache";

export async function createScheduleSlot(formData: any) {
  const session = await getServerSession();
  if (!session) throw new Error("Unauthorized");

  // Conflict detection: check for overlapping slots in the same ring
  const existing = await prisma.scheduleSlot.findFirst({
    where: {
      eventId: formData.eventId,
      ...(formData.ringId ? { ringId: formData.ringId } : {}),
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

  revalidatePath("/scheduling");
  return slot;
}

export async function deleteScheduleSlot(id: string) {
  const session = await getServerSession();
  if (!session) throw new Error("Unauthorized");

  await prisma.scheduleSlot.delete({ where: { id } });
  revalidatePath("/scheduling");
  return { success: true };
}
