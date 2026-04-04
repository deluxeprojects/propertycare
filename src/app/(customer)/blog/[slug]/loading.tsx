export default function Loading() {
  return (
    <div className="px-4 py-12 md:py-16">
      <div className="container mx-auto max-w-3xl">
        <div className="mb-6 h-4 w-48 animate-pulse rounded bg-muted" />
        <div className="mb-8">
          <div className="mb-3 flex items-center gap-3">
            <div className="h-5 w-16 animate-pulse rounded-full bg-muted" />
            <div className="h-4 w-24 animate-pulse rounded bg-muted" />
          </div>
          <div className="mb-4 h-10 w-full animate-pulse rounded-lg bg-muted" />
          <div className="h-4 w-32 animate-pulse rounded bg-muted" />
        </div>
        <div className="mb-8 aspect-[2/1] w-full animate-pulse rounded-xl bg-muted" />
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-4 w-full animate-pulse rounded bg-muted" />
          ))}
        </div>
      </div>
    </div>
  );
}
