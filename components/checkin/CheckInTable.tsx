export default function CheckInTable({ checkIns, eventId }: { checkIns: any[]; eventId: string }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <table className="min-w-full text-sm">
        <thead>
          <tr>
            <th className="text-left py-2">Rider</th>
            <th className="text-left py-2">Horse</th>
            <th className="text-left py-2">Status</th>
            <th className="text-left py-2">Bib</th>
          </tr>
        </thead>
        <tbody>
          {checkIns.map((row) => (
            <tr key={row.id} className="border-t">
              <td>{row.rider?.firstName} {row.rider?.lastName}</td>
              <td>{row.horse?.name}</td>
              <td>{row.status}</td>
              <td>{row.bibNumber}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
