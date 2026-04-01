import { prisma } from "@/lib/db";
import { getServerSession } from "@/lib/auth/session";
import { ClipboardList, User, Search, Filter, MoreHorizontal, CheckCircle2, Clock, AlertTriangle } from "lucide-react";
import Link from "next/link";

export const metadata = { title: "Registrations — BSV" };

export default async function RegistrationPage() {
  const session = await getServerSession();
  if (!session) return null;
  const tenantId = session.user.tenantId;

  const registrations = await prisma.registration.findMany({
    where: { tenantId },
    include: { rider: true, event: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
            <ClipboardList size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Entry Registry</h1>
            <p className="text-sm text-slate-500 font-medium mt-0.5 tracking-wide">Tournament Admission & Participation Management</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Link href="/registration/new" className="px-5 py-2.5 text-sm font-bold bg-[#4338ca] hover:bg-[#3730a3] text-white rounded-xl shadow-lg shadow-indigo-500/20 transition-all active:scale-95 flex items-center gap-2">
            <span>Manual Entry</span>
          </Link>
        </div>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Admissions", value: registrations.length, color: "text-slate-900" },
          { label: "Validated", value: registrations.filter(r => r.status === 'APPROVED').length, color: "text-emerald-600" },
          { label: "Pending Scrutiny", value: registrations.filter(r => r.status === 'PENDING').length, color: "text-amber-600" },
          { label: "Scratched", value: registrations.filter(r => r.status === 'REFUNDED').length, color: "text-rose-600" },
        ].map((s, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-3xl p-5">
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">{s.label}</span>
             <span className={`text-2xl font-black ${s.color}`}>{s.value}</span>
          </div>
        ))}
      </div>

      {/* Main Table */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest min-w-[150px]">Entity Profile</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Tournament Intel</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest text-nowrap">Asset Compliance</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Entry Fee</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest text-nowrap">Status Code</th>
                <th className="px-6 py-4 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {registrations.map((reg) => (
                <tr key={reg.id} className="group hover:bg-slate-50/50 transition-colors cursor-pointer">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors font-bold text-xs">
                         {reg.rider?.firstName[0]}
                        </div>
                        <div>
                         <p className="text-xs font-black text-slate-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{reg.rider?.firstName} {reg.rider?.lastName}</p>
                        </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-xs font-bold text-slate-600">{reg.event?.name}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Asset ID: {reg.horseId.slice(0, 8)}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-xs font-black text-slate-900">₹{reg.totalFee.toLocaleString()}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                        reg.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-slate-50 text-slate-500 border-slate-100'
                    }`}>
                      {reg.status === 'APPROVED' && <CheckCircle2 size={12} />}
                      {reg.status}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="hover:text-indigo-600">
                      <MoreHorizontal size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

       {registrations.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-200">
            <ClipboardList size={48} className="text-slate-300 mb-4" />
            <h3 className="text-lg font-black text-slate-900">Admissions Queue Ready</h3>
            <p className="text-slate-500 text-sm mt-1 max-w-sm text-center font-medium leading-relaxed">No registrations found in the BSV results engine. Begin onboarding riders to populate this registry.</p>
          </div>
       )}
    </div>
  );
}
