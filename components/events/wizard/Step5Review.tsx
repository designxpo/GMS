export default function Step5Review({ draft, updateDraft, onBack }: any) {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Step 5: Review</h2>
      {/* Show summary of draft */}
      <div className="flex gap-2 mt-4">
        <button className="px-4 py-2 border rounded" onClick={onBack}>Back</button>
        <button className="px-4 py-2 bg-[#1a6b4a] text-white rounded">Submit</button>
      </div>
    </div>
  );
}