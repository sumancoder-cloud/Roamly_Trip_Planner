export default function DashboardLayoutSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-24 animate-pulse rounded-[1.8rem] bg-slate-200" />
      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="h-28 animate-pulse rounded-[1.4rem] bg-slate-200" />
        ))}
      </div>
      <div className="h-48 animate-pulse rounded-[1.8rem] bg-slate-200" />
    </div>
  );
}
