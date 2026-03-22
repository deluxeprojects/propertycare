'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils/cn';
import { CheckSquare, Calendar, User } from 'lucide-react';

const navItems = [
  { label: 'Tasks', href: '/staff', icon: CheckSquare },
  { label: 'Schedule', href: '/staff/schedule', icon: Calendar },
  { label: 'Profile', href: '/staff/profile', icon: User },
];

export function StaffShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-primary px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent">
              <span className="text-xs font-bold text-accent-foreground">{siteConfig.name.charAt(0)}</span>
            </div>
            <span className="text-sm font-bold text-primary-foreground">{siteConfig.name} Staff</span>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 px-4 py-4">{children}</main>

      {/* Bottom Navigation */}
      <nav className="sticky bottom-0 border-t border-border bg-card px-2 py-2">
        <div className="flex justify-around">
          {navItems.map((item) => {
            const isActive = item.href === '/staff'
              ? pathname === '/staff'
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-col items-center gap-1 rounded-lg px-4 py-2 text-xs font-medium transition-colors',
                  isActive ? 'text-accent' : 'text-muted-foreground'
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
