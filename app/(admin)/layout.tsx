// ─────────────────────────────────────────────────────────────
// app/(admin)/layout.tsx
// ─────────────────────────────────────────────────────────────
import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth/session";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";

export const dynamic = "force-dynamic";


export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();
  if (!session) redirect("/login");

  const allowedRoles = ["SUPER_ADMIN", "TENANT_ADMIN", "ORGANIZER", "JUDGE"];
  if (!allowedRoles.includes(session.user.role)) redirect("/rider/dashboard");

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar role={session.user.role} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar user={session.user} />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}