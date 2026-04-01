// ─────────────────────────────────────────────────────────────
// app/(admin)/dashboard/page.tsx
// ─────────────────────────────────────────────────────────────
import { Suspense } from "react";
import { getDashboardKPIs, getDashboardAlerts } from "@/lib/data/dashboard";
import KPIGrid from "@/components/dashboard/KPIGrid";
import AlertBanner from "@/components/dashboard/AlertBanner";
import UpcomingEvents from "@/components/dashboard/UpcomingEvents";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import { KPISkeleton } from "@/components/ui/Skeletons";

export const metadata = { title: "Dashboard — BSV" };
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [kpis, alerts] = await Promise.all([
    getDashboardKPIs("6months"),
    getDashboardAlerts(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-1">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Admin Intelligence</h1>
        <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
          <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider">Production</span>
          <span>System Overview · Real-time Analytics</span>
        </div>
      </div>

      {alerts.length > 0 && <AlertBanner alerts={alerts} />}

      <Suspense fallback={<KPISkeleton />}>
        <KPIGrid kpis={kpis} />
      </Suspense>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Suspense fallback={<div className="h-64 animate-pulse bg-gray-100 rounded-xl" />}>
            <UpcomingEvents />
          </Suspense>
        </div>
        <div>
          <Suspense fallback={<div className="h-64 animate-pulse bg-gray-100 rounded-xl" />}>
            <ActivityFeed />
          </Suspense>
        </div>
      </div>
    </div>
  );
}