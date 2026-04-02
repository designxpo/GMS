import { getActivities } from "@/lib/data/activities";
import { Plus, Layers, Activity as ActivityIcon, ChevronRight } from "lucide-react";
import Link from "next/link";

export const metadata = { title: "Activities — BSV" };

export default async function ActivitiesPage() {
  const result = await getActivities();

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Competition Registry</h1>
          <p className="text-sm text-slate-500 font-medium mt-0.5 tracking-wide">Global Discipline & Activity Templates</p>
        </div>
        <div className="flex gap-3">
          <Link href="/activities/new" className="px-5 py-2.5 text-sm font-bold bg-[#4338ca] hover:bg-[#3730a3] text-white rounded-xl shadow-lg shadow-indigo-500/20 transition-all active:scale-95 flex items-center gap-2">
            <Plus size={18} />
            <span>Create Activity</span>
          </Link>
        </div>
      </div>

      {/* Grid of Activities */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {result.data.map((activity) => (
          <div key={activity.id} className="group bg-white border border-slate-200 rounded-3xl p-6 hover:border-indigo-500 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 relative overflow-hidden cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                <ActivityIcon size={24} />
              </div>
              <div className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-50 text-slate-500 border border-slate-100">
                {activity.eventActivities.length} Events
              </div>
            </div>

            <h3 className="text-lg font-black text-slate-900 group-hover:text-indigo-600 transition-colors mb-2">{activity.name}</h3>
            <p className="text-sm text-slate-500 font-medium line-clamp-2 mb-6">
              {activity.description || "Standard competition template with predefined criteria and regulatory scoring modules."}
            </p>

            <div className="pt-4 border-t border-slate-50 flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
              <span>Template ID: {activity.id.slice(0, 8)}</span>
              <ChevronRight size={16} />
            </div>
          </div>
        ))}
      </div>

      {result.data.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-200">
          <Layers size={48} className="text-slate-300 mb-4" />
          <h3 className="text-lg font-bold text-slate-900">No Activity Templates</h3>
          <p className="text-slate-500 text-sm mt-1">Create your first discipline template to begin event configuration.</p>
        </div>
      )}
    </div>
  );
}
