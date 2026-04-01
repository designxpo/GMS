export default function RiderFilters() {
  return (
    <div className="flex gap-2 pb-2">
      {/* Add filter controls here */}
      <input className="border rounded px-2 py-1 text-sm" placeholder="Search riders..." />
      <select className="border rounded px-2 py-1 text-sm">
        <option value="">All Status</option>
        <option value="ACTIVE">Active</option>
        <option value="INACTIVE">Inactive</option>
      </select>
    </div>
  );
}
