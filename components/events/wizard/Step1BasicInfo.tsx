export default function Step1BasicInfo({ draft, updateDraft, onNext }: any) {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Step 1: Basic Info</h2>
      {/* Add form fields for event name, description, etc. */}
      <button className="mt-4 px-4 py-2 bg-[#1a6b4a] text-white rounded" onClick={onNext}>Next</button>
    </div>
  );
}