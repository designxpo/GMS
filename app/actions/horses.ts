"use server";
import { prisma } from "@/lib/db";
import { getServerSession } from "@/lib/auth/session";
import { revalidatePath } from "next/cache";

export async function createHorse(formData: any) {
  const session = await getServerSession();
  if (!session) throw new Error("Unauthorized");
  const tenantId = session.user.tenantId;

  const data = await prisma.horse.create({
    data: {
      ...formData,
      tenantId,
    },
  });

  revalidatePath("/horses");
  return data;
}

export async function updateHorse(id: string, formData: any) {
  const session = await getServerSession();
  if (!session) throw new Error("Unauthorized");
  const tenantId = session.user.tenantId;

  const data = await prisma.horse.update({
    where: { id, tenantId },
    data: formData,
  });

  revalidatePath("/horses");
  return data;
}

export async function deleteHorse(id: string) {
  const session = await getServerSession();
  if (!session) throw new Error("Unauthorized");
  const tenantId = session.user.tenantId;

  await prisma.horse.delete({
    where: { id, tenantId },
  });

  revalidatePath("/horses");
  return { success: true };
}
