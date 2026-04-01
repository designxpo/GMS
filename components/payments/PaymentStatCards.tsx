export default function PaymentStatCards({ stats }: { stats: any }) {
  return (
    <div className="flex gap-4 pb-2">
      <div className="bg-gray-50 border rounded-lg px-4 py-2 text-xs">Total: <b>{stats.total}</b></div>
      <div className="bg-gray-50 border rounded-lg px-4 py-2 text-xs">Success: <b>{stats.success}</b></div>
      <div className="bg-gray-50 border rounded-lg px-4 py-2 text-xs">Failed: <b>{stats.failed}</b></div>
      <div className="bg-gray-50 border rounded-lg px-4 py-2 text-xs">Refunded: <b>{stats.refunded}</b></div>
    </div>
  );
}
