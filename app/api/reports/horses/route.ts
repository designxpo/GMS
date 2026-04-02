import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "@/lib/auth/session";

export async function GET() {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const horses = await prisma.horse.findMany({
    where: { tenantId: session.user.tenantId },
    orderBy: { name: "asc" },
    include: { vaccinations: { select: { vaccine: true, date: true, expiryDate: true, status: true } } },
  });

  const rows = [
    ["Name", "License No", "FEI ID", "Breed", "Color", "Gender", "Date of Birth", "Owner", "Status", "Vaccinations"],
    ...horses.map(h => [
      h.name,
      h.licenseNumber ?? "",
      h.feiId ?? "",
      h.breed ?? "",
      h.color ?? "",
      h.gender ?? "",
      h.dateOfBirth ? h.dateOfBirth.toISOString().split("T")[0] : "",
      h.ownerName ?? "",
      h.status,
      h.vaccinations.length,
    ]),
  ];

  const csv = rows.map(row => row.map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="horses-${new Date().toISOString().split("T")[0]}.csv"`,
    },
  });
}
