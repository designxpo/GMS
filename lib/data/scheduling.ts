import { prisma } from "@/lib/db";
import { getServerSession } from "@/lib/auth/session";

export async function getScheduleSlots(eventId?: string) {
  const session = await getServerSession();
  if (!session) throw new Error("Unauthorized");
  const tenantId = session.user.tenantId;

  const where: any = {
    event: { tenantId }
  };

  if (eventId) {
    where.eventId = eventId;
  }

  return prisma.scheduleSlot.findMany({
    where,
    include: {
      event: true,
      ring: true,
      rider: true,
      horse: true,
    },
    orderBy: { startTime: "asc" },
  });
}

export async function getConflicts(eventId: string) {
    return prisma.scheduleSlot.findMany({
        where: { eventId, hasConflict: true },
        include: {
            rider: true,
            horse: true,
            ring: true,
        }
    });
}
