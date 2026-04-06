'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { customerNav } from '@/config/navigation';

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(true)}
        className="flex h-10 w-10 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-muted"
        aria-label="Open navigation menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/40"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 z-50 h-full w-72 transform bg-white shadow-xl transition-transform duration-300 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-4">
          <span className="text-sm font-semibold text-foreground">Menu</span>
          <button
            onClick={() => setOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-muted"
            aria-label="Close navigation menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav aria-label="Mobile navigation" className="flex flex-col p-4">
          {customerNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted hover:text-accent-text"
            >
              {item.label}
            </Link>
          ))}
          <div className="my-3 border-t border-border" />
          <Link
            href="/login"
            onClick={() => setOpen(false)}
            className="rounded-lg border border-border px-4 py-3 text-center text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            Sign In
          </Link>
          <Link
            href="/book"
            onClick={() => setOpen(false)}
            className="rounded-lg bg-accent px-4 py-3 text-center text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90"
          >
            Book a Service
          </Link>
        </nav>
      </div>
    </div>
  );
}
