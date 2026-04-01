import { MapPin, Layers, Calendar, Info, MoreHorizontal, Building2 } from "lucide-react";
import Link from "next/link";
import { VenueWithRelations } from "@/lib/data/venues";

export default function VenueTable({ venues }: { venues: VenueWithRelations[] }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50/50">
            <tr>
              <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Site / Infrastructure</th>
              <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Arena Topology</th>
              <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Activity / Load</th>
              <th className="px-6 py-4 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {venues.map((venue) => (
              <tr key={venue.id} className="group hover:bg-slate-50/50 transition-colors cursor-pointer">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors font-bold text-xs uppercase">
                      {venue.name.slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{venue.name}</p>
                      <p className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                        <MapPin size={10} />
                        {venue.address || "Main Site"}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                   <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-slate-600 font-bold text-xs">
                        <Layers size={14} className="text-indigo-400" />
                        {venue._count.rings} Active Competition Rings
                      </div>
                      <div className="flex gap-1">
                        {venue.rings.slice(0, 2).map((r: any) => (
                          <span key={r.id} className="text-[9px] font-bold px-1.5 py-0.5 bg-slate-50 text-slate-400 rounded border border-slate-100 uppercase">{r.name}</span>
                        ))}
                         {venue._count.rings > 2 && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 bg-slate-50 text-slate-400 rounded border border-slate-100 uppercase">+{venue._count.rings - 2}</span>
                         )}
                      </div>
                   </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2 text-slate-600 font-bold text-xs bg-indigo-50/30 px-3 py-1.5 rounded-xl border border-indigo-100/30 w-fit">
                    <Calendar size={14} className="text-indigo-600" />
                    {venue._count.events} Scheduled Competitions
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
      <div className="bg-slate-50/50 px-6 py-4 flex items-center justify-between border-t border-slate-100">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Showing {venues.length} Managed Facilities
        </div>
        <div className="flex gap-1">
           <button className="px-4 py-2 text-xs font-bold border border-slate-200 rounded-xl bg-white hover:bg-slate-50 text-slate-600 flex items-center gap-2 transition-all">
            Manage Topology
          </button>
        </div>
      </div>
    </div>
  );
}
