import { Suspense } from "react";
import { getAnalyticsData } from "@/lib/data/analytics";
import { TableSkeleton } from "@/components/ui/Skeletons";
import { TrendingUp, Users, ShoppingCart, Calendar, ArrowUpRight, ArrowDownRight, Activity } from "lucide-react";

export const metadata = { title: "Analytics — BSV" };

export default async function AnalyticsPage() {
  const stats = await getAnalyticsData();

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Admin Intelligence</h1>
          <p className="text-sm text-slate-500 font-medium mt-0.5 tracking-wide">Enterprise Performance & Revenue Metrics</p>
        </div>
        <div className="flex gap-3">
          <button className="px-5 py-2.5 text-xs font-black uppercase tracking-widest bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-lg transition-all active:scale-95">Generate Deep Audit</button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Gross Platform Revenue", value: `₹${stats.revenue.toLocaleString()}`, icon: ShoppingCart, trend: "+12.5%", color: "text-indigo-600", bg: "bg-indigo-50" },
          { label: "Total Active Riders", value: stats.riders, icon: Users, trend: "+3.2%", color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Event Pipeline", value: stats.events, icon: Calendar, trend: "Stable", color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Activity Volume", value: stats.activityVolume, icon: Activity, trend: "+8.1%", color: "text-rose-600", bg: "bg-rose-50" },
        ].map((kpi, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-3xl p-6 hover:border-indigo-500 hover:shadow-xl transition-all duration-500 group">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-2xl ${kpi.bg} flex items-center justify-center ${kpi.color} group-hover:scale-110 transition-transform`}>
                <kpi.icon size={24} />
              </div>
              <div className="flex items-center gap-1 text-[10px] font-black text-emerald-600 uppercase tracking-widest px-2 py-1 bg-emerald-50 rounded-lg">
                <ArrowUpRight size={12} />
                {kpi.trend}
              </div>
            </div>
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{kpi.label}</h3>
            <div className="text-2xl font-black text-slate-900 flex items-baseline gap-2">
              {kpi.value}
              <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Global Sync</span>
            </div>
          </div>
        ))}
      </div>

      {/* Primary Chart Area (Mock Visuals) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-slate-900 rounded-[2.5rem] p-10 border border-slate-800 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
            <div className="relative z-10">
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <h3 className="text-white text-xl font-black tracking-tight">Revenue Trajectory</h3>
                        <p className="text-slate-400 text-sm font-medium mt-1">Real-time financial performance audit.</p>
                    </div>
                    <div className="flex bg-white/5 border border-white/10 rounded-xl p-1">
                        <button className="px-4 py-1.5 bg-white/10 rounded-lg text-[10px] font-black text-white uppercase tracking-widest">7 Days</button>
                        <button className="px-4 py-1.5 text-[10px] font-black text-slate-500 uppercase tracking-widest">30 Days</button>
                    </div>
                </div>
                
                {/* Visual Chart Placeholder */}
                <div className="h-[300px] flex items-end gap-2 px-10">
                    {[40, 70, 45, 90, 65, 80, 50, 100, 85, 95, 60, 75].map((h, i) => (
                        <div key={i} className="flex-1 bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t-lg group relative cursor-pointer" style={{ height: `${h}%` }}>
                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-slate-900 text-[10px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">₹{h*120}</div>
                        </div>
                    ))}
                </div>
                <div className="flex items-center justify-between mt-6 px-10 text-[9px] font-black text-slate-500 uppercase tracking-widest">
                    <span>JAN 01</span>
                    <span>JAN 15</span>
                    <span>JAN 30</span>
                </div>
            </div>
        </div>

        <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-[2rem] p-8">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] mb-6">Asset Health Index</h3>
                <div className="space-y-6">
                    {[
                        { label: "Biological Compliance", value: 98, color: "bg-emerald-500" },
                        { label: "Orchestration Efficiency", value: 84, color: "bg-indigo-500" },
                        { label: "Infrastructure Load", value: 42, color: "bg-amber-500" },
                    ].map((idx, i) => (
                        <div key={i} className="space-y-2">
                             <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                <span>{idx.label}</span>
                                <span>{idx.value}%</span>
                             </div>
                             <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div className={`h-full ${idx.color} transition-all duration-1000`} style={{ width: `${idx.value}%` }} />
                             </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-indigo-600 rounded-[2rem] p-8 text-white">
                <h3 className="text-lg font-black tracking-tight mb-4 leading-tight">Insight Generator</h3>
                <p className="text-indigo-100 text-sm font-medium mb-6 leading-relaxed">System AI has detected a 12% increase in entry volume for next month's competitions.</p>
                <button className="w-full py-3 bg-white text-indigo-600 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-[0.98]">Review Projections</button>
            </div>
        </div>
      </div>
    </div>
  );
}
