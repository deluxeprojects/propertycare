export default function Loading() {
  return (
    <div className="px-4 py-12 md:py-16">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-12">
          <div className="h-10 w-64 animate-pulse rounded-lg bg-muted" />
          <div className="mt-4 h-4 w-96 animate-pulse rounded bg-muted" />
        </div>
        <div className="space-y-12">
          {[1, 2, 3].map((group) => (
            <div key={group}>
              <div className="mb-6 h-6 w-40 animate-pulse rounded bg-muted" />
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-20 animate-pulse rounded-xl border border-border bg-card" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
