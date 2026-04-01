import { Suspense } from "react";
import { getVenues } from "@/lib/data/venues";
import VenueTable from "@/components/venues/VenueTable";
import { TableSkeleton } from "@/components/ui/Skeletons";
import Link from "next/link";
import { Plus, Search, Building2, Globe } from "lucide-react";

export const metadata = { title: "Venues — BSV" };

export default async function VenuesPage() {
  const result = await getVenues();

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Facility Intelligence</h1>
          <p className="text-sm text-slate-500 font-medium mt-0.5 tracking-wide">Infrastructure & Ring Topology Management</p>
        </div>
        <div className="flex gap-3">
          <Link href="/venues/new" className="px-5 py-2.5 text-sm font-bold bg-[#4338ca] hover:bg-[#3730a3] text-white rounded-xl shadow-lg shadow-indigo-500/20 transition-all active:scale-95 flex items-center gap-2">
            <Plus size={18} />
            <span>Onboard Venue</span>
          </Link>
        </div>
      </div>

      {/* Global Map View Placeholder */}
      <div className="bg-slate-900 rounded-3xl p-8 relative overflow-hidden group">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-[0.2em] mb-2">
              <Globe size={14} />
              <span>Real-time Topology</span>
            </div>
            <h2 className="text-white text-2xl font-black tracking-tight">{result.data.length} Strategic Locations</h2>
            <p className="text-slate-400 text-sm mt-1 max-w-sm">All arenas are currently synced with the BSV Global Timing and Results Engine.</p>
          </div>
          <Building2 size={64} className="text-white/10 group-hover:scale-110 transition-transform duration-700" />
        </div>
      </div>

      {/* Main Table */}
      <Suspense fallback={<TableSkeleton />}>
        <VenueTable venues={result.data} />
      </Suspense>
    </div>
  );
}
