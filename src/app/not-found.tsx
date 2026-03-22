import Link from 'next/link';
import { siteConfig } from '@/config/site';

export default function NotFound() {
  return (
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center bg-white px-4">
        <div className="text-center">
          <h1 className="mb-2 text-6xl font-bold text-[#1B3A5C]">404</h1>
          <h2 className="mb-4 text-2xl font-semibold text-gray-900">Page Not Found</h2>
          <p className="mb-8 text-gray-500">The page you&apos;re looking for doesn&apos;t exist.</p>
          <a href="/" className="rounded-lg bg-[#2BA5B5] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#2BA5B5]/90">
            Go Home
          </a>
        </div>
      </body>
    </html>
  );
}
