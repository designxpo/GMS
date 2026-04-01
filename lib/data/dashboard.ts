// ─────────────────────────────────────────────────────────────
// lib/data/dashboard.ts  (Server-side data fetching)
// ─────────────────────────────────────────────────────────────
import { prisma } from "@/lib/db";
import { getServerSession } from "@/lib/auth/session";
import { DashboardKPIs, DashboardAlert } from "@/types";
import { subMonths } from "date-fns";

export async function getDashboardKPIs(period = "6months"): Promise<DashboardKPIs> {
  const session = await getServerSession();
  const tenantId = session!.user.tenantId;
  const since = subMonths(new Date(), 6);

  const [activeRiders, totalRegistrations, totalEvents, activeOrganizers, revenueAgg] =
    await Promise.all([
      prisma.rider.count({ where: { tenantId, status: "ACTIVE" } }),
      prisma.registration.count({ where: { event: { tenantId }, createdAt: { gte: since } } }),
      prisma.event.count({ where: { tenantId } }),
      prisma.user.count({ where: { tenantId, role: "ORGANIZER", isActive: true } }),
      prisma.payment.aggregate({
        where: { tenantId, status: "SUCCESS", createdAt: { gte: since } },
        _sum: { amount: true },
      }),
    ]);

  return {
    totalRiders: activeRiders,
    activeRiders,
    totalRegistrations,
    totalEvents,
    activeOrganizers,
    platformRevenue: revenueAgg._sum.amount ?? 0,
    eventRevenue: (revenueAgg._sum.amount ?? 0) * 0.68, // net after platform fee
    period: "6months",
  };
}

export async function getDashboardAlerts(): Promise<DashboardAlert[]> {
  const session = await getServerSession();
  const tenantId = session!.user.tenantId;
  const alerts: DashboardAlert[] = [];

  const [expiredVaccinations, conflictedEvents, failedPayments] = await Promise.all([
    prisma.vaccination.findMany({
      where: { horse: { tenantId }, expiryDate: { lt: new Date() }, status: "VERIFIED" },
      select: { id: true, horseId: true },
    }),
    prisma.event.findMany({
      where: { tenantId, status: "SCHEDULED" },
      include: { scheduleSlots: { where: { hasConflict: true }, select: { id: true } } },
    }),
    prisma.payment.findMany({
      where: { tenantId, status: "FAILED" },
      select: { id: true, amount: true },
    }),
  ]);

  if (expiredVaccinations.length > 0)
    alerts.push({ id: "vacc", severity: "critical", message: `${expiredVaccinations.length} horse(s) have expired vaccination certificates`, link: "/horses", entityType: "Horse", entityId: "multiple" });

  conflictedEvents.forEach((ev) => {
    if (ev.scheduleSlots.length > 0)
      alerts.push({ id: `conflict-${ev.id}`, severity: "warning", message: `${ev.name} has scheduling conflicts`, link: `/scheduling?event=${ev.id}`, entityType: "Event", entityId: ev.id });
  });

  if (failedPayments.length > 0) {
    const total = failedPayments.reduce((s, p) => s + p.amount, 0);
    alerts.push({ id: "payments", severity: "warning", message: `₹${total.toLocaleString("en-IN")} in failed payment transactions`, link: "/payments?status=FAILED", entityType: "Payment", entityId: "multiple" });
  }

  return alerts;
}