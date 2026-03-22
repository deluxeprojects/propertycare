export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-muted" />
        <div className="h-9 w-32 animate-pulse rounded-lg bg-muted" />
      </div>
      <div className="h-10 w-full animate-pulse rounded-lg bg-muted" />
      <div className="rounded-xl border border-border bg-card">
        {[1,2,3,4,5].map(i => (
          <div key={i} className="flex items-center gap-4 border-b border-border px-4 py-4 last:border-0">
            <div className="h-4 w-24 animate-pulse rounded bg-muted" />
            <div className="h-4 w-32 animate-pulse rounded bg-muted" />
            <div className="h-4 w-20 animate-pulse rounded bg-muted" />
            <div className="ml-auto h-4 w-16 animate-pulse rounded bg-muted" />
          </div>
        ))}
      </div>
    </div>
  );
}
