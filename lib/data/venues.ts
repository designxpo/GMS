import { prisma } from "@/lib/db";
import { getServerSession } from "@/lib/auth/session";
import { ApiResponse } from "@/types";

export interface VenueWithRelations {
  id: string;
  name: string;
  address?: string | null;
  rings: any[];
  _count: {
    events: number;
    rings: number;
  };
}

export async function getVenues(): Promise<ApiResponse<VenueWithRelations[]>> {
  const session = await getServerSession();
  if (!session) throw new Error("Unauthorized");
  const tenantId = session.user.tenantId;

  const data = await prisma.venue.findMany({
    where: { tenantId },
    include: {
      rings: true,
      _count: {
        select: { events: true, rings: true },
      },
    },
    orderBy: { name: "asc" },
  });

  return {
    data: data as any[],
    meta: { total: data.length },
  };
}

export async function getVenueById(id: string) {
  const session = await getServerSession();
  if (!session) throw new Error("Unauthorized");
  const tenantId = session.user.tenantId;

  return prisma.venue.findFirst({
    where: { id, tenantId },
    include: { rings: true },
  });
}
