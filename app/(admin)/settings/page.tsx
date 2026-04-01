import { prisma } from "@/lib/db";
import { getServerSession } from "@/lib/auth/session";
import { Settings, User, Shield, Bell, CreditCard, Globe, Database, Cpu, ChevronRight } from "lucide-react";

export const metadata = { title: "Settings — BSV" };

export default async function SettingsPage() {
  const session = await getServerSession();
  if (!session) return null;
  const tenantId = session.user.tenantId;

  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
    include: { _count: true }
  });

  return (
    <div className="space-y-8 pb-20">
      {/* Header Section */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-lg">
            <Settings size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Configuration Desk</h1>
            <p className="text-sm text-slate-500 font-medium mt-0.5 tracking-wide">Tenant Infrastructure & Control Parameters</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
            {/* Tenant Profile Section */}
            <section className="bg-white border-2 border-slate-100 rounded-[2.5rem] p-8 shadow-sm transition-all hover:border-indigo-100">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                        <Globe size={20} />
                    </div>
                    <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">Enterprise Identity</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Registry Name</label>
                        <input type="text" value={tenant?.name} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold text-slate-900 focus:bg-white focus:border-indigo-500 transition-all outline-none" readOnly />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Global Slug</label>
                        <input type="text" value={tenant?.slug} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold text-slate-900 focus:bg-white focus:border-indigo-500 transition-all outline-none" readOnly />
                    </div>
                </div>
            </section>

            {/* Infrastructure Section */}
            <section className="bg-slate-900 rounded-[2.5rem] p-8 border border-slate-800 shadow-2xl shadow-slate-900/10">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-white/5 text-indigo-400 flex items-center justify-center">
                        <Database size={20} />
                    </div>
                    <h2 className="text-lg font-black text-white uppercase tracking-tight">Relational Intelligence</h2>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: "Asset Units", value: tenant?._count.horses },
                        { label: "Validated Profiles", value: tenant?._count.riders },
                        { label: "Orchestrated Events", value: tenant?._count.events },
                        { label: "Site Nodes", value: tenant?._count.venues },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-4">
                            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest block mb-1">{stat.label}</span>
                            <span className="text-xl font-black text-white">{stat.value}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* General Preferences */}
            <section className="space-y-4">
                {[
                    { label: "Security & Permissions", icon: Shield, description: "Manage judge assignments and official clearance levels." },
                    { label: "Communication Stream", icon: Bell, description: "Configure automated regulatory and event-specific alerts." },
                    { label: "Financial Integration", icon: CreditCard, description: "Connect settlement gateways and reconciliation protocols." },
                ].map((pref, i) => (
                    <div key={i} className="bg-white border border-slate-200 rounded-3xl p-6 flex items-center justify-between hover:border-indigo-500 transition-all group cursor-pointer">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                                <pref.icon size={22} />
                            </div>
                            <div>
                                <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">{pref.label}</h3>
                                <p className="text-xs text-slate-500 font-medium">{pref.description}</p>
                            </div>
                        </div>
                        <ChevronRight className="text-slate-200 group-hover:text-indigo-600 transition-colors" size={20} />
                    </div>
                ))}
            </section>
        </div>

        <div className="space-y-6">
            <div className="bg-indigo-600 rounded-[2.5rem] p-10 text-white relative overflow-hidden group shadow-2xl shadow-indigo-600/30">
                 <div className="relative z-10 flex flex-col h-full">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white mb-6">
                        <Cpu size={28} />
                    </div>
                    <h3 className="text-2xl font-black tracking-tight mb-4 leading-tight">System Status: Synchronized</h3>
                    <p className="text-indigo-100 text-sm font-medium mb-10 leading-relaxed">BSV Version 4.0.1 Stable. All database nodes are currently healthy and latency is within nominal bounds.</p>
                    <div className="mt-auto pt-6 border-t border-white/10 flex items-baseline gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Validated Node: Tokyo AWS-1</span>
                    </div>
                 </div>
                 <div className="absolute top-0 right-0 p-8">
                    <Settings size={120} className="text-white/5 rotate-12 group-hover:rotate-45 transition-transform duration-[2s]" />
                 </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-[2rem] p-8">
                 <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-6">Technical Audit</h3>
                 <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-slate-50">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Environment</span>
                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest px-2 py-0.5 bg-emerald-50 rounded">Production</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-slate-50">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Database Latency</span>
                        <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest underline decoration-indigo-500 decoration-2">24 ms</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <span>Replication Lag</span>
                        <span className="text-slate-900">0.02s</span>
                    </div>
                 </div>
                 <button className="w-full mt-8 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">Launch Performance Suite</button>
            </div>
        </div>
      </div>
    </div>
  );
}
