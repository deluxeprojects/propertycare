export default function Loading() {
  return (
    <div className="px-4 py-12 md:py-16">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-6 flex gap-2 text-sm">
          <div className="h-4 w-12 animate-pulse rounded bg-muted" />
          <div className="h-4 w-10 animate-pulse rounded bg-muted" />
        </div>
        <div className="mb-4 h-10 w-32 animate-pulse rounded-lg bg-muted" />
        <div className="mb-8 h-4 w-72 animate-pulse rounded bg-muted" />
        <div className="space-y-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex animate-pulse overflow-hidden rounded-xl border border-border bg-card">
              <div className="hidden h-auto w-48 shrink-0 bg-muted sm:block" />
              <div className="flex-1 p-6">
                <div className="mb-2 flex gap-3">
                  <div className="h-5 w-16 rounded-full bg-muted" />
                  <div className="h-5 w-24 rounded bg-muted" />
                </div>
                <div className="mb-2 h-6 w-3/4 rounded bg-muted" />
                <div className="h-4 w-full rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
