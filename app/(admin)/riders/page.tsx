import { Suspense } from "react";
import { getRiders } from "@/lib/data/riders";
import RiderTable from "@/components/riders/RiderTable";
import RiderFilters from "@/components/riders/RiderFilters";
import { TableSkeleton } from "@/components/ui/Skeletons";
import Link from "next/link";
import { Plus, Download } from "lucide-react";

export const metadata = { title: "Riders — BSV" };

interface Props {
  searchParams: { page?: string; search?: string; status?: string };
}

export default async function RidersPage({ searchParams }: Props) {
  const { page = "1", search = "", status } = searchParams;
  const result = await getRiders({ page: +page, pageSize: 20, search, status: status as any });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-5">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Riders Intelligence</h1>
          <p className="text-sm text-slate-500 font-medium mt-0.5">Database Management & Profiles</p>
        </div>
        <Link href="/riders/new" className="px-5 py-2.5 text-sm font-bold bg-[#4338ca] hover:bg-[#3730a3] text-white rounded-xl shadow-lg shadow-indigo-500/20 transition-all active:scale-95 flex items-center gap-2">
          <Plus size={16} />
          <span>Register Rider</span>
        </Link>
      </div>
      <div className="flex items-center justify-between bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
        <div className="flex gap-2">
          <button className="px-4 py-2 text-xs font-bold border border-slate-200 rounded-xl bg-white hover:bg-slate-50 text-slate-600 flex items-center gap-2 transition-all">
            <Download size={14} />
            Export Database
          </button>
        </div>
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 py-1 bg-white border border-slate-200 rounded-full">
          {result.meta.total} Records Synced
        </div>
      </div>

      <RiderFilters />

      <Suspense fallback={<TableSkeleton />}>
        <RiderTable riders={result.data} meta={result.meta} />
      </Suspense>
    </div>
  );
}