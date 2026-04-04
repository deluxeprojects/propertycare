export default function Loading() {
  return (
    <div className="px-4 py-12 md:py-16">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-6 flex gap-2 text-sm">
          <div className="h-4 w-12 animate-pulse rounded bg-muted" />
          <div className="h-4 w-20 animate-pulse rounded bg-muted" />
          <div className="h-4 w-24 animate-pulse rounded bg-muted" />
        </div>
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-10 w-3/4 animate-pulse rounded-lg bg-muted" />
            <div className="h-4 w-full animate-pulse rounded bg-muted" />
            <div className="h-4 w-5/6 animate-pulse rounded bg-muted" />
            <div className="h-48 animate-pulse rounded-xl bg-muted" />
          </div>
          <div className="lg:col-span-1">
            <div className="h-64 animate-pulse rounded-xl border border-border bg-card" />
          </div>
        </div>
      </div>
    </div>
  );
}
