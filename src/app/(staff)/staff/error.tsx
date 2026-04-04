'use client';

import { useEffect } from 'react';

export default function StaffError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] items-center justify-center px-4">
      <div className="text-center">
        <h2 className="mb-2 text-2xl font-bold text-foreground">Something went wrong</h2>
        <p className="mb-6 text-muted-foreground">
          We encountered an unexpected error. Please try again.
        </p>
        <button
          onClick={reset}
          className="rounded-lg bg-accent px-6 py-2.5 text-sm font-semibold text-accent-foreground hover:bg-accent/90"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
