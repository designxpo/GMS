import { prisma } from "@/lib/db";
import { getServerSession } from "@/lib/auth/session";
import { Bell, Info, ShieldAlert, CheckCircle2, Search, Filter, MoreVertical, Terminal } from "lucide-react";

export const metadata = { title: "Notifications — BSV" };

export default async function NotificationsPage() {
  const session = await getServerSession();
  if (!session) return null;
  const tenantId = session.user.tenantId;

  // Fetch recent audit logs as system notifications
  const logs = await prisma.auditLog.findMany({
    where: { tenantId },
    orderBy: { createdAt: "desc" },
    take: 20
  });

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
            <Bell size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">System Awareness</h1>
            <p className="text-sm text-slate-500 font-medium mt-0.5 tracking-wide">Audit Intelligence & Real-time Event Stream</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="px-5 py-2 text-xs font-black uppercase tracking-widest bg-slate-900 hover:bg-slate-800 text-white rounded-xl transition-all active:scale-95">Clear Activity</button>
        </div>
      </div>

      {/* Main Notification Stream */}
      <div className="space-y-4">
        {logs.map((log) => (
           <div key={log.id} className="group bg-white border border-slate-200 rounded-3xl p-5 hover:border-indigo-500 hover:shadow-xl transition-all duration-300 flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-6">
                    <div className="flex flex-col items-center justify-center min-w-[70px] border-r border-slate-100 pr-6">
                        <span className="text-xs font-black text-slate-900 uppercase tracking-tighter">
                            {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{new Date(log.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                    </div>

                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                             <div className={`p-1.5 rounded-lg border ${
                                log.action.includes('create') ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                log.action.includes('delete') ? 'bg-rose-50 text-rose-600 border-rose-100' :
                                'bg-indigo-50 text-indigo-600 border-indigo-100'
                             }`}>
                                <Terminal size={12} />
                             </div>
                            <h4 className="text-sm font-black text-slate-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">
                                {log.action.replace('.', ' / ')}
                            </h4>
                        </div>
                        <p className="text-xs text-slate-500 font-medium line-clamp-1 max-w-xl">
                            Entity {log.entityType} ({log.entityId.slice(0, 8)}) was processed from IP {log.ipAddress || '127.0.0.1'}.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button className="p-2 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                        <MoreVertical size={16} />
                    </button>
                </div>
           </div>
        ))}

        {logs.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-200">
                <ShieldAlert size={48} className="text-slate-300 mb-4" />
                <h3 className="text-lg font-black text-slate-900">System Silence</h3>
                <p className="text-slate-500 text-sm mt-1">Activity logs and regulatory notifications will appear here as they occur.</p>
            </div>
        )}
      </div>
    </div>
  );
}
