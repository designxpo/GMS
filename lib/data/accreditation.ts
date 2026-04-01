import { prisma } from "@/lib/db";
import { getServerSession } from "@/lib/auth/session";
import { AccreditationStatus, AccreditationType, AccreditationWithRelations, ApiResponse } from "@/types";

interface AccreditationFilter {
  eventId?: string;
  status?: AccreditationStatus;
  type?: string;
  page?: number;
  pageSize?: number;
}

export async function getAccreditations(filter: AccreditationFilter = {}): Promise<ApiResponse<AccreditationWithRelations[]>> {
  const session = await getServerSession();
  const tenantId = session!.user.tenantId;
  const { page = 1, pageSize = 20, eventId, status, type } = filter;

  const where = {
    tenantId,
    ...(eventId && { eventId }),
    ...(status  && { status }),
    ...(type    && { type }),
  };

  const [data, total] = await Promise.all([
    prisma.accreditation.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: "desc" },
      include: { rider: true, event: true },
    }),
    prisma.accreditation.count({ where }),
  ]);

  return { data: data as any, meta: { total, page, pageSize, totalPages: Math.ceil(total / pageSize) } };
}

export async function getAccreditationById(id: string): Promise<AccreditationWithRelations | null> {
  const session = await getServerSession();
  return prisma.accreditation.findFirst({
    where: { id, tenantId: session!.user.tenantId },
    include: { rider: true, event: true },
  }) as any;
}
