"use client";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { createRegistration, submitRegistration } from "@/app/actions/registration";
import { ArrowLeft, ClipboardList } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-bold rounded-2xl transition-all active:scale-[0.98]">
      {pending ? "Processing…" : label}
    </button>
  );
}

interface Event { id: string; name: string; status: string; activities?: { id: string; fee: number; activity?: { name: string } }[] }
interface Rider { id: string; firstName: string; lastName: string; licenseNumber: string }
interface Horse { id: string; name: string; licenseNumber?: string }

export default function NewRegistrationPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [riders, setRiders] = useState<Rider[]>([]);
  const [horses, setHorses] = useState<Horse[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/data/events").then(r => r.json()),
      fetch("/api/data/riders").then(r => r.json()),
      fetch("/api/data/horses").then(r => r.json()),
    ]).then(([evData, rData, hData]) => {
      setEvents(evData.data ?? []);
      setRiders(rData.data ?? []);
      setHorses(hData.data ?? []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  async function handleSubmit(formData: FormData) {
    const eventId = formData.get("eventId") as string;
    const riderId = formData.get("riderId") as string;
    const horseId = formData.get("horseId") as string;
    const eventActivityId = formData.get("eventActivityId") as string;
    const notes = formData.get("notes") as string;
    const autoSubmit = formData.get("autoSubmit") === "true";

    if (!eventId || !riderId || !horseId) { setError("Event, Rider and Horse are required"); return; }

    setError(null);
    try {
      const result = await createRegistration({
        eventId, riderId, horseId,
        eventActivityId: eventActivityId || undefined,
        termsAccepted: true,
        notes: notes || undefined,
      });
      if (result.error) { setError(result.error); return; }

      if (autoSubmit && result.registrationId) {
        await submitRegistration(result.registrationId);
        setSuccess("Registration submitted successfully! Check-in token has been generated.");
      } else {
        setSuccess("Registration draft created. Go to Registrations to review and submit.");
      }
      setTimeout(() => router.push("/registration"), 2000);
    } catch (e: any) {
      setError(e.message ?? "An unexpected error occurred");
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-4 border-b border-slate-100 pb-5">
        <Link href="/registration" className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all border border-slate-200">
          <ArrowLeft size={18} />
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-md">
            <ClipboardList size={20} />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">Manual Entry Registration</h1>
            <p className="text-xs text-slate-400 font-medium">Admin-issued tournament admission</p>
          </div>
        </div>
      </div>

      {error && <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-sm text-rose-700 font-medium">{error}</div>}
      {success && <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-sm text-emerald-700 font-medium">{success}</div>}

      {loading ? (
        <div className="bg-white border border-slate-200 rounded-[2rem] p-12 flex items-center justify-center">
          <div className="animate-pulse text-slate-400 text-sm font-medium">Loading data…</div>
        </div>
      ) : (
        <form action={handleSubmit} className="bg-white border border-slate-200 rounded-[2rem] p-8 space-y-6">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Event *</label>
            <select
              name="eventId"
              required
              onChange={e => setSelectedEvent(events.find(ev => ev.id === e.target.value) ?? null)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-medium text-slate-900 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
            >
              <option value="">Select an event…</option>
              {events.map(ev => (
                <option key={ev.id} value={ev.id}>{ev.name} — {ev.status}</option>
              ))}
            </select>
          </div>

          {selectedEvent?.activities && selectedEvent.activities.length > 0 && (
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Activity / Class</label>
              <select name="eventActivityId" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-medium text-slate-900 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all">
                <option value="">No specific activity</option>
                {selectedEvent.activities.map(ea => (
                  <option key={ea.id} value={ea.id}>
                    {ea.activity?.name ?? "Activity"} — ₹{ea.fee.toLocaleString()}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rider *</label>
              <select name="riderId" required className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-medium text-slate-900 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all">
                <option value="">Select rider…</option>
                {riders.map(r => (
                  <option key={r.id} value={r.id}>{r.firstName} {r.lastName} ({r.licenseNumber})</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Horse *</label>
              <select name="horseId" required className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-medium text-slate-900 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all">
                <option value="">Select horse…</option>
                {horses.map(h => (
                  <option key={h.id} value={h.id}>{h.name}{h.licenseNumber ? ` (${h.licenseNumber})` : ""}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Internal Notes</label>
            <textarea name="notes" rows={3} placeholder="Any admin notes for this entry…" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-medium text-slate-900 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all resize-none" />
          </div>

          <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-start gap-3">
            <input type="checkbox" name="autoSubmit" value="true" id="autoSubmit" className="mt-0.5 rounded" defaultChecked />
            <label htmlFor="autoSubmit" className="text-sm text-indigo-800 font-medium cursor-pointer">
              <span className="font-bold">Auto-submit registration</span> — immediately move to SUBMITTED status and generate check-in QR token
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Link href="/registration" className="px-5 py-3 text-sm font-bold text-slate-600 border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all">Cancel</Link>
            <SubmitButton label="Create Entry" />
          </div>
        </form>
      )}
    </div>
  );
}
