export default function Step2Venue({ draft, updateDraft, onNext, onBack }: any) {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Step 2: Venue</h2>
      {/* Add form fields for venue selection */}
      <div className="flex gap-2 mt-4">
        <button className="px-4 py-2 border rounded" onClick={onBack}>Back</button>
        <button className="px-4 py-2 bg-[#1a6b4a] text-white rounded" onClick={onNext}>Next</button>
      </div>
    </div>
  );
}