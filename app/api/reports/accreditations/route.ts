import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "@/lib/auth/session";

export async function GET() {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const accreditations = await prisma.accreditation.findMany({
    where: { tenantId: session.user.tenantId },
    orderBy: { createdAt: "desc" },
    include: { rider: { select: { firstName: true, lastName: true, licenseNumber: true } }, event: { select: { name: true } } },
  });

  const rows = [
    ["Badge Number", "Rider", "License No", "Event", "Type", "Status", "Access Zones", "Issued At", "Expires At", "Revoked At", "Revoke Reason"],
    ...accreditations.map(a => [
      a.badgeNumber ?? "",
      a.rider ? `${a.rider.firstName} ${a.rider.lastName}` : "N/A",
      a.rider?.licenseNumber ?? "",
      a.event?.name ?? "",
      a.type,
      a.status,
      a.accessZones.join("; "),
      a.issuedAt ? a.issuedAt.toISOString().split("T")[0] : "",
      a.expiresAt ? a.expiresAt.toISOString().split("T")[0] : "",
      a.revokedAt ? a.revokedAt.toISOString().split("T")[0] : "",
      a.revokedReason ?? "",
    ]),
  ];

  const csv = rows.map(row => row.map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="accreditations-${new Date().toISOString().split("T")[0]}.csv"`,
    },
  });
}
