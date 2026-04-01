export default function PaymentTable({ payments, meta }: { payments: any[]; meta: any }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <table className="min-w-full text-sm">
        <thead>
          <tr>
            <th className="text-left py-2">Rider</th>
            <th className="text-left py-2">Event</th>
            <th className="text-left py-2">Amount</th>
            <th className="text-left py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((p) => (
            <tr key={p.id} className="border-t">
              <td>{p.rider?.firstName} {p.rider?.lastName}</td>
              <td>{p.event?.name}</td>
              <td>{p.amount}</td>
              <td>{p.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pt-2 text-xs text-gray-500">Page {meta.page} of {meta.totalPages}</div>
    </div>
  );
}
