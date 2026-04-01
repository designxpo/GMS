"use server";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createActivity(name: string, description?: string) {
  const data = await prisma.activity.create({
    data: {
      name,
      description,
    },
  });

  revalidatePath("/(admin)/activities", "page");
  return data;
}

export async function updateActivity(id: string, name: string, description?: string) {
  const data = await prisma.activity.update({
    where: { id },
    data: {
      name,
      description,
    },
  });

  revalidatePath("/(admin)/activities", "page");
  return data;
}

export async function deleteActivity(id: string) {
  await prisma.activity.delete({
    where: { id },
  });

  revalidatePath("/(admin)/activities", "page");
  return { success: true };
}

export async function addToEvent(eventId: string, activityId: string, fee: number) {
    const ea = await prisma.eventActivity.create({
        data: {
            eventId,
            activityId,
            fee,
        }
    });

    revalidatePath(`/events/${eventId}`);
    return ea;
}
