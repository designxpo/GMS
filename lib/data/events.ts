import { prisma } from "@/lib/db";
import { getServerSession } from "@/lib/auth/session";
import { EquiEvent, ApiResponse } from "@/types";

export async function getEvents(): Promise<ApiResponse<EquiEvent[]>> {
  const session = await getServerSession();
  const tenantId = session!.user.tenantId;
  const data = await prisma.event.findMany({
    where: { tenantId },
    orderBy: { startDate: "desc" },
    include: { venue: true, activities: true },
  });
  return { data: data as any[], meta: { total: data.length } };
}

// Public events (no session required)
export async function getPublicEvents(): Promise<ApiResponse<EquiEvent[]>> {
  const data = await prisma.event.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { startDate: "desc" },
    include: { activities: true, venue: true },
  });
  return { data, meta: { total: data.length } };
}
