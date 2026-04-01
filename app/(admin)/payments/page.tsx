import { prisma } from "@/lib/db";
import { getServerSession } from "@/lib/auth/session";
import { CreditCard, ShoppingBag, ShoppingCart, Search, Filter, MoreHorizontal, CheckCircle2, TrendingUp, AlertCircle, IndianRupee } from "lucide-react";

export const metadata = { title: "Payments — BSV" };

export default async function PaymentsPage() {
  const session = await getServerSession();
  if (!session) return null;
  const tenantId = session.user.tenantId;

  const payments = await prisma.payment.findMany({
    where: { tenantId },
    orderBy: { createdAt: "desc" },
    include: {
        registration: {
            include: {
                rider: true
            }
        }
    }
  });

  const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
            <IndianRupee size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Settlement Desk</h1>
            <p className="text-sm text-slate-500 font-medium mt-0.5 tracking-wide">Financial Orchestration & Revenue Reconciliation</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="px-5 py-2.5 text-xs font-black uppercase tracking-widest bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-lg transition-all active:scale-95">Reconcile All</button>
        </div>
      </div>

      {/* Revenue Card */}
      <div className="bg-slate-900 rounded-[2.5rem] p-10 border border-slate-800 relative overflow-hidden group">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
        <div className="relative z-10 flex items-end justify-between">
            <div className="space-y-2">
                <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-[0.2em]">
                    <TrendingUp size={14} />
                    <span>Validated Net Settlement</span>
                </div>
                <h2 className="text-white text-5xl font-black tracking-tight">
                    ₹{totalAmount.toLocaleString()}
                    <span className="text-lg text-slate-500 ml-3">INR</span>
                </h2>
                <p className="text-slate-400 text-sm font-medium">Real-time revenue stream synced with global gateway.</p>
            </div>
            <ShoppingCart size={80} className="text-white/5 group-hover:scale-110 transition-transform duration-700" />
        </div>
      </div>

      {/* Main Ledger */}
      <div className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest px-4 py-1.5 bg-slate-50 rounded-xl border border-slate-100">Transaction Intelligence</h3>
            <div className="flex gap-2">
                <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all border border-slate-200 bg-white">
                    <Filter size={18} />
                </button>
            </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Client Identity</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Settlement Code</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Processing Time</th>
                <th className="px-6 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                <th className="px-6 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Status Code</th>
                <th className="px-6 py-4 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {payments.map((p) => (
                <tr key={p.id} className="group hover:bg-slate-50/50 transition-colors cursor-pointer">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-xs font-black text-slate-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">
                        {p.registration?.rider?.firstName} {p.registration?.rider?.lastName || 'N/A SYSTEM'}
                    </p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Validated Payer</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">TXN: {p.id.slice(0, 8)}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{new Date(p.createdAt).toLocaleDateString()} • {new Date(p.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <p className="text-sm font-black text-slate-900 tracking-tight">₹{p.amount.toLocaleString()}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100 bg-emerald-50 text-emerald-700`}>
                      <CheckCircle2 size={12} />
                      {p.status}
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

       {payments.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 bg-slate-50/50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
            <CreditCard size={48} className="text-slate-300 mb-4" />
            <h3 className="text-lg font-black text-slate-900">Financial Stream Empty</h3>
             <p className="text-slate-500 text-sm mt-1 max-w-sm text-center font-medium leading-relaxed">System is ready for orchestration. All incoming financial settlements will be audited and logged here.</p>
          </div>
       )}
    </div>
  );
}
