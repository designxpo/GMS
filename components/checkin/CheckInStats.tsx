export default function CheckInStats({ stats }: { stats: any }) {
  return (
    <div className="flex gap-4 pb-2">
      <div className="bg-gray-50 border rounded-lg px-4 py-2 text-xs">Total: <b>{stats.total}</b></div>
      <div className="bg-gray-50 border rounded-lg px-4 py-2 text-xs">Checked-in: <b>{stats.checkedIn}</b></div>
      <div className="bg-gray-50 border rounded-lg px-4 py-2 text-xs">No Show: <b>{stats.noShow}</b></div>
      <div className="bg-gray-50 border rounded-lg px-4 py-2 text-xs">Scratched: <b>{stats.scratched}</b></div>
      <div className="bg-gray-50 border rounded-lg px-4 py-2 text-xs">Doc Pending: <b>{stats.docPending}</b></div>
      <div className="bg-gray-50 border rounded-lg px-4 py-2 text-xs">Awaiting: <b>{stats.awaiting}</b></div>
    </div>
  );
}
