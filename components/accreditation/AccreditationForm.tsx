export default function AccreditationForm({ riders, events }: { riders: any[]; events: any[] }) {
  return (
    <form className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <select className="border rounded px-2 py-1 text-sm" name="riderId">
          <option value="">Select Rider</option>
          {riders.map((r: any) => (
            <option key={r.id} value={r.id}>{r.firstName} {r.lastName}</option>
          ))}
        </select>
        <select className="border rounded px-2 py-1 text-sm" name="eventId">
          <option value="">Select Event</option>
          {events.map((e: any) => (
            <option key={e.id} value={e.id}>{e.name}</option>
          ))}
        </select>
      </div>
      <input className="border rounded px-2 py-1 text-sm w-full" name="type" placeholder="Type (e.g. RIDER, GROOM)" />
      <input className="border rounded px-2 py-1 text-sm w-full" name="expiresAt" type="date" placeholder="Expiry Date" />
      <input className="border rounded px-2 py-1 text-sm w-full" name="photoUrl" placeholder="Photo URL" />
      <textarea className="border rounded px-2 py-1 text-sm w-full" name="notes" placeholder="Notes" />
      <button type="submit" className="px-4 py-2 bg-[#1a6b4a] text-white rounded-lg text-sm font-medium">Create Accreditation</button>
    </form>
  );
}
