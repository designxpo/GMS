import { Suspense } from "react";
import { getJudgeQueue } from "@/lib/data/scoring";
import { getVenues } from "@/lib/data/venues";
import ScoringDesk from "@/components/scoring/ScoringDesk";
import { TableSkeleton } from "@/components/ui/Skeletons";
import { Trophy, Search, Activity, ChevronDown } from "lucide-react";

export const metadata = { title: "Scoring Desk — BSV" };

export default async function ScoringPage({ searchParams }: { searchParams: { eventId?: string; ringId?: string } }) {
  const { eventId = "", ringId = "" } = searchParams;
  const { current, upcoming } = await getJudgeQueue(eventId, ringId);
  const venues = await getVenues();

  return (
    <div className="space-y-6">
      {/* Selection Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
            <Trophy size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none">Scoring Desk</h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1.5 flex items-center gap-2">
              <Activity size={10} className="text-emerald-500" />
              Real-time Judge Scrutiny Module
            </p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <div className="relative">
            <select className="appearance-none bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold text-slate-600 focus:ring-2 focus:ring-indigo-500/20 outline-none pr-10 transition-all cursor-pointer min-w-[200px]">
              <option>Select Active Venue</option>
              {venues.data.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
          </div>
          <div className="relative">
            <select className="appearance-none bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold text-slate-600 focus:ring-2 focus:ring-indigo-500/20 outline-none pr-10 transition-all cursor-pointer min-w-[200px]">
              <option>Select Competition Ring</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
          </div>
        </div>
      </div>

      <Suspense fallback={<TableSkeleton />}>
        <ScoringDesk currentSlot={current} upcoming={upcoming} />
      </Suspense>
    </div>
  );
}
