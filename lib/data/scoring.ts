import { prisma } from "@/lib/db";
import { getServerSession } from "@/lib/auth/session";

export async function getJudgeQueue(eventId: string, ringId: string) {
  const now = new Date();
  const current = await prisma.scheduleSlot.findFirst({
    where: { eventId, ringId: ringId || undefined, startTime: { lte: now }, endTime: { gte: now } },
    include: { rider: true, horse: true, ring: true, scores: true },
  });
  const upcoming = await prisma.scheduleSlot.findMany({
    where: { eventId, startTime: { gt: now } },
    orderBy: { startTime: "asc" },
    take: 5,
    include: { rider: true },
  });
  return { current, upcoming };
}

export async function getLeaderboard(eventId: string, activityId?: string) {
  const scores = await prisma.score.findMany({
    where: { eventActivity: { eventId }, ...(activityId && { eventActivityId: activityId }) },
    include: { scheduleSlot: { include: { rider: true, horse: true } } },
    orderBy: { totalScore: "desc" },
  });

  return scores.map((s, i) => ({
    rank: i + 1,
    riderId: s.scheduleSlot.riderId,
    riderName: `${s.scheduleSlot.rider.firstName} ${s.scheduleSlot.rider.lastName}`,
    horseName: s.scheduleSlot.horse.name,
    totalScore: s.totalScore,
    percentage: s.percentage ?? 0,
  }));
}
