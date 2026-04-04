export default function StaffLoading() {
  return (
    <div className="space-y-4">
      <div className="h-8 w-40 animate-pulse rounded-lg bg-muted" />
      <div className="h-4 w-64 animate-pulse rounded bg-muted" />
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 animate-pulse rounded-xl border border-border bg-card" />
        ))}
      </div>
    </div>
  );
}
