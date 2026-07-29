export default function ErrorState({ title, message }) {
  return (
    <div className="rounded-[1rem] border border-rose-200 bg-rose-50 p-6 text-center text-sm text-rose-700">
      <div className="font-semibold">{title}</div>
      <p className="mt-2">{message}</p>
    </div>
  );
}
