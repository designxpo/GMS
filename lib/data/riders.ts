import { prisma } from "@/lib/db";
import { getServerSession } from "@/lib/auth/session";
import { RiderFilter, RiderWithRelations, ApiResponse } from "@/types";

export async function getRiders(filter: RiderFilter): Promise<ApiResponse<RiderWithRelations[]>> {
  const session = await getServerSession();
  const tenantId = session!.user.tenantId;
  const { page = 1, pageSize = 20, search, status } = filter;

  const where = {
    tenantId,
    ...(status && { status }),
    ...(search && {
      OR: [
        { firstName: { contains: search, mode: "insensitive" as const } },
        { lastName:  { contains: search, mode: "insensitive" as const } },
        { licenseNumber: { contains: search } },
        { email: { contains: search, mode: "insensitive" as const } },
      ],
    }),
  };

  const [data, total] = await Promise.all([
    prisma.rider.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: "desc" },
      include: { horses: { include: { horse: true } }, documents: true, accreditations: true },
    }),
    prisma.rider.count({ where }),
  ]);

  return { data: data as any, meta: { total, page, pageSize, totalPages: Math.ceil(total / pageSize) } };
}

export async function getRiderById(id: string): Promise<RiderWithRelations | null> {
  const session = await getServerSession();
  return prisma.rider.findFirst({
    where: { id, tenantId: session!.user.tenantId },
    include: {
      horses: { include: { horse: { include: { vaccinations: true } } } },
      registrations: { include: { event: true }, orderBy: { createdAt: "desc" }, take: 10 },
      documents: true,
      accreditations: true,
    },
  }) as any;
}
