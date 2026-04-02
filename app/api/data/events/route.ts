import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "@/lib/auth/session";

export async function GET() {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await prisma.event.findMany({
    where: { tenantId: session.user.tenantId },
    orderBy: { startDate: "desc" },
    include: { activities: { include: { activity: true } } },
    take: 100,
  });

  return NextResponse.json({ data });
}
