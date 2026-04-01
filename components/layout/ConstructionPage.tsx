import React from "react";
import { Hammer } from "lucide-react";

interface ConstructionPageProps {
  title: string;
  description?: string;
}

export default function ConstructionPage({ title, description }: ConstructionPageProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
      <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 mb-6 animate-pulse">
        <Hammer size={32} />
      </div>
      <h1 className="text-2xl font-bold text-slate-900 mb-2 truncate max-w-full">{title} Module</h1>
      <p className="text-slate-500 max-w-md mx-auto mb-8">
        We're currently building the {title.toLowerCase()} management system. This feature will be available in the next BSV update.
      </p>
      <div className="grid grid-cols-3 gap-8 w-full max-w-2xl mt-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-slate-50 rounded-xl border border-dashed border-slate-200" />
        ))}
      </div>
    </div>
  );
}
