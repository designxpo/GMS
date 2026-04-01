"use server";
import { prisma } from "@/lib/db";
import { getServerSession } from "@/lib/auth/session";
import { revalidatePath } from "next/cache";

export async function createVenue(formData: any) {
  const session = await getServerSession();
  if (!session) throw new Error("Unauthorized");
  const tenantId = session.user.tenantId;

  const { rings, ...venueData } = formData;

  const data = await prisma.venue.create({
    data: {
      ...venueData,
      tenantId,
      rings: {
        create: rings || [],
      },
    },
  });

  revalidatePath("/(admin)/venues", "page");
  return data;
}

export async function updateVenue(id: string, formData: any) {
  const session = await getServerSession();
  if (!session) throw new Error("Unauthorized");
  const tenantId = session.user.tenantId;

  const data = await prisma.venue.update({
    where: { id, tenantId },
    data: formData,
  });

  revalidatePath("/(admin)/venues", "page");
  return data;
}

export async function deleteVenue(id: string) {
  const session = await getServerSession();
  if (!session) throw new Error("Unauthorized");
  const tenantId = session.user.tenantId;

  // Handle cascading delete risk
  await prisma.venue.delete({
    where: { id, tenantId },
  });

  revalidatePath("/(admin)/venues", "page");
  return { success: true };
}

export async function createRing(venueId: string, name: string) {
    const session = await getServerSession();
    if (!session) throw new Error("Unauthorized");
    const tenantId = session.user.tenantId;

    const ring = await prisma.ring.create({
        data: {
            name,
            venueId,
        }
    });

    revalidatePath("/(admin)/venues", "page");
    return ring;
}
