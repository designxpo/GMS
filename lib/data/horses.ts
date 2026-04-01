import { prisma } from "@/lib/db";
import { getServerSession } from "@/lib/auth/session";
import { Horse, ApiResponse } from "@/types";

export async function getHorses({
  page = 1,
  pageSize = 20,
  search = "",
  status,
}: {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: Horse["status"];
} = {}): Promise<ApiResponse<Horse[]>> {
  const session = await getServerSession();
  if (!session) throw new Error("Unauthorized");
  const tenantId = session.user.tenantId;

  const where: any = {
    tenantId,
    OR: [
      { name: { contains: search, mode: "insensitive" } },
      { licenseNumber: { contains: search, mode: "insensitive" } },
      { feiId: { contains: search, mode: "insensitive" } },
    ],
  };

  if (status) {
    where.status = status;
  }

  const [data, total] = await Promise.all([
    prisma.horse.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { name: "asc" },
      include: {
        riders: {
          include: {
            rider: true,
          },
        },
      },
    }),
    prisma.horse.count({ where }),
  ]);

  return {
    data: data as any[],
    meta: {
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    },
  };
}

export async function getHorseById(id: string): Promise<Horse | null> {
  const session = await getServerSession();
  if (!session) throw new Error("Unauthorized");
  const tenantId = session.user.tenantId;

  const horse = await prisma.horse.findFirst({
    where: { id, tenantId },
    include: {
      riders: {
        include: {
          rider: true,
        },
      },
      vaccinations: true,
    },
  });

  return horse as any;
}
