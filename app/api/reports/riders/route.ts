import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "@/lib/auth/session";

export async function GET() {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const riders = await prisma.rider.findMany({
    where: { tenantId: session.user.tenantId },
    orderBy: { lastName: "asc" },
    include: { accreditations: { select: { status: true } } },
  });

  const rows = [
    ["License No", "First Name", "Last Name", "Email", "Phone", "Gender", "Nationality", "Club", "FEI ID", "Status", "Consent Given", "Created At"],
    ...riders.map(r => [
      r.licenseNumber,
      r.firstName,
      r.lastName,
      r.email,
      r.phone ?? "",
      r.gender ?? "",
      r.nationality ?? "",
      r.clubName ?? "",
      r.feiId ?? "",
      r.status,
      r.consentGiven ? "Yes" : "No",
      r.createdAt.toISOString().split("T")[0],
    ]),
  ];

  const csv = rows.map(row => row.map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="riders-${new Date().toISOString().split("T")[0]}.csv"`,
    },
  });
}
