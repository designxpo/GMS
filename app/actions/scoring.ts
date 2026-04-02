"use server";
import { revalidatePath } from "next/cache";
import crypto from "crypto";
import { prisma } from "@/lib/db";
import { getServerSession } from "@/lib/auth/session";
import { SubmitScoreDto } from "@/types";

export async function submitScore(dto: SubmitScoreDto) {
  const session = await getServerSession();

  // Find the activity to get the eventId
  const activityRecord = await prisma.eventActivity.findUnique({
    where: { id: dto.eventActivityId },
  });
  if (!activityRecord) return { error: "Activity not found" };

  const assignment = await prisma.judgeAssignment.findFirst({
    where: { userId: session!.user.id, eventId: activityRecord.eventId, activityId: dto.eventActivityId },
  });
  // Allow SUPER_ADMIN and TENANT_ADMIN to submit scores even without a judge assignment
  const allowedWithoutAssignment = ["SUPER_ADMIN", "TENANT_ADMIN"].includes(session!.user.role);
  if (!assignment && !allowedWithoutAssignment) return { error: "Not assigned as judge for this event" };

  const activity = await prisma.eventActivity.findUnique({
    where: { id: dto.eventActivityId },
    include: { activity: true },
  });

  const criteria = activity?.activity.criteria as Array<{ key: string; maxScore: number; weight: number }>;
  const total = criteria.reduce((sum, c) => sum + (dto.criteriaScores[c.key] ?? 0), 0);
  const maxTotal = criteria.reduce((sum, c) => sum + c.maxScore, 0);
  const percentage = (total / maxTotal) * 100;

  // For admins without a formal assignment, we need a real assignment record
  // Create one on-the-fly if needed
  let resolvedAssignment = assignment;
  if (!resolvedAssignment && allowedWithoutAssignment) {
    resolvedAssignment = await prisma.judgeAssignment.upsert({
      where: { id: `admin-${session!.user.id}-${dto.eventActivityId}` },
      update: {},
      create: {
        id: `admin-${session!.user.id}-${dto.eventActivityId}`,
        eventId: activityRecord.eventId,
        userId: session!.user.id,
        activityId: dto.eventActivityId,
      },
    }).catch(async () =>
      prisma.judgeAssignment.create({
        data: {
          eventId: activityRecord.eventId,
          userId: session!.user.id,
          activityId: dto.eventActivityId,
        },
      })
    );
  }
  if (!resolvedAssignment) return { error: "Could not resolve judge assignment" };

  // Tamper-proof hash
  const scoreHash = crypto
    .createHash("sha256")
    .update(JSON.stringify({ slotId: dto.scheduleSlotId, scores: dto.criteriaScores, judgeId: resolvedAssignment.id, ts: new Date().toISOString() }))
    .digest("hex");

  const score = await prisma.score.upsert({
    where: { scheduleSlotId_judgeAssignmentId: { scheduleSlotId: dto.scheduleSlotId, judgeAssignmentId: resolvedAssignment.id } },
    create: {
      scheduleSlotId: dto.scheduleSlotId,
      eventActivityId: dto.eventActivityId,
      judgeAssignmentId: resolvedAssignment.id,
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
