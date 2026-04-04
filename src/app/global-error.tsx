'use client';

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center bg-white px-4">
        <div className="text-center">
          <h1 className="mb-2 text-6xl font-bold text-[#1B3A5C]">500</h1>
          <h2 className="mb-4 text-2xl font-semibold text-gray-900">Something Went Wrong</h2>
          <p className="mb-8 text-gray-500">
            An unexpected error occurred. Please try again.
          </p>
          <button
            onClick={reset}
            className="rounded-lg bg-[#2BA5B5] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#2BA5B5]/90"
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
