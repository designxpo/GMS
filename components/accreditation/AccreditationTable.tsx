export default function AccreditationTable({ accreditations }: { accreditations: any[] }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <table className="min-w-full text-sm">
        <thead>
          <tr>
            <th className="text-left py-2">Badge</th>
            <th className="text-left py-2">Rider</th>
            <th className="text-left py-2">Event</th>
            <th className="text-left py-2">Type</th>
            <th className="text-left py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {accreditations.map((a) => (
            <tr key={a.id} className="border-t">
              <td>{a.badgeNumber}</td>
              <td>{a.rider?.firstName} {a.rider?.lastName}</td>
              <td>{a.event?.name}</td>
              <td>{a.type}</td>
              <td>{a.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
