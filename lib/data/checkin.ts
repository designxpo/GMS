import { prisma } from "@/lib/db";
import { CheckInStats, CheckInWithRelations } from "@/types";

export async function getCheckIns(eventId: string): Promise<{ data: CheckInWithRelations[]; stats: CheckInStats }> {
  const rows = await prisma.checkIn.findMany({
    where: { eventId },
    include: { rider: true, horse: true },
    orderBy: { rider: { firstName: "asc" } },
  });

  const stats: CheckInStats = {
    total: rows.length,
    checkedIn:  rows.filter((r) => r.status === "CHECKED_IN").length,
    noShow:     rows.filter((r) => r.status === "NO_SHOW").length,
    scratched:  rows.filter((r) => r.status === "SCRATCHED").length,
    docPending: rows.filter((r) => r.docStatus === "PENDING").length,
    awaiting:   rows.filter((r) => r.status === "AWAITING").length,
  };

  return { data: rows as any, stats };
}
