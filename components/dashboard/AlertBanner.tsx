// ─────────────────────────────────────────────────────────────
// components/dashboard/AlertBanner.tsx
// ─────────────────────────────────────────────────────────────
"use client";
import Link from "next/link";
import { DashboardAlert } from "@/types";
import { AlertTriangle, Info, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const severityConfig = {
  critical: { bg: "bg-red-50 border-red-200",   text: "text-red-800",   icon: XCircle,       iconColor: "text-red-500"    },
  warning:  { bg: "bg-amber-50 border-amber-200",text: "text-amber-800", icon: AlertTriangle, iconColor: "text-amber-500"  },
  info:     { bg: "bg-blue-50 border-blue-200",  text: "text-blue-800",  icon: Info,          iconColor: "text-blue-500"   },
};

export default function AlertBanner({ alerts }: { alerts: DashboardAlert[] }) {
  return (
    <div className="space-y-2">
      {alerts.map((alert) => {
        const cfg = severityConfig[alert.severity];
        const Icon = cfg.icon;
        return (
          <div key={alert.id} className={cn("flex items-center gap-3 px-4 py-2.5 border rounded-lg text-sm", cfg.bg, cfg.text)}>
            <Icon size={14} className={cn("shrink-0", cfg.iconColor)} />
            <span className="flex-1">{alert.message}</span>
            {alert.link && (
              <Link href={alert.link} className="text-xs underline underline-offset-2 shrink-0">
                View →
              </Link>
            )}
          </div>
        );
      })}
    </div>
  );
}