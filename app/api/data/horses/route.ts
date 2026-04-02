import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "@/lib/auth/session";

export async function GET() {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await prisma.horse.findMany({
    where: { tenantId: session.user.tenantId, status: { not: "INELIGIBLE" } },
    orderBy: { name: "asc" },
    select: { id: true, name: true, licenseNumber: true, breed: true, status: true },
    take: 500,
  });

  return NextResponse.json({ data });
}
