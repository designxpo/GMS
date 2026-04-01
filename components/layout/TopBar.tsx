// components/layout/TopBar.tsx
"use client";
import { User } from "@/types";
import { Bell, Search, Globe, ChevronDown } from "lucide-react";

export default function TopBar({ user }: { user: User }) {
  return (
    <header className="bg-white border-b border-slate-200 px-8 py-3.5 z-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-slate-400 focus-within:text-indigo-600 transition-colors">
            <Search size={18} />
            <input 
              type="search" 
              placeholder="Search Intelligence..." 
              className="bg-transparent border-none focus:ring-0 text-sm font-medium w-64 placeholder:text-slate-400 text-slate-900"
            />
          </div>
          <div className="h-4 w-[1px] bg-slate-200" />
          <div className="flex items-center gap-2 text-slate-500 font-bold text-xs uppercase tracking-widest">
            <Globe size={14} className="text-indigo-500" />
            <span>Market: Global</span>
          </div>
        </div>

        <div className="flex items-center gap-5">
          <button className="relative p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
          </button>
          
          <div className="h-6 w-[1px] bg-slate-200" />

          <div className="flex items-center gap-3 pl-2 group cursor-pointer">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-black text-slate-900 leading-none">{user.role}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-1">Verified Official</p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-slate-800 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-lg shadow-indigo-200 group-hover:scale-105 transition-transform">
              {user.role[0]}
            </div>
            <ChevronDown size={16} className="text-slate-400 group-hover:text-indigo-600 transition-colors" />
          </div>
        </div>
      </div>
    </header>
  );
}