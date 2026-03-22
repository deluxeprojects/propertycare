'use client';

export default function AdminError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="text-center">
        <h2 className="mb-2 text-xl font-bold text-foreground">Error</h2>
        <p className="mb-4 text-sm text-muted-foreground">{error.message}</p>
        <button onClick={reset} className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground hover:bg-accent/90">
          Retry
        </button>
      </div>
    </div>
  );
}
