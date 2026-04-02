"use client";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { createActivity } from "@/app/actions/activities";
import { ArrowLeft, Activity, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-bold rounded-2xl transition-all active:scale-[0.98]">
      {pending ? "Creating…" : "Create Activity"}
    </button>
  );
}

interface Criterion { key: string; label: string; maxScore: number; weight: number }

export default function NewActivityPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [criteria, setCriteria] = useState<Criterion[]>([
    { key: "technique", label: "Technique", maxScore: 10, weight: 1 },
    { key: "execution", label: "Execution", maxScore: 10, weight: 1 },
  ]);

  const addCriterion = () => setCriteria(c => [...c, { key: `criterion_${Date.now()}`, label: "", maxScore: 10, weight: 1 }]);
  const removeCriterion = (i: number) => setCriteria(c => c.filter((_, idx) => idx !== i));
  const updateCriterion = (i: number, field: keyof Criterion, value: string | number) =>
    setCriteria(c => c.map((item, idx) => idx === i ? { ...item, [field]: value } : item));

  async function handleSubmit(formData: FormData) {
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    if (!name) { setError("Activity name is required"); return; }

    const validCriteria = criteria.filter(c => c.key && c.label);
    try {
      await createActivity({
        name,
        description: description || undefined,
        criteria: validCriteria.length > 0 ? validCriteria : undefined,
      });
      router.push("/activities");
    } catch (e: any) {
      setError(e.message ?? "An error occurred");
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-4 border-b border-slate-100 pb-5">
        <Link href="/activities" className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all border border-slate-200">
          <ArrowLeft size={18} />
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-md">
            <Activity size={20} />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">Create Activity Template</h1>
            <p className="text-xs text-slate-400 font-medium">Competition Discipline Registry</p>
          </div>
        </div>
      </div>

      {error && <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-sm text-rose-700 font-medium">{error}</div>}

      <form action={handleSubmit} className="space-y-6">
        <div className="bg-white border border-slate-200 rounded-[2rem] p-8 space-y-5">
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest">Basic Information</h2>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Activity Name *</label>
            <input name="name" required placeholder="e.g. Show Jumping 1.20m, Dressage Prix St. Georges" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-medium text-slate-900 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Description</label>
            <textarea name="description" rows={3} placeholder="Describe the competition format and rules…" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-medium text-slate-900 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all resize-none" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-[2rem] p-8 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest">Scoring Criteria</h2>
            <button type="button" onClick={addCriterion} className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors">
              <Plus size={14} /> Add Criterion
            </button>
          </div>
          <p className="text-xs text-slate-400 font-medium">Define how judges will score each performance element.</p>
          <div className="space-y-3">
            {criteria.map((c, i) => (
              <div key={i} className="grid grid-cols-12 gap-3 items-end">
                <div className="col-span-4 space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Label</label>
                  <input value={c.label} onChange={e => updateCriterion(i, "label", e.target.value)} placeholder="e.g. Technique" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:bg-white focus:border-indigo-500 outline-none transition-all" />
                </div>
                <div className="col-span-3 space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Key</label>
                  <input value={c.key} onChange={e => updateCriterion(i, "key", e.target.value.toLowerCase().replace(/\s+/g, "_"))} placeholder="technique" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:bg-white focus:border-indigo-500 outline-none transition-all font-mono" />
                </div>
                <div className="col-span-2 space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Max</label>
                  <input type="number" min="1" max="100" value={c.maxScore} onChange={e => updateCriterion(i, "maxScore", +e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:bg-white focus:border-indigo-500 outline-none transition-all" />
                </div>
                <div className="col-span-2 space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Weight</label>
                  <input type="number" min="0.1" step="0.1" value={c.weight} onChange={e => updateCriterion(i, "weight", +e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:bg-white focus:border-indigo-500 outline-none transition-all" />
                </div>
                <div className="col-span-1 flex justify-end pb-0.5">
                  {criteria.length > 1 && (
                    <button type="button" onClick={() => removeCriterion(i)} className="p-2 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all">
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <Link href="/activities" className="px-5 py-3 text-sm font-bold text-slate-600 border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all">Cancel</Link>
          <SubmitButton />
        </div>
      </form>
    </div>
  );
}
