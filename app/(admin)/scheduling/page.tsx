import { Suspense } from "react";
import { getScheduleSlots } from "@/lib/data/scheduling";
import ScheduleTimeline from "@/components/scheduling/ScheduleTimeline";
import { TableSkeleton } from "@/components/ui/Skeletons";
import { Calendar, Search, Filter, Share2, Plus } from "lucide-react";
import Link from "next/link";

export const metadata = { title: "Scheduling — BSV" };

export default async function SchedulingPage({ searchParams }: { searchParams: { eventId?: string } }) {
  const slots = await getScheduleSlots(searchParams.eventId);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Timeline Orchestration</h1>
          <p className="text-sm text-slate-500 font-medium mt-0.5 tracking-wide">Competition Flow & Conflict Management</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 text-xs font-bold border border-slate-200 rounded-xl bg-white hover:bg-slate-50 text-slate-600 flex items-center gap-2 transition-all">
            <Share2 size={16} />
            Publish Timeline
          </button>
          <Link href="/scheduling/new" className="px-5 py-2.5 text-sm font-bold bg-[#4338ca] hover:bg-[#3730a3] text-white rounded-xl shadow-lg shadow-indigo-500/20 transition-all active:scale-95 flex items-center gap-2">
            <Plus size={18} />
            <span>Generate Slots</span>
          </Link>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex gap-2">
            <button className="px-4 py-2 bg-slate-900 text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-slate-800 transition-all shadow-lg active:scale-95">Today</button>
            <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all border border-slate-200 bg-white">
                <Calendar size={18} />
            </button>
        </div>
        <div className="flex-1 relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search Rider, Horse, or ID..." 
            className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-sm shadow-slate-100/50"
          />
        </div>
        <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all border border-slate-200 bg-white">
            <Filter size={20} />
        </button>
      </div>

      {/* Main Timeline Content */}
      <Suspense fallback={<TableSkeleton />}>
        <ScheduleTimeline slots={slots} />
      </Suspense>
    </div>
  );
}
