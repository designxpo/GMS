import { getCheckIns } from "@/lib/data/checkin";
import CheckInTable from "@/components/checkin/CheckInTable";
import CheckInStats from "@/components/checkin/CheckInStats";

import { getEvents } from "@/lib/data/events";
import { Search, QrCode, Share2, Filter, ChevronRight, LayoutGrid } from "lucide-react";
import Link from "next/link";

interface Props { searchParams: { event?: string } }

export default async function CheckInPage({ searchParams }: Props) {
  const eventId = searchParams.event ?? "";
  const { data: events } = await getEvents();

  if (!eventId) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 py-10">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Check-in Terminal</h1>
          <p className="text-slate-500 font-medium tracking-wide text-sm">Select an active competition to begin high-speed accreditation</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {events.length > 0 ? (
            events.map((ev) => (
              <Link
                key={ev.id}
                href={`?event=${ev.id}`}
                className="group flex flex-col p-6 bg-white border border-slate-200 rounded-3xl hover:border-indigo-500 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ChevronRight className="text-indigo-600" />
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <LayoutGrid size={20} />
                  </div>
                  <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">{ev.status}</span>
                </div>
                <h3 className="text-lg font-extrabold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors truncate">{ev.name}</h3>
                <p className="text-sm text-slate-400 font-medium truncate">
                  {typeof ev.venue === 'object' ? ev.venue?.name : (ev.venue || "Global Venue")}
                </p>
              </Link>
            ))
          ) : (
            <div className="md:col-span-2 p-12 bg-slate-50 rounded-3xl border border-dashed border-slate-200 text-center">
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No Events Found</p>
              <p className="text-slate-500 mt-2">Active events will appear here for check-in management.</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  const { data: checkIns, stats } = await getCheckIns(eventId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Accreditation Access</h1>
          <p className="text-sm text-slate-500 font-medium mt-0.5 flex items-center gap-2">
             <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
             Active Check-in Session · Real-time Sync
          </p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 text-xs font-bold border border-slate-200 rounded-xl bg-white hover:bg-slate-50 text-slate-600 flex items-center gap-2 transition-all">
            <Share2 size={14} />
            Export Data
          </button>
          <button className="px-5 py-2.5 text-sm font-bold bg-[#4338ca] hover:bg-[#3730a3] text-white rounded-xl shadow-lg shadow-indigo-500/20 transition-all active:scale-95 flex items-center gap-2">
            <QrCode size={18} />
            <span>Launch Scanner</span>
          </button>
        </div>
      </div>
      <CheckInStats stats={stats} />
      <CheckInTable checkIns={checkIns} eventId={eventId} />
    </div>
  );
}