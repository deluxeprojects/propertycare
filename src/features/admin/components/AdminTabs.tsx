'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';

interface AdminTabsProps {
  tabs: string[];
  paramName?: string;
}

export function AdminTabs({ tabs, paramName = 'tab' }: AdminTabsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get(paramName) ?? tabs[0]?.toLowerCase().replace(/\s+/g, '-') ?? '';

  const handleTab = (tab: string) => {
    const value = tab.toLowerCase().replace(/\s+/g, '-');
    const params = new URLSearchParams(searchParams.toString());
    params.set(paramName, value);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex gap-1 rounded-lg bg-muted p-1">
      {tabs.map((tab) => {
        const value = tab.toLowerCase().replace(/\s+/g, '-');
        const isActive = activeTab === value || (!searchParams.get(paramName) && tab === tabs[0]);
        return (
          <button
            key={tab}
            onClick={() => handleTab(tab)}
            className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              isActive
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
}
