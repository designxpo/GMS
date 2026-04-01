// components/ui/Skeletons.tsx
export function KPISkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="bg-white border border-gray-200 rounded-xl p-4 animate-pulse">
          <div className="h-3 bg-gray-200 rounded mb-2"></div>
          <div className="h-6 bg-gray-200 rounded"></div>
          <div className="h-3 bg-gray-200 rounded mt-2"></div>
        </div>
      ))}
    </div>
  );
}

export function TableSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 animate-pulse">
      <div className="h-6 bg-gray-200 rounded mb-2 w-1/3"></div>
      <div className="h-4 bg-gray-100 rounded mb-1 w-full"></div>
      <div className="h-4 bg-gray-100 rounded mb-1 w-full"></div>
      <div className="h-4 bg-gray-100 rounded mb-1 w-full"></div>
      <div className="h-4 bg-gray-100 rounded mb-1 w-full"></div>
    </div>
  );
}