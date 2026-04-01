"use server";
import { revalidatePath } from "next/cache";
import crypto from "crypto";
import { prisma } from "@/lib/db";
import { getServerSession } from "@/lib/auth/session";
import { SubmitScoreDto } from "@/types";

export async function submitScore(dto: SubmitScoreDto) {
  const session = await getServerSession();

  const assignment = await prisma.judgeAssignment.findFirst({
    where: { userId: session!.user.id, eventId: { in: [] } },
  });
  if (!assignment) return { error: "Not assigned as judge for this event" };

  const activity = await prisma.eventActivity.findUnique({
    where: { id: dto.eventActivityId },
    include: { activity: true },
  });

  const criteria = activity?.activity.criteria as Array<{ key: string; maxScore: number; weight: number }>;
  const total = criteria.reduce((sum, c) => sum + (dto.criteriaScores[c.key] ?? 0), 0);
  const maxTotal = criteria.reduce((sum, c) => sum + c.maxScore, 0);
  const percentage = (total / maxTotal) * 100;

  // Tamper-proof hash
  const scoreHash = crypto
    .createHash("sha256")
    .update(JSON.stringify({ slotId: dto.scheduleSlotId, scores: dto.criteriaScores, judgeId: assignment.id, ts: new Date().toISOString() }))
    .digest("hex");

  const score = await prisma.score.upsert({
    where: { scheduleSlotId_judgeAssignmentId: { scheduleSlotId: dto.scheduleSlotId, judgeAssignmentId: assignment.id } },
    create: {
      scheduleSlotId: dto.scheduleSlotId,
      eventActivityId: dto.eventActivityId,
      judgeAssignmentId: assignment.id,
      criteriaScores: dto.criteriaScores,
      totalScore: total,
      percentage,
      remarks: dto.remarks,
      isOfflineDraft: dto.isOfflineDraft ?? false,
      submittedAt: dto.isOfflineDraft ? null : new Date(),
      submittedBy: session!.user.id,
      scoreHash,
    },
    update: {
      criteriaScores: dto.criteriaScores,
      totalScore: total,
      percentage,
      remarks: dto.remarks,
      submittedAt: new Date(),
      scoreHash,
    },
  });

  revalidatePath("/scoring");
  revalidatePath("/leaderboard");
  return { success: true, score };
}

export async function flagScore(scoreId: string, reason: string) {
  await prisma.score.update({ where: { id: scoreId }, data: { isFlagged: true, flagReason: reason } });
  // TODO: notify chief judge via NotificationLog
  revalidatePath("/scoring");
}

export async function resolveFlag(scoreId: string) {
  await prisma.score.update({ where: { id: scoreId }, data: { isFlagged: false, flagResolvedAt: new Date() } });
  revalidatePath("/scoring");
}
