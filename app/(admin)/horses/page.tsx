import { Suspense } from "react";
import { getHorses } from "@/lib/data/horses";
import HorseTable from "@/components/horses/HorseTable";
import { TableSkeleton } from "@/components/ui/Skeletons";
import Link from "next/link";
import { Plus, Search, Filter, Download } from "lucide-react";

export const metadata = { title: "Horses — BSV" };

interface Props {
  searchParams: { page?: string; search?: string; status?: string };
}

export default async function HorsesPage({ searchParams }: Props) {
  const { page = "1", search = "", status } = searchParams;
  const result = await getHorses({ page: +page, pageSize: 20, search, status: status as any });

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Equine Assets</h1>
          <p className="text-sm text-slate-500 font-medium mt-0.5 tracking-wide">Registry Management & Health Compliance</p>
        </div>
        <div className="flex gap-3">
           <button className="px-4 py-2.5 text-xs font-bold border border-slate-200 rounded-xl bg-white hover:bg-slate-50 text-slate-600 flex items-center gap-2 transition-all">
            <Download size={16} />
            Export Registry
          </button>
          <Link href="/horses/new" className="px-5 py-2.5 text-sm font-bold bg-[#4338ca] hover:bg-[#3730a3] text-white rounded-xl shadow-lg shadow-indigo-500/20 transition-all active:scale-95 flex items-center gap-2">
            <Plus size={18} />
            <span>Add New Horse</span>
          </Link>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="flex items-center gap-4 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
        <div className="flex -space-x-2">
          {[1,2,3,4].map(i => (
             <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200" />
          ))}
        </div>
        <div className="text-xs font-bold text-slate-500 uppercase tracking-widest px-3 border-l border-slate-200">
           {result.meta.total} Managed Performance Horses
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search Horse name, FEI ID, or License..." 
            className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 transition-all"
          />
        </div>
        <div className="flex gap-2">
          <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all border border-slate-200 bg-white">
            <Filter size={20} />
          </button>
        </div>
      </div>

      {/* Main Table */}
      <Suspense fallback={<TableSkeleton />}>
        <HorseTable horses={result.data} meta={result.meta} />
      </Suspense>
    </div>
  );
}
