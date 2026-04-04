export default function Loading() {
  return (
    <div className="px-4 py-12 md:py-16">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-6 h-4 w-64 animate-pulse rounded bg-muted" />
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-8 w-48 animate-pulse rounded-lg bg-muted" />
            <div className="h-10 w-full animate-pulse rounded-lg bg-muted" />
            <div className="h-64 w-full animate-pulse rounded-xl bg-muted" />
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-4 w-full animate-pulse rounded bg-muted" />
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <div className="h-64 animate-pulse rounded-xl border border-border bg-card" />
          </div>
        </div>
      </div>
    </div>
  );
}
