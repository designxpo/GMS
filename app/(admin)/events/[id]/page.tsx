import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getServerSession } from "@/lib/auth/session";
import { publishEvent, cloneEvent } from "@/app/actions/events";
import Link from "next/link";
import {
  ArrowLeft, Calendar, MapPin, Activity, Users, CheckCircle2,
  Clock, Copy, Send, ChevronRight, Tag, AlertTriangle
} from "lucide-react";

export const dynamic = "force-dynamic";

interface Props { params: { id: string } }

const STATUS_STYLES: Record<string, string> = {
  DRAFT: "bg-slate-100 text-slate-600 border-slate-200",
  SCHEDULED: "bg-amber-50 text-amber-700 border-amber-200",
  PUBLISHED: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

export default async function EventDetailPage({ params }: Props) {
  const session = await getServerSession();
  if (!session) return null;

  const event = await prisma.event.findFirst({
    where: { id: params.id, tenantId: session.user.tenantId },
    include: {
      venue: { include: { rings: true } },
      activities: { include: { activity: true, judgeAssignments: true } },
      registrations: { include: { rider: true }, take: 10, orderBy: { createdAt: "desc" } },
      checkIns: { select: { id: true, status: true } },
      scheduleSlots: { select: { id: true, hasConflict: true } },
    },
  });

  if (!event) notFound();

  const conflictCount = event.scheduleSlots.filter(s => s.hasConflict).length;
  const checkInStats = {
    total: event.checkIns.length,
    done: event.checkIns.filter(c => c.status === "CHECKED_IN").length,
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-slate-100 pb-6">
        <div className="flex items-center gap-4">
          <Link href="/events" className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all border border-slate-200">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">{event.name}</h1>
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${STATUS_STYLES[event.status] ?? STATUS_STYLES.DRAFT}`}>
                {event.status}
              </span>
            </div>
            <p className="text-sm text-slate-400 font-medium">{event.discipline ?? "General Competition"}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <form action={cloneEvent.bind(null, event.id)}>
            <button type="submit" className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-600 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 transition-all">
              <Copy size={14} /> Clone
            </button>
          </form>
          {event.status === "DRAFT" && (
            <form action={publishEvent.bind(null, event.id)}>
              <button type="submit" disabled={conflictCount > 0} className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl shadow-lg shadow-emerald-600/20 transition-all active:scale-[0.98]">
                <Send size={14} /> Publish Event
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Conflict warning */}
      {conflictCount > 0 && (
        <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-800">
          <AlertTriangle size={18} className="shrink-0" />
          <p className="text-sm font-medium">
            <span className="font-bold">{conflictCount} scheduling conflict{conflictCount > 1 ? "s" : ""}</span> must be resolved before publishing.{" "}
            <Link href={`/scheduling?eventId=${event.id}`} className="underline font-bold">Fix now →</Link>
          </p>
        </div>
      )}

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Registrations", value: event.registrations.length, icon: Users, color: "text-indigo-600 bg-indigo-50" },
          { label: "Activities", value: event.activities.length, icon: Activity, color: "text-amber-600 bg-amber-50" },
          { label: "Check-ins", value: `${checkInStats.done}/${checkInStats.total}`, icon: CheckCircle2, color: "text-emerald-600 bg-emerald-50" },
          { label: "Conflicts", value: conflictCount, icon: AlertTriangle, color: conflictCount > 0 ? "text-rose-600 bg-rose-50" : "text-slate-400 bg-slate-50" },
        ].map((s, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-3xl p-5">
            <div className={`w-10 h-10 rounded-xl ${s.color.split(" ")[1]} flex items-center justify-center ${s.color.split(" ")[0]} mb-3`}>
              <s.icon size={20} />
            </div>
            <div className="text-2xl font-black text-slate-900">{s.value}</div>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Event Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-[2rem] p-8 space-y-5">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest">Event Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                  <Calendar size={16} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Dates</p>
                  <p className="text-sm font-bold text-slate-900 mt-0.5">
                    {new Date(event.startDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                  <p className="text-xs text-slate-400">to {new Date(event.endDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                  <MapPin size={16} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Venue</p>
                  <p className="text-sm font-bold text-slate-900 mt-0.5">{event.venue?.name ?? event.venueName ?? "TBD"}</p>
                  {event.venue?.address && <p className="text-xs text-slate-400">{event.venue.address}</p>}
                </div>
              </div>
              {event.discipline && (
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                    <Tag size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Discipline</p>
                    <p className="text-sm font-bold text-slate-900 mt-0.5">{event.discipline}</p>
                  </div>
                </div>
              )}
            </div>
            {event.description && (
              <div className="pt-4 border-t border-slate-50">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Description</p>
                <p className="text-sm text-slate-600 font-medium leading-relaxed">{event.description}</p>
              </div>
            )}
          </div>

          {/* Activities */}
          <div className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xs font-black text-slate-900 uppercase tracking-widest">Competition Activities</h2>
              <Link href={`/events/${event.id}/edit`} className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest hover:underline">
                Manage →
              </Link>
            </div>
            {event.activities.length > 0 ? (
              <div className="divide-y divide-slate-50">
                {event.activities.map(ea => (
                  <div key={ea.id} className="px-6 py-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-slate-900">{ea.activity.name}</p>
                      <p className="text-xs text-slate-400 font-medium">{ea.judgeAssignments.length} judge{ea.judgeAssignments.length !== 1 ? "s" : ""} assigned</p>
                    </div>
                    <span className="text-sm font-black text-slate-900">₹{ea.fee.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-6 py-10 text-center">
                <p className="text-slate-400 text-sm font-medium">No activities yet. <Link href={`/events/${event.id}/edit`} className="text-indigo-600 font-bold underline">Add activities →</Link></p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white border border-slate-200 rounded-[2rem] p-6 space-y-3">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Quick Actions</h2>
            {[
              { label: "Manage Registrations", href: `/registration?eventId=${event.id}`, icon: Users },
              { label: "Check-in Terminal", href: `/checkin?event=${event.id}`, icon: CheckCircle2 },
              { label: "Schedule Timeline", href: `/scheduling?eventId=${event.id}`, icon: Clock },
              { label: "Scoring Desk", href: `/scoring?eventId=${event.id}`, icon: Activity },
              { label: "Leaderboard", href: `/leaderboard?eventId=${event.id}`, icon: Activity },
            ].map(action => (
              <Link key={action.href} href={action.href} className="flex items-center justify-between p-3 rounded-2xl hover:bg-indigo-50 group transition-colors">
                <div className="flex items-center gap-3">
                  <action.icon size={16} className="text-slate-400 group-hover:text-indigo-600 transition-colors" />
                  <span className="text-sm font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">{action.label}</span>
                </div>
                <ChevronRight size={14} className="text-slate-300 group-hover:text-indigo-400 transition-colors" />
              </Link>
            ))}
          </div>

          {/* Recent Registrations */}
          <div className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-xs font-black text-slate-900 uppercase tracking-widest">Recent Entries</h2>
            </div>
            {event.registrations.length > 0 ? (
              <div className="divide-y divide-slate-50">
                {event.registrations.slice(0, 5).map(reg => (
                  <div key={reg.id} className="px-6 py-3 flex items-center justify-between">
                    <p className="text-sm font-bold text-slate-900 truncate">{reg.rider.firstName} {reg.rider.lastName}</p>
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${reg.status === "APPROVED" ? "bg-emerald-50 text-emerald-700" : "bg-slate-50 text-slate-500"}`}>{reg.status}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-6 py-8 text-center">
                <p className="text-slate-400 text-xs font-medium">No registrations yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
