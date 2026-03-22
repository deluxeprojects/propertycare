export default function Loading() {
  return (
    <div className="px-4 py-12 md:py-16">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-6 flex gap-2 text-sm">
          <div className="h-4 w-12 animate-pulse rounded bg-muted" />
          <div className="h-4 w-24 animate-pulse rounded bg-muted" />
        </div>
        <div className="mb-8">
          <div className="h-10 w-56 animate-pulse rounded-lg bg-muted" />
          <div className="mt-3 h-4 w-80 animate-pulse rounded bg-muted" />
          <div className="mt-6 h-48 w-full animate-pulse rounded-xl bg-muted md:h-64" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="animate-pulse rounded-xl border border-border bg-card">
              <div className="h-32 rounded-t-xl bg-muted" />
              <div className="p-6">
                <div className="mb-2 h-4 w-16 rounded bg-muted" />
                <div className="mb-2 h-5 w-40 rounded bg-muted" />
                <div className="h-3 w-full rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
