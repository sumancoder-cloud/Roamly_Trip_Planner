export default function EmptyState({ title, message }) {
  return (
    <div className="rounded-[1rem] border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-600">
      <div className="font-semibold text-slate-900">{title}</div>
      <p className="mt-2">{message}</p>
    </div>
  );
}
