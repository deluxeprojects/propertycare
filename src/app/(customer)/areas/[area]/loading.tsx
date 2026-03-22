export default function Loading() {
  return (
    <div className="px-4 py-12 md:py-16">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-4 h-4 w-20 animate-pulse rounded bg-muted" />
        <div className="mb-12">
          <div className="mb-2 h-4 w-32 animate-pulse rounded bg-muted" />
          <div className="h-10 w-72 animate-pulse rounded-lg bg-muted" />
          <div className="mt-4 h-48 w-full animate-pulse rounded-xl bg-muted md:h-72" />
          <div className="mt-6 h-16 w-full animate-pulse rounded bg-muted" />
        </div>
        <div className="mb-12">
          <div className="mb-6 h-7 w-56 animate-pulse rounded bg-muted" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-16 animate-pulse rounded-lg border border-border bg-card" />
            ))}
          </div>
        </div>
        <div className="mb-12">
          <div className="mb-6 h-7 w-48 animate-pulse rounded bg-muted" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 animate-pulse rounded-lg border border-border bg-card" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
