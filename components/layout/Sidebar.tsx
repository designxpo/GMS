// ─────────────────────────────────────────────────────────────
// components/layout/Sidebar.tsx
// ─────────────────────────────────────────────────────────────
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Role } from "@/types";
import {
  LayoutDashboard, Users, Trophy, MapPin, Calendar,
  Clock, CheckSquare, Trophy as TrophyIcon, Bell, CreditCard,
  BarChart2, FileText, Settings, BadgeCheck, ClipboardList
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  roles: Role[];
  tier?: "BASIC" | "PREMIUM" | "ULTIMATE";
}

const navItems: NavItem[] = [
  { href: "/dashboard",    label: "Dashboard",     icon: LayoutDashboard, roles: ["SUPER_ADMIN","TENANT_ADMIN","ORGANIZER"] },
  { href: "/riders",       label: "Riders",        icon: Users,           roles: ["SUPER_ADMIN","TENANT_ADMIN","ORGANIZER"] },
  { href: "/horses",       label: "Horses",        icon: TrophyIcon,       roles: ["SUPER_ADMIN","TENANT_ADMIN","ORGANIZER"] },
  { href: "/venues",       label: "Venues",        icon: MapPin,          roles: ["SUPER_ADMIN","TENANT_ADMIN","ORGANIZER"] },
  { href: "/events",       label: "Events",        icon: Calendar,        roles: ["SUPER_ADMIN","TENANT_ADMIN","ORGANIZER"] },
  { href: "/activities",   label: "Activities",    icon: ClipboardList,   roles: ["SUPER_ADMIN","TENANT_ADMIN","ORGANIZER"] },
  { href: "/registration", label: "Registration",  icon: ClipboardList,   roles: ["SUPER_ADMIN","TENANT_ADMIN","ORGANIZER"], tier: "PREMIUM" },
  { href: "/accreditation",label: "Accreditation", icon: BadgeCheck,      roles: ["SUPER_ADMIN","TENANT_ADMIN","ORGANIZER"], tier: "PREMIUM" },
  { href: "/scheduling",   label: "Scheduling",    icon: Clock,           roles: ["SUPER_ADMIN","TENANT_ADMIN","ORGANIZER"], tier: "PREMIUM" },
  { href: "/checkin",      label: "Check-in",      icon: CheckSquare,     roles: ["SUPER_ADMIN","TENANT_ADMIN","ORGANIZER"], tier: "PREMIUM" },
  { href: "/scoring",      label: "Judge Scoring", icon: Trophy,          roles: ["SUPER_ADMIN","TENANT_ADMIN","ORGANIZER","JUDGE"], tier: "PREMIUM" },
  { href: "/notifications",label: "Notifications", icon: Bell,            roles: ["SUPER_ADMIN","TENANT_ADMIN","ORGANIZER"], tier: "PREMIUM" },
  { href: "/payments",     label: "Payments",      icon: CreditCard,      roles: ["SUPER_ADMIN","TENANT_ADMIN","ORGANIZER"], tier: "ULTIMATE" },
  { href: "/leaderboard",  label: "Leaderboard",   icon: BarChart2,       roles: ["SUPER_ADMIN","TENANT_ADMIN","ORGANIZER","JUDGE"], tier: "ULTIMATE" },
  { href: "/analytics",    label: "Analytics",     icon: BarChart2,       roles: ["SUPER_ADMIN","TENANT_ADMIN","ORGANIZER"], tier: "ULTIMATE" },
  { href: "/reports",      label: "Reports",       icon: FileText,        roles: ["SUPER_ADMIN","TENANT_ADMIN","ORGANIZER"] },
  { href: "/settings",     label: "Settings",      icon: Settings,        roles: ["SUPER_ADMIN","TENANT_ADMIN"] },
];

export default function Sidebar({ role }: { role: Role }) {
  const pathname = usePathname();
  const visible = navItems.filter((n) => n.roles.includes(role));

  return (
    <aside className="w-52 bg-[#1e1b4b] flex flex-col shrink-0">
      <div className="px-4 py-5 border-b border-white/10">
        <span className="text-white font-extrabold text-xl tracking-tight">BSV</span>
        <p className="text-indigo-300/40 text-[10px] uppercase font-bold tracking-wider mt-0.5">Enterprise Management</p>
      </div>
      <nav className="flex-1 px-2 py-3 overflow-y-auto space-y-0.5">
        {visible.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors",
                active
                  ? "bg-white/15 text-white font-semibold"
                  : "text-white/55 hover:bg-white/8 hover:text-white/80"
              )}
            >
              <item.icon size={15} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}