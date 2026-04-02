import { prisma } from "@/lib/db";
import { getServerSession } from "@/lib/auth/session";
import { ShieldCheck, User, QrCode, Search, Filter, MoreHorizontal, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";

export const metadata = { title: "Accreditation — BSV" };

export default async function AccreditationPage() {
  const session = await getServerSession();
  if (!session) return null;
  const tenantId = session.user.tenantId;

  const accreditations = await prisma.accreditation.findMany({
    where: { tenantId },
    include: { rider: true, event: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-lg">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Identity & Access</h1>
            <p className="text-sm text-slate-500 font-medium mt-0.5 tracking-wide">Security Clearance & Official Accreditation</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Link href="/accreditation/new" className="px-5 py-2.5 text-xs font-black uppercase tracking-widest bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-600/30 transition-all active:scale-95">Issue Badge</Link>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="flex items-center gap-8 bg-slate-50/50 p-4 rounded-3xl border border-slate-100 px-8">
        {[
          { label: "Active Clearances", value: accreditations.length, color: "text-emerald-600" },
          { label: "Revoked Rights", value: 0, color: "text-rose-600" },
          { label: "Pending Verification", value: 0, color: "text-amber-600" },
        ].map((s, i) => (
          <div key={i} className="flex flex-col">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</span>
            <span className={`text-xl font-black ${s.color}`}>{s.value}</span>
          </div>
        ))}
      </div>

      {/* Accreditation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accreditations.map((acc) => (
           <div key={acc.id} className="group bg-white border border-slate-200 rounded-[2rem] p-6 hover:border-indigo-500 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 relative overflow-hidden">
                <div className="flex items-start justify-between mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                        <User size={32} />
                    </div>
                     <div className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                        acc.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-slate-50 text-slate-500 border-slate-100'
                    }`}>
                        {acc.status}
                    </div>
                </div>

                <div className="space-y-4 mb-6">
                    <div>
                        <h4 className="text-xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors truncate">{acc.rider?.firstName} {acc.rider?.lastName}</h4>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">{acc.type}</p>
                    </div>

                    <div className="flex flex-wrap gap-1">
                        {acc.accessZones.map((z, i) => (
                          <span key={i} className="text-[9px] font-black px-2 py-0.5 bg-slate-900 text-white rounded-lg uppercase tracking-tight">{z}</span>
                        ))}
                    </div>
                </div>

                <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Badge ID</p>
                        <p className="text-sm font-black text-slate-900">{acc.badgeNumber || 'TRIAL-00'}</p>
                    </div>
                    <div className="w-10 h-10 border-2 border-slate-100 rounded-xl flex items-center justify-center text-slate-300">
                        <QrCode size={20} />
                    </div>
                </div>
           </div>
        ))}

        {accreditations.length === 0 && (
             <div className="lg:col-span-3 flex flex-col items-center justify-center py-20 bg-slate-50/50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
                <AlertCircle size={48} className="text-slate-300 mb-4" />
                <h3 className="text-lg font-black text-slate-900 underline decoration-indigo-500 decoration-4">Clearance Registry Empty</h3>
                <p className="text-slate-500 text-sm mt-1 max-w-xs text-center font-medium leading-relaxed">System identity profiles will appear here as badges are issued and identities verified.</p>
             </div>
        )}
      </div>
    </div>
  );
}