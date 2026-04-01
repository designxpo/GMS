export default function RiderProfile({ rider }: { rider: any }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <h2 className="text-xl font-bold mb-2">{rider.firstName} {rider.lastName}</h2>
      <div className="text-gray-600 mb-2">License: {rider.licenseNumber}</div>
      <div className="text-gray-600 mb-2">Email: {rider.email}</div>
      <div className="text-gray-600 mb-2">Status: {rider.status}</div>
      {/* Add more rider details here */}
    </div>
  );
}
