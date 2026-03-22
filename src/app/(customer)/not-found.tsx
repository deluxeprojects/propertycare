import Link from 'next/link';
import { siteConfig } from '@/config/site';

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-12">
      <div className="text-center">
        <h1 className="mb-2 text-6xl font-bold text-primary">404</h1>
        <h2 className="mb-4 text-2xl font-semibold text-foreground">Page Not Found</h2>
        <p className="mb-8 text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link href="/" className="rounded-lg bg-accent px-6 py-2.5 text-sm font-semibold text-accent-foreground hover:bg-accent/90">
            Go Home
          </Link>
          <Link href="/home-services" className="rounded-lg border border-border px-6 py-2.5 text-sm font-medium text-foreground hover:bg-muted">
            Browse Services
          </Link>
        </div>
      </div>
    </div>
  );
}
