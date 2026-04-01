"use client";
import { useState } from "react";
import { User, Trophy, MessageSquare, Save, Send, AlertTriangle } from "lucide-react";

export default function ScoringDesk({ currentSlot, upcoming }: { currentSlot: any; upcoming: any[] }) {
  const [score, setScore] = useState<number>(0);
  const [remarks, setRemarks] = useState("");

  if (!currentSlot) {
    return (
      <div className="space-y-6">
        <div className="bg-slate-900 rounded-3xl p-12 text-center border border-slate-800">
          <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-500 animate-pulse">
            <Trophy size={40} />
          </div>
          <h2 className="text-white text-2xl font-black tracking-tight">Arena Idle</h2>
          <p className="text-slate-400 mt-2 max-w-sm mx-auto font-medium">Waiting for the next orchestrated slot to enter the competition ring.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-6">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Upcoming Queue</h3>
                <div className="space-y-4">
                    {upcoming.map((u, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-500">
                                    {u.rider.firstName[0]}
                                </div>
                                <span className="text-sm font-bold text-slate-900">{u.rider.firstName} {u.rider.lastName}</span>
                            </div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{new Date(u.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                    ))}
                </div>
            </div>
            <div className="bg-indigo-600 rounded-3xl p-8 text-white relative overflow-hidden">
                <div className="relative z-10">
                    <h3 className="text-lg font-black tracking-tight mb-2">Technical Support</h3>
                    <p className="text-indigo-100 text-sm font-medium mb-6 leading-relaxed">System is synced with Global Results. All scores are hashed and audited in real-time.</p>
                    <button className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all">Support Desk</button>
                </div>
                <AlertTriangle size={80} className="absolute -bottom-4 -right-4 text-white/5 rotate-12" />
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white border-2 border-indigo-500 rounded-3xl p-8 shadow-2xl shadow-indigo-500/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 px-4 py-1.5 bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest rounded-bl-2xl">Active Ring Entry</div>
            <div className="flex items-start justify-between mb-8">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">{currentSlot.rider.firstName} {currentSlot.rider.lastName}</h2>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-indigo-600 font-black text-sm uppercase tracking-widest">{currentSlot.horse.name}</span>
                        <span className="text-slate-300">•</span>
                        <span className="text-slate-500 text-xs font-medium uppercase tracking-widest">Comp ID: {currentSlot.id.slice(0, 6)}</span>
                    </div>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <User size={32} />
                </div>
            </div>

            <div className="space-y-6">
                <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-4">Total Competition Score</label>
                    <div className="flex items-center gap-6">
                        <input 
                            type="number" 
                            step="0.1"
                            value={score}
                            onChange={(e) => setScore(Number(e.target.value))}
                            className="bg-slate-50 border-2 border-slate-100 rounded-3xl px-8 py-6 text-5xl font-black text-indigo-600 w-full focus:border-indigo-500 focus:bg-white transition-all outline-none"
                            placeholder="0.00"
                        />
                        <div className="space-y-2">
                            <button onClick={() => setScore(s => s + 1)} className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center hover:bg-slate-800 active:scale-90 transition-all text-xl font-bold">+</button>
                            <button onClick={() => setScore(s => Math.max(0, s - 1))} className="w-12 h-12 rounded-xl border-2 border-slate-200 text-slate-400 flex items-center justify-center hover:bg-slate-50 active:scale-90 transition-all text-xl font-bold">-</button>
                        </div>
                    </div>
                </div>

                <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-2">Technical Remarks</label>
                    <div className="relative">
                        <MessageSquare className="absolute left-4 top-4 text-slate-300" size={18} />
                        <textarea 
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                            className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl pl-12 pr-4 py-3 text-sm font-medium text-slate-700 min-h-[100px] focus:border-indigo-500 focus:bg-white transition-all outline-none"
                            placeholder="Add judge remarks on movement and execution..."
                        ></textarea>
                    </div>
                </div>
            </div>

            <div className="mt-8 flex gap-3">
                <button className="flex-1 px-6 py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all">
                    <Save size={16} />
                    Save Draft
                </button>
                <button className="flex-[2] px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-xl shadow-indigo-600/30 active:scale-[0.98]">
                    <Send size={16} />
                    Submit Final Result
                </button>
            </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white border border-slate-200 rounded-3xl p-6">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Technical Assignment</h3>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4">
               <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
                    <Trophy size={20} />
               </div>
               <div>
                    <p className="text-xs font-black text-slate-900 uppercase tracking-widest">{currentSlot.ring?.name || "Main Arena"}</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase mt-0.5 tracking-wider">Scrutiny Level 1</p>
               </div>
            </div>
        </div>

        <div className="bg-slate-900 rounded-3xl p-6 text-white border border-slate-800">
            <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-4">Upcoming Strategy</h3>
            <div className="space-y-3">
                {upcoming.map((u, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0 opacity-60 hover:opacity-100 transition-opacity cursor-default">
                        <span className="text-xs font-bold">{u.rider.firstName} {u.rider.lastName[0]}.</span>
                        <span className="text-[9px] font-black tracking-widest">{new Date(u.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
}
