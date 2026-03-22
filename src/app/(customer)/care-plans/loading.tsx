export default function Loading() {
  return (
    <div className="px-4 py-12 md:py-16">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <div className="mx-auto mb-4 h-10 w-48 animate-pulse rounded-lg bg-muted" />
          <div className="mx-auto h-4 w-96 animate-pulse rounded bg-muted" />
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i} className="animate-pulse rounded-xl border border-border bg-card p-6">
              <div className="mb-4 h-10 w-10 rounded-lg bg-muted" />
              <div className="mb-2 h-5 w-32 rounded bg-muted" />
              <div className="mb-4 h-3 w-full rounded bg-muted" />
              <div className="space-y-2">
                <div className="h-3 w-3/4 rounded bg-muted" />
                <div className="h-3 w-2/3 rounded bg-muted" />
                <div className="h-3 w-3/4 rounded bg-muted" />
              </div>
              <div className="mt-6 h-8 w-24 rounded bg-muted" />
              <div className="mt-4 h-10 w-full rounded-lg bg-muted" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
