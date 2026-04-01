import { MoreHorizontal, User, Mail, ShieldCheck } from "lucide-react";

export default function RiderTable({ riders, meta }: { riders: any[]; meta: any }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50/50">
            <tr>
              <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Identify / Profile</th>
              <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Security / License</th>
              <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Connectivity</th>
              <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Integrity Status</th>
              <th className="px-6 py-4 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {riders.map((rider) => (
              <tr key={rider.id} className="group hover:bg-slate-50/50 transition-colors cursor-pointer">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors font-bold text-xs">
                      {rider.firstName[0]}{rider.lastName[0]}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{rider.firstName} {rider.lastName}</p>
                      <p className="text-[11px] text-slate-400 font-medium">Synced ID: {rider.id.slice(0,8)}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                   <div className="flex items-center gap-2 text-slate-600 font-bold text-xs">
                     <ShieldCheck size={14} className="text-indigo-400" />
                     {rider.licenseNumber || "N/A"}
                   </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2 text-slate-500 font-medium text-xs">
                    <Mail size={14} className="text-slate-300" />
                    {rider.email}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    rider.status === 'ACTIVE' 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                      : 'bg-slate-50 text-slate-500 border border-slate-100'
                  }`}>
                    {rider.status}
                  </span>
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
      <div className="bg-slate-50/50 px-6 py-4 flex items-center justify-between border-t border-slate-100">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Showing {riders.length} Intelligence Units
        </div>
        <div className="flex gap-1">
          <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600">Page {meta.page} of {meta.totalPages}</span>
        </div>
      </div>
    </div>
  );
}
