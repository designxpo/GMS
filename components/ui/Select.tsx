export default function Select({ name, label, options, ...props }: any) {
  return (
    <div className="space-y-1">
      {label && <label htmlFor={name} className="block text-xs font-medium text-gray-700">{label}</label>}
      <select
        id={name}
        name={name}
        className="block w-full border rounded px-2 py-1 text-sm border-gray-200"
        {...props}
      >
        <option value="">Select…</option>
        {options?.map((opt: any) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}
