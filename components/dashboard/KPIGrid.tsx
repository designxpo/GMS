// ─────────────────────────────────────────────────────────────
// components/dashboard/KPIGrid.tsx
// ─────────────────────────────────────────────────────────────
import Link from "next/link";
import { DashboardKPIs } from "@/types";
import { formatCurrency } from "@/lib/utils";

const kpiConfig = (kpis: DashboardKPIs) => [
  { label: "Active Riders",      value: kpis.activeRiders,                        href: "/riders",    sub: "total registered" },
  { label: "Registrations",      value: kpis.totalRegistrations,                  href: "/registration", sub: `${kpis.totalEvents} events` },
  { label: "Active Organizers",  value: kpis.activeOrganizers,                    href: null,         sub: "on platform" },
  { label: "Platform Revenue",   value: formatCurrency(kpis.platformRevenue),     href: "/payments",  sub: "6 months" },
  { label: "Event Revenue",      value: formatCurrency(kpis.eventRevenue),        href: "/analytics", sub: "collected" },
];

export default function KPIGrid({ kpis }: { kpis: DashboardKPIs }) {
  const cards = kpiConfig(kpis);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {cards.map((k) => {
        const card = (
          <div className="group bg-white border border-slate-200 rounded-2xl p-5 hover:border-indigo-200 hover:shadow-md hover:shadow-indigo-500/5 transition-all duration-300">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 group-hover:text-indigo-400 transition-colors">{k.label}</p>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-slate-900 tracking-tight">{k.value}</span>
            </div>
            {k.sub && (
              <p className="text-[11px] font-medium text-slate-400 mt-2 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                {k.sub}
              </p>
            )}
          </div>
        );
        return k.href ? (
          <Link key={k.label} href={k.href} className="block">{card}</Link>
        ) : (
          <div key={k.label}>{card}</div>
        );
      })}
    </div>
  );
}