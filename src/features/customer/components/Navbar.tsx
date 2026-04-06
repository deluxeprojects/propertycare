import Link from 'next/link';
import { User } from 'lucide-react';
import { customerNav } from '@/config/navigation';
import { ProKeepLogo } from '@/components/shared/ProKeepLogo';
import { SearchBar } from './SearchBar';
import { MobileNav } from './MobileNav';

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="flex items-center">
          <ProKeepLogo size="xs" />
        </Link>

        <div className="hidden md:block">
          <SearchBar />
        </div>

        <nav aria-label="Main navigation" className="hidden items-center gap-6 md:flex">
          {customerNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted md:inline-flex"
          >
            <User className="h-4 w-4" />
            Sign In
          </Link>
          <Link
            href="/book"
            className="hidden rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90 md:inline-flex"
          >
            Book a Service
          </Link>
          <MobileNav />
        </div>
      </div>
      <div className="border-t border-border px-4 py-2 md:hidden">
        <SearchBar />
      </div>
    </header>
  );
}
