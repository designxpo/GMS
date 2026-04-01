import { Clock, User, ShieldAlert, CheckCircle2, MoreVertical, LayoutGrid } from "lucide-react";

export default function ScheduleTimeline({ slots }: { slots: any[] }) {
  if (slots.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-200">
        <Clock size={48} className="text-slate-300 mb-4" />
        <h3 className="text-lg font-bold text-slate-900">Dynamic Timeline Ready</h3>
        <p className="text-slate-500 text-sm mt-1">Select an active event to begin real-time slot orchestration.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {slots.map((slot) => (
        <div key={slot.id} className={`group bg-white border rounded-2xl p-5 hover:shadow-xl transition-all duration-300 flex items-center justify-between ${
          slot.hasConflict ? 'border-amber-200 bg-amber-50/10' : 'border-slate-200 hover:border-indigo-500'
        }`}>
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-center justify-center min-w-[80px] border-r border-slate-100 pr-6">
              <span className="text-sm font-black text-slate-900 tracking-tight">
                {new Date(slot.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">ID: {slot.id.slice(0,4)}</span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest bg-slate-900 text-white px-2 py-0.5 rounded">
                  {slot.ring?.name || "Main Arena"}
                </span>
                <h4 className="text-sm font-black text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {slot.rider.firstName} {slot.rider.lastName} / {slot.horse.name}
                </h4>
              </div>
              <p className="text-xs text-slate-500 font-medium flex items-center gap-2">
                <LayoutGrid size={12} className="text-slate-300" />
                {slot.event.name} • Competition Slot
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {slot.hasConflict ? (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 text-amber-600 rounded-xl border border-amber-100 animate-pulse">
                <ShieldAlert size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest leading-none">Conflict Detected</span>
              </div>
            ) : (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
                    <CheckCircle2 size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest leading-none">Validated</span>
                </div>
            )}
            <button className="p-2 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                <MoreVertical size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
