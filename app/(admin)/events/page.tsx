import { getEvents } from "@/lib/data/events";
import EventCard from "@/components/events/EventCard";
import Link from "next/link";
import { BSV } from "@/types/company";

import { Plus, Calendar, Settings2 } from "lucide-react";

export const metadata = { title: "Events — BSV" };

export default async function EventsPage() {
  const { data: events } = await getEvents();
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-5 mb-2">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Event Pipeline</h1>
          <p className="text-sm text-slate-500 font-medium mt-0.5">Global Scheduling & Competition Management</p>
        </div>
        <div className="flex gap-3">
          <button className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all border border-slate-200 bg-white">
            <Settings2 size={20} />
          </button>
          <Link href="/events/new" className="px-5 py-2.5 text-sm font-bold bg-[#4338ca] hover:bg-[#3730a3] text-white rounded-xl shadow-lg shadow-indigo-500/20 transition-all active:scale-95 flex items-center gap-2">
            <Plus size={18} />
            <span>Schedule Event</span>
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-4 bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100/50">
        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-100">
          <Calendar size={20} />
        </div>
        <div>
          <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Active Schedule</p>
          <p className="text-sm font-semibold text-indigo-900">{events.length} Competitions Live or Pending</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {events.map((ev: import("@/types").EquiEvent) => <EventCard key={ev.id} event={ev} />)}
      </div>
    </div>
  );
}