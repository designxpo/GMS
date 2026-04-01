export default function Step3Activities({ draft, updateDraft, onNext, onBack }: any) {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Step 3: Activities</h2>
      {/* Add form fields for activities */}
      <div className="flex gap-2 mt-4">
        <button className="px-4 py-2 border rounded" onClick={onBack}>Back</button>
        <button className="px-4 py-2 bg-[#1a6b4a] text-white rounded" onClick={onNext}>Next</button>
      </div>
    </div>
  );
}