export default function Input({ name, label, error, ...props }: any) {
  return (
    <div className="space-y-1">
      {label && <label htmlFor={name} className="block text-xs font-medium text-gray-700">{label}</label>}
      <input
        id={name}
        name={name}
        className={`block w-full border rounded px-2 py-1 text-sm ${error ? 'border-red-500' : 'border-gray-200'}`}
        {...props}
      />
      {error && <div className="text-xs text-red-500">{error}</div>}
    </div>
  );
}
