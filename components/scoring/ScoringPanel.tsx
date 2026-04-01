export default function ScoringPanel({ slot, eventId }: { slot: any; eventId: string }) {
  if (!slot) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <h2 className="text-lg font-bold mb-2">{slot.rider?.firstName} {slot.rider?.lastName} — {slot.horse?.name}</h2>
      <div className="text-gray-600 mb-2">Ring: {slot.ring?.name}</div>
      <div className="text-gray-600 mb-2">Time: {slot.startTime} - {slot.endTime}</div>
      {/* Add scoring form/criteria here */}
    </div>
  );
}
