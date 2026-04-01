import { prisma } from "@/lib/db";
import { getServerSession } from "@/lib/auth/session";

export async function getAnalyticsData() {
  const session = await getServerSession();
  if (!session) throw new Error("Unauthorized");
  const tenantId = session.user.tenantId;

  const [totalRiders, totalHorses, totalEvents, totalRevenue] = await Promise.all([
    prisma.rider.count({ where: { tenantId } }),
    prisma.horse.count({ where: { tenantId } }),
    prisma.event.count({ where: { tenantId } }),
    prisma.payment.aggregate({
      where: { tenantId },
      _sum: { amount: true },
    }),
  ]);

  const activityStats = await prisma.eventActivity.groupBy({
    by: ['activityId'],
    _count: { _all: true },
    where: { event: { tenantId } }
  });

  return {
    riders: totalRiders,
    horses: totalHorses,
    events: totalEvents,
    revenue: totalRevenue._sum.amount || 0,
    activityVolume: activityStats.length,
  };
}
