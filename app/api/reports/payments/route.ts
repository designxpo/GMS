import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "@/lib/auth/session";

export async function GET() {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const payments = await prisma.payment.findMany({
    where: { tenantId: session.user.tenantId },
    orderBy: { createdAt: "desc" },
    include: { registration: { include: { rider: true, event: { select: { name: true } } } } },
  });

  const rows = [
    ["Transaction ID", "Rider", "Event", "Amount (₹)", "Status", "Date"],
    ...payments.map(p => [
      p.id.slice(0, 8).toUpperCase(),
      p.registration?.rider ? `${p.registration.rider.firstName} ${p.registration.rider.lastName}` : "N/A",
      p.registration?.event?.name ?? "N/A",
      p.amount,
      p.status,
      p.createdAt.toISOString().split("T")[0],
    ]),
  ];

  const csv = rows.map(row => row.map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="payments-${new Date().toISOString().split("T")[0]}.csv"`,
    },
  });
}
