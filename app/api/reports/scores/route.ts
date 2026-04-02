import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "@/lib/auth/session";

export async function GET() {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const scores = await prisma.score.findMany({
    where: { eventActivity: { event: { tenantId: session.user.tenantId } } },
    orderBy: { submittedAt: "desc" },
    include: {
      scheduleSlot: { include: { rider: true, horse: true, ring: true } },
      eventActivity: { include: { activity: true, event: { select: { name: true } } } },
    },
  });

  const rows = [
    ["Event", "Activity", "Rider", "Horse", "Ring", "Total Score", "Percentage", "Submitted At", "Flagged"],
    ...scores.map(s => [
      s.eventActivity.event.name,
      s.eventActivity.activity.name,
      `${s.scheduleSlot.rider.firstName} ${s.scheduleSlot.rider.lastName}`,
      s.scheduleSlot.horse.name,
      s.scheduleSlot.ring?.name ?? "",
      s.totalScore,
      s.percentage?.toFixed(2) ?? "",
      s.submittedAt?.toISOString() ?? "",
      s.isFlagged ? "Yes" : "No",
    ]),
  ];

  const csv = rows.map(row => row.map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="scores-${new Date().toISOString().split("T")[0]}.csv"`,
    },
  });
}
