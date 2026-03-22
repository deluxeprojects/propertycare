'use client';

import { useRouter, usePathname } from 'next/navigation';

const filters = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'Assigned', value: 'assigned' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' },
];

export function OrderFilters({ active }: { active: string }) {
  const router = useRouter();
  const pathname = usePathname();

  const handleFilter = (value: string) => {
    if (value === 'all') {
      router.push(pathname);
    } else {
      router.push(`${pathname}?status=${value}`);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((f) => (
        <button
          key={f.value}
          onClick={() => handleFilter(f.value)}
          className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
            active === f.value
              ? 'bg-accent text-accent-foreground'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          }`}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}
