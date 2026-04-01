import { prisma } from "@/lib/db";
import { ApiResponse } from "@/types";

export async function getActivities(): Promise<ApiResponse<any[]>> {
  const data = await prisma.activity.findMany({
    orderBy: { name: "asc" },
    include: {
        eventActivities: {
            include: {
                event: true
            }
        }
    }
  });

  return {
    data: data as any[],
    meta: { total: data.length },
  };
}

export async function getActivityById(id: string) {
  return prisma.activity.findUnique({
    where: { id },
    include: { 
        eventActivities: {
            include: {
                event: true
            }
        }
    },
  });
}
