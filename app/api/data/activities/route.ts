import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "@/lib/auth/session";

export async function GET() {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await prisma.activity.findMany({
    orderBy: { name: "asc" },
    include: { eventActivities: { select: { id: true } } },
  });

  return NextResponse.json({ data });
}
