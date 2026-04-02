"use server";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

interface ActivityPayload {
  name: string;
  description?: string;
  criteria?: object;
}

export async function createActivity(payload: ActivityPayload) {
  const data = await prisma.activity.create({
    data: {
      name: payload.name,
      description: payload.description,
      criteria: payload.criteria ? (payload.criteria as any) : undefined,
    },
  });

  revalidatePath("/activities");
  return data;
}

export async function updateActivity(id: string, payload: ActivityPayload) {
  const data = await prisma.activity.update({
    where: { id },
    data: {
      name: payload.name,
      description: payload.description,
      criteria: payload.criteria ? (payload.criteria as any) : undefined,
    },
  });

  revalidatePath("/activities");
  return data;
}

export async function deleteActivity(id: string) {
  await prisma.activity.delete({ where: { id } });
  revalidatePath("/activities");
  return { success: true };
}

export async function addToEvent(eventId: string, activityId: string, fee: number) {
  const ea = await prisma.eventActivity.create({
    data: { eventId, activityId, fee },
  });
  revalidatePath(`/events/${eventId}`);
  return ea;
}
