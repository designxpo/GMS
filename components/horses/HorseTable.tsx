import { MoreHorizontal, ShieldCheck, Mail, User, Info, Calendar } from "lucide-react";
import Link from "next/link";
import { Horse } from "@/types";

export default function HorseTable({ horses, meta }: { horses: Horse[]; meta: any }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50/50">
            <tr>
              <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest text-nowrap">Horse / Information</th>
              <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest text-nowrap">Regulatory ID</th>
              <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest text-nowrap">Breeding / Color</th>
              <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest text-nowrap">Integrity Status</th>
              <th className="px-6 py-4 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {horses.map((horse) => (
              <tr key={horse.id} className="group hover:bg-slate-50/50 transition-colors cursor-pointer">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors font-bold text-xs uppercase">
                      {horse.name.slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{horse.name}</p>
                      <p className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                        <User size={10} />
                        Owned by: {horse.ownerName || "Private"}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                   <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-slate-600 font-bold text-xs">
                        <ShieldCheck size={14} className="text-indigo-400" />
                        FEI: {horse.feiId || "N/A"}
                      </div>
                      <p className="text-[10px] text-slate-400 font-medium ml-5">Lic: {horse.licenseNumber || "Local"}</p>
                   </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col gap-1">
                    <p className="text-xs font-bold text-slate-600">{horse.breed || "Classic"}</p>
                    <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{horse.color || "Chestnut"}</p>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    horse.status === 'ACTIVE' 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                      : 'bg-slate-50 text-slate-500 border border-slate-100'
                  }`}>
                    {horse.status}
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
            Total of {horses.length} registered assets
        </div>
        <div className="flex gap-1">
          <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600">Page {meta.page} of {meta.totalPages}</span>
        </div>
      </div>
    </div>
  );
}
