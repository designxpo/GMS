export default function AccreditationBadge({ accreditation }: { accreditation: any }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
      <div className="text-2xl font-bold mb-2">{accreditation.badgeNumber}</div>
      <div className="text-lg mb-1">{accreditation.riderName || accreditation.rider?.firstName + ' ' + accreditation.rider?.lastName}</div>
      <div className="text-gray-500 mb-2">{accreditation.type}</div>
      <div className="text-xs text-gray-400 mb-2">{accreditation.eventName || accreditation.event?.name}</div>
      <div className="text-xs">Access: {accreditation.accessZones?.join(", ")}</div>
    </div>
  );
}
