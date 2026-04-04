export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-48 animate-pulse rounded-lg bg-muted" />
      <div className="h-4 w-72 animate-pulse rounded bg-muted" />
      <div className="h-12 animate-pulse rounded-lg border border-border bg-card" />
      <div className="h-96 animate-pulse rounded-xl border border-border bg-card" />
    </div>
  );
}
