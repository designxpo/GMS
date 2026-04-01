import { MapPin, Calendar, Clock, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function EventCard({ event }: { event: any }) {
  return (
    <div className="group bg-white border border-slate-200 rounded-3xl p-6 hover:border-indigo-500 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-5 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
        <ChevronRight className="text-indigo-600" />
      </div>
      
      <div className="flex items-start justify-between mb-4">
        <div className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
          event.status === 'PUBLISHED' 
            ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
            : 'bg-amber-50 text-amber-700 border-amber-100'
        }`}>
          {event.status}
        </div>
      </div>

      <h2 className="text-xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors mb-2 tracking-tight">{event.name}</h2>
      
      <div className="space-y-3 mt-4">
        <div className="flex items-center gap-2 text-slate-500 font-medium text-xs">
          <MapPin size={14} className="text-slate-300 group-hover:text-indigo-400 transition-colors" />
          {event.venue?.name || "Global Venue"}
        </div>
        
        <div className="flex items-center gap-2 text-slate-500 font-medium text-xs">
          <Calendar size={14} className="text-slate-300 group-hover:text-indigo-400 transition-colors" />
          <span>{new Date(event.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} - {new Date(event.endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
        </div>
      </div>

      <div className="mt-8 pt-4 border-t border-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          <Clock size={12} />
          <span>ID: {event.id.slice(0, 8)}</span>
        </div>
        <Link href={`/events/${event.id}`} className="text-xs font-black text-indigo-600 hover:underline decoration-2 underline-offset-4">
          Manage Intelligence
        </Link>
      </div>
    </div>
  );
}
