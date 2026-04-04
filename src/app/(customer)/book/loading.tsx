export default function Loading() {
  return (
    <div className="px-4 py-12 md:py-16">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 h-10 w-48 animate-pulse rounded-lg bg-muted" />
          <div className="mx-auto h-4 w-72 animate-pulse rounded bg-muted" />
        </div>
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 animate-pulse rounded-xl border border-border bg-card" />
          ))}
        </div>
      </div>
    </div>
  );
}
