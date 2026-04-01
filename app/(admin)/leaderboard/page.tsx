import { Suspense } from "react";
import { getLeaderboard } from "@/lib/data/scoring";
import { TableSkeleton } from "@/components/ui/Skeletons";
import { Trophy, Medal, Search, Filter, TrendingUp, ChevronRight } from "lucide-react";
import Link from "next/link";

export const metadata = { title: "Leaderboard — BSV" };

export default async function LeaderboardPage({ searchParams }: { searchParams: { eventId?: string; activityId?: string } }) {
  const { eventId = "", activityId = "" } = searchParams;
  const results = await getLeaderboard(eventId, activityId);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-lg">
            <Medal size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Dynamic Ranking Engine</h1>
            <p className="text-sm text-slate-500 font-medium mt-0.5 tracking-wide flex items-center gap-2">
              <TrendingUp size={14} className="text-indigo-600" />
              Real-time Global Results & Rankings
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="px-5 py-2.5 text-xs font-black uppercase tracking-widest bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-lg shadow-emerald-600/20 transition-all flex items-center gap-2">
            <Trophy size={16} />
            Official Rankings
          </button>
        </div>
      </div>

      {/* Podium Results */}
      {results.length >= 3 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            {/* Rank 2 */}
            <div className="bg-slate-50 rounded-3xl p-6 border-b-4 border-slate-300 relative group hover:bg-white transition-all">
                <div className="absolute -top-3 -right-3 w-10 h-10 bg-slate-400 text-white rounded-full flex items-center justify-center font-black text-lg border-4 border-white shadow-lg">2</div>
                <div className="text-center">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Silver Podium</p>
                    <h3 className="text-lg font-black text-slate-900 group-hover:text-indigo-600 transition-colors uppercase truncate">{results[1].riderName}</h3>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{results[1].horseName}</p>
                    <div className="mt-4 text-2xl font-black text-slate-900">{results[1].percentage.toFixed(2)}%</div>
                </div>
            </div>

            {/* Rank 1 */}
            <div className="bg-indigo-600 rounded-[2.5rem] p-8 border-b-4 border-indigo-800 relative shadow-2xl shadow-indigo-600/30 transform hover:scale-[1.02] transition-all">
                <div className="absolute -top-4 -right-4 w-14 h-14 bg-amber-400 text-white rounded-full flex items-center justify-center font-black text-2xl border-4 border-white shadow-lg animate-bounce">1</div>
                <div className="text-center">
                    <p className="text-xs font-black text-indigo-200 uppercase tracking-widest mb-2">Gold Standard</p>
                    <h3 className="text-xl font-black text-white uppercase truncate">{results[0].riderName}</h3>
                    <p className="text-xs font-bold text-indigo-300 uppercase tracking-wider">{results[0].horseName}</p>
                    <div className="mt-6 text-4xl font-black text-white">{results[0].percentage.toFixed(2)}%</div>
                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mt-4">Scored: {results[0].totalScore} pts</p>
                </div>
            </div>

            {/* Rank 3 */}
            <div className="bg-slate-50 rounded-3xl p-6 border-b-4 border-amber-800/40 relative group hover:bg-white transition-all">
                <div className="absolute -top-3 -right-3 w-10 h-10 bg-amber-700 text-white rounded-full flex items-center justify-center font-black text-lg border-4 border-white shadow-lg">3</div>
                <div className="text-center">
                    <p className="text-xs font-black text-amber-700/50 uppercase tracking-widest mb-1">Bronze Podium</p>
                    <h3 className="text-lg font-black text-slate-900 group-hover:text-indigo-600 transition-colors uppercase truncate">{results[2].riderName}</h3>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{results[2].horseName}</p>
                    <div className="mt-4 text-2xl font-black text-slate-900">{results[2].percentage.toFixed(2)}%</div>
                </div>
            </div>
        </div>
      )}

      {/* Main Table */}
      <div className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">Global Field Results</h3>
            <Link href="#" className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest hover:underline decoration-2 underline-offset-4">Full Result Ledger</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest min-w-[100px]">Position</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Intelligence Profile</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Asset Name</th>
                <th className="px-6 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Efficiency</th>
                <th className="px-6 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Total pts</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {results.slice(results.length >= 3 ? 3 : 0).map((r) => (
                <tr key={r.riderId} className="group hover:bg-slate-50/50 transition-colors cursor-pointer">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-black text-slate-900">{r.rank}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-xs font-black text-slate-900 uppercase tracking-tight group-hover:text-indigo-600 transition-colors">{r.riderName}</p>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em]">Validated Profile</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-xs font-bold text-slate-600 group-hover:text-indigo-600 transition-colors">{r.horseName}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-indigo-50 text-indigo-600 rounded-lg border border-indigo-100 text-[10px] font-black uppercase tracking-widest">
                        {r.percentage.toFixed(2)}%
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-black text-slate-900 tracking-tight">
                    {r.totalScore}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {results.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 bg-slate-50/50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
            <Trophy size={48} className="text-slate-300 mb-4" />
            <h3 className="text-lg font-black text-slate-900">Rankings Initializing</h3>
            <p className="text-slate-500 text-sm mt-1 max-w-sm text-center font-medium leading-relaxed">No scores have been processed for the selected criteria yet. High-precision results will appear here in real-time.</p>
          </div>
      )}
    </div>
  );
}
