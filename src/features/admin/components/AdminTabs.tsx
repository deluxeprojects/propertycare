'use client';

import { useState } from 'react';

interface Tab {
  label: string;
  content: React.ReactNode;
}

interface AdminTabsProps {
  tabs: Tab[];
  defaultTab?: number;
}

export function AdminTabs({ tabs, defaultTab = 0 }: AdminTabsProps) {
  const [active, setActive] = useState(defaultTab);

  return (
    <div>
      <div className="mb-6 flex gap-1 overflow-x-auto rounded-lg bg-muted p-1">
        {tabs.map((tab, i) => (
          <button
            key={tab.label}
            onClick={() => setActive(i)}
            className={`whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              active === i
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div>{tabs[active]?.content}</div>
    </div>
  );
}
