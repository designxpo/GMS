import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "@/lib/auth/session";

export async function GET() {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const events = await prisma.event.findMany({
    where: { tenantId: session.user.tenantId },
    orderBy: { startDate: "desc" },
    include: {
      venue: { select: { name: true } },
      _count: { select: { registrations: true, checkIns: true } },
    },
  });

  const rows = [
    ["Event Name", "Discipline", "Status", "Start Date", "End Date", "Venue", "Registrations", "Check-ins", "Is Public"],
    ...events.map(ev => [
      ev.name,
      ev.discipline ?? "",
      ev.status,
      ev.startDate.toISOString().split("T")[0],
      ev.endDate.toISOString().split("T")[0],
      ev.venue?.name ?? ev.venueName ?? "",
      ev._count.registrations,
      ev._count.checkIns,
      ev.isPublic ? "Yes" : "No",
    ]),
  ];

  const csv = rows.map(row => row.map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="events-${new Date().toISOString().split("T")[0]}.csv"`,
    },
  });
}
