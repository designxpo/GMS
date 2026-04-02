"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createScheduleSlot } from "@/app/actions/scheduling";
import { ArrowLeft, Calendar, AlertTriangle } from "lucide-react";
import Link from "next/link";

interface Event { id: string; name: string }
interface Rider { id: string; firstName: string; lastName: string; licenseNumber: string }
interface Horse { id: string; name: string }
interface Venue { id: string; name: string; rings: { id: string; name: string }[] }

export default function NewScheduleSlotPage() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [riders, setRiders] = useState<Rider[]>([]);
  const [horses, setHorses] = useState<Horse[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [rings, setRings] = useState<{ id: string; name: string }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/data/events").then(r => r.json()),
      fetch("/api/data/riders").then(r => r.json()),
      fetch("/api/data/horses").then(r => r.json()),
      fetch("/api/data/venues").then(r => r.json()),
    ]).then(([ev, ri, ho, ve]) => {
      setEvents(ev.data ?? []);
      setRiders(ri.data ?? []);
      setHorses(ho.data ?? []);
      setVenues(ve.data ?? []);
      setLoading(false);
    });
  }, []);

  function onEventChange(eventId: string) {
    setSelectedEvent(eventId);
    // Auto-set rings from the first venue of matching events
    // For now show rings from all venues
    const allRings = venues.flatMap(v => v.rings);
    setRings(allRings);
  }

  useEffect(() => {
    const allRings = venues.flatMap(v => v.rings);
    setRings(allRings);
  }, [venues]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const eventId = form.get("eventId") as string;
    const riderId = form.get("riderId") as string;
    const horseId = form.get("horseId") as string;
    const ringId = form.get("ringId") as string;
    const startTime = form.get("startTime") as string;
    const endTime = form.get("endTime") as string;

    if (!eventId || !riderId || !horseId || !startTime || !endTime) {
      setError("Event, Rider, Horse, and time range are required");
      return;
    }
    if (new Date(startTime) >= new Date(endTime)) {
      setError("End time must be after start time");
      return;
    }

    setSaving(true);
    setError(null);
    setWarning(null);
    try {
      const slot = await createScheduleSlot({
        eventId,
        riderId,
        horseId,
        ringId: ringId || null,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
      });
      if (slot.hasConflict) {
        setWarning("Slot created but a scheduling conflict was detected. Please review the timeline.");
        setTimeout(() => router.push("/scheduling"), 3000);
      } else {
        router.push("/scheduling");
      }
    } catch (err: any) {
      setError(err.message ?? "Failed to create schedule slot");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-4 border-b border-slate-100 pb-5">
        <Link href="/scheduling" className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all border border-slate-200">
          <ArrowLeft size={18} />
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-md">
            <Calendar size={20} />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">Generate Schedule Slot</h1>
            <p className="text-xs text-slate-400 font-medium">Timeline & Ring Assignment</p>
          </div>
        </div>
      </div>

      {error && <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-sm text-rose-700 font-medium">{error}</div>}
      {warning && (
        <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-2xl">
          <AlertTriangle size={16} className="text-amber-600 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800 font-medium">{warning}</p>
        </div>
      )}

      {loading ? (
        <div className="bg-white border border-slate-200 rounded-[2rem] p-12 flex items-center justify-center">
          <div className="animate-pulse text-slate-400 text-sm font-medium">Loading data…</div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-[2rem] p-8 space-y-6">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Event *</label>
            <select name="eventId" required value={selectedEvent} onChange={e => onEventChange(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-medium text-slate-900 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all">
              <option value="">Select event…</option>
              {events.map(ev => <option key={ev.id} value={ev.id}>{ev.name}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rider *</label>
              <select name="riderId" required className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-medium text-slate-900 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all">
                <option value="">Select rider…</option>
                {riders.map(r => <option key={r.id} value={r.id}>{r.firstName} {r.lastName}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Horse *</label>
              <select name="horseId" required className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-medium text-slate-900 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all">
                <option value="">Select horse…</option>
                {horses.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ring / Arena</label>
            <select name="ringId" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-medium text-slate-900 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all">
              <option value="">No specific ring</option>
              {rings.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Start Time *</label>
              <input type="datetime-local" name="startTime" required className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-medium text-slate-900 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">End Time *</label>
              <input type="datetime-local" name="endTime" required className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-medium text-slate-900 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all" />
            </div>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl">
            <p className="text-xs text-blue-700 font-medium">
              <span className="font-bold">Conflict Detection:</span> The system automatically detects overlapping times in the same ring. Conflicting slots will be flagged and must be resolved before publishing the event.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Link href="/scheduling" className="px-5 py-3 text-sm font-bold text-slate-600 border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all">Cancel</Link>
            <button type="submit" disabled={saving} className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-bold rounded-2xl transition-all active:scale-[0.98]">
              {saving ? "Creating…" : "Create Slot"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
