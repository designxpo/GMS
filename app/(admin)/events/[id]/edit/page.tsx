"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Trash2, Save } from "lucide-react";
import Link from "next/link";
import { addToEvent, deleteActivity } from "@/app/actions/activities";

interface Activity { id: string; name: string }
interface EventActivity { id: string; fee: number; activity: Activity }
interface EventData {
  id: string; name: string; status: string;
  activities: EventActivity[];
}

export default function EditEventPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [event, setEvent] = useState<EventData | null>(null);
  const [allActivities, setAllActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState("");
  const [fee, setFee] = useState("0");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch(`/api/data/events`).then(r => r.json()),
      fetch(`/api/data/activities`).then(r => r.json()),
    ]).then(([evData, acData]) => {
      const ev = (evData.data ?? []).find((e: EventData) => e.id === params.id);
      setEvent(ev ?? null);
      setAllActivities(acData.data ?? []);
    });
  }, [params.id]);

  async function handleAddActivity() {
    if (!selectedActivity || !event) return;
    setSaving(true);
    setError(null);
    try {
      await addToEvent(event.id, selectedActivity, parseInt(fee) || 0);
      setSuccess("Activity added!");
      // Refresh event data
      const evData = await fetch(`/api/data/events`).then(r => r.json());
      const ev = (evData.data ?? []).find((e: EventData) => e.id === params.id);
      setEvent(ev ?? null);
      setSelectedActivity("");
      setFee("0");
    } catch (e: any) {
      setError(e.message ?? "Error adding activity");
    } finally {
      setSaving(false);
    }
  }

  if (!event) return (
    <div className="flex items-center justify-center py-20">
      <div className="animate-pulse text-slate-400 text-sm font-medium">Loading event…</div>
    </div>
  );

  const existingActivityIds = event.activities.map(ea => ea.activity.id);
  const availableActivities = allActivities.filter(a => !existingActivityIds.includes(a.id));

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-4 border-b border-slate-100 pb-5">
        <Link href={`/events/${params.id}`} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all border border-slate-200">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">Edit Event: {event.name}</h1>
          <p className="text-xs text-slate-400 font-medium">Manage activities and settings</p>
        </div>
      </div>

      {error && <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-sm text-rose-700 font-medium">{error}</div>}
      {success && <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-sm text-emerald-700 font-medium">{success}</div>}

      {/* Current Activities */}
      <div className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-xs font-black text-slate-900 uppercase tracking-widest">Current Activities ({event.activities.length})</h2>
        </div>
        {event.activities.length > 0 ? (
          <div className="divide-y divide-slate-50">
            {event.activities.map(ea => (
              <div key={ea.id} className="px-6 py-4 flex items-center justify-between group">
                <div>
                  <p className="text-sm font-bold text-slate-900">{ea.activity.name}</p>
                  <p className="text-xs text-slate-400 font-medium">Entry Fee: ₹{ea.fee.toLocaleString()}</p>
                </div>
                <span className="text-xs font-black text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-lg">Active</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-6 py-10 text-center">
            <p className="text-slate-400 text-sm font-medium">No activities added yet. Add one below.</p>
          </div>
        )}
      </div>

      {/* Add Activity */}
      {availableActivities.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-[2rem] p-8 space-y-5">
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest">Add Activity to Event</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="md:col-span-2 space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Activity</label>
              <select
                value={selectedActivity}
                onChange={e => setSelectedActivity(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-medium text-slate-900 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
              >
                <option value="">Select activity…</option>
                {availableActivities.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Entry Fee (₹)</label>
              <input type="number" min="0" value={fee} onChange={e => setFee(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-medium text-slate-900 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all" />
            </div>
          </div>
          <button
            onClick={handleAddActivity}
            disabled={!selectedActivity || saving}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-bold rounded-2xl transition-all active:scale-[0.98]"
          >
            <Plus size={16} />
            {saving ? "Adding…" : "Add to Event"}
          </button>
        </div>
      )}

      {availableActivities.length === 0 && allActivities.length > 0 && (
        <div className="p-6 bg-slate-50 rounded-[2rem] text-center">
          <p className="text-sm text-slate-500 font-medium">All available activities have been added to this event.</p>
          <Link href="/activities/new" className="text-indigo-600 font-bold text-sm hover:underline mt-1 inline-block">
            Create a new activity template →
          </Link>
        </div>
      )}

      <div className="flex justify-between items-center">
        <Link href="/activities/new" className="text-sm text-indigo-600 font-bold hover:underline">+ Create new activity template</Link>
        <Link href={`/events/${params.id}`} className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-2xl transition-all">
          Done
        </Link>
      </div>
    </div>
  );
}
