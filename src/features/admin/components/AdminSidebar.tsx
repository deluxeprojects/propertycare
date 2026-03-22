'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { siteConfig } from '@/config/site';
import { adminNav } from '@/config/navigation';
import { cn } from '@/lib/utils/cn';
import {
  LayoutDashboard,
  ClipboardList,
  Wrench,
  DollarSign,
  Tag,
  Users,
  HardHat,
  Shield,
  FileText,
  BarChart3,
  Settings,
} from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  ClipboardList,
  Wrench,
  DollarSign,
  Tag,
  Users,
  HardHat,
  Shield,
  FileText,
  BarChart3,
  Settings,
};

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 flex-col border-r border-border bg-primary text-primary-foreground lg:flex">
      <div className="flex h-16 items-center gap-2 border-b border-primary-foreground/20 px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
          <span className="text-sm font-bold text-accent-foreground">
            {siteConfig.name.charAt(0)}
          </span>
        </div>
        <div>
          <p className="text-sm font-bold">{siteConfig.name}</p>
          <p className="text-xs text-primary-foreground/60">Admin Panel</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {adminNav.map((item) => {
          const Icon = item.icon ? iconMap[item.icon] : null;
          const isActive =
            item.href === '/admin'
              ? pathname === '/admin'
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-accent text-accent-foreground'
                  : 'text-primary-foreground/70 hover:bg-primary-foreground/10 hover:text-primary-foreground'
              )}
            >
              {Icon && <Icon className="h-4 w-4" />}
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
