"use client";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { createVenue } from "@/app/actions/venues";
import { ArrowLeft, Building2, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-bold rounded-2xl transition-all active:scale-[0.98]">
      {pending ? "Creating…" : "Create Venue"}
    </button>
  );
}

export default function NewVenuePage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [rings, setRings] = useState<string[]>(["Ring A"]);

  const addRing = () => setRings(r => [...r, `Ring ${String.fromCharCode(65 + r.length)}`]);
  const removeRing = (i: number) => setRings(r => r.filter((_, idx) => idx !== i));
  const updateRing = (i: number, val: string) => setRings(r => r.map((v, idx) => idx === i ? val : v));

  async function handleSubmit(formData: FormData) {
    const payload = {
      name: formData.get("name") as string,
      address: formData.get("address") as string || undefined,
      rings: rings.filter(Boolean).map(name => ({ name })),
    };
    if (!payload.name) { setError("Venue name is required"); return; }
    try {
      await createVenue(payload);
      router.push("/venues");
    } catch (e: any) {
      setError(e.message ?? "An error occurred");
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-4 border-b border-slate-100 pb-5">
        <Link href="/venues" className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all border border-slate-200">
          <ArrowLeft size={18} />
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-md">
            <Building2 size={20} />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">Onboard New Venue</h1>
            <p className="text-xs text-slate-400 font-medium">Facility Infrastructure Registry</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-sm text-rose-700 font-medium">{error}</div>
      )}

      <form action={handleSubmit} className="space-y-6">
        <div className="bg-white border border-slate-200 rounded-[2rem] p-8 space-y-5">
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest">Venue Details</h2>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Venue Name *</label>
            <input name="name" required placeholder="e.g. National Equestrian Centre" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-medium text-slate-900 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Address</label>
            <textarea name="address" rows={2} placeholder="Full venue address" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-medium text-slate-900 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all resize-none" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-[2rem] p-8 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest">Competition Rings</h2>
            <button type="button" onClick={addRing} className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors">
              <Plus size={14} /> Add Ring
            </button>
          </div>
          <div className="space-y-3">
            {rings.map((ring, i) => (
              <div key={i} className="flex items-center gap-3">
                <input
                  value={ring}
                  onChange={e => updateRing(i, e.target.value)}
                  placeholder={`Ring ${i + 1} name`}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-sm font-medium text-slate-900 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                />
                {rings.length > 1 && (
                  <button type="button" onClick={() => removeRing(i)} className="p-2 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all">
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <Link href="/venues" className="px-5 py-3 text-sm font-bold text-slate-600 border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all">
            Cancel
          </Link>
          <SubmitButton />
        </div>
      </form>
    </div>
  );
}
