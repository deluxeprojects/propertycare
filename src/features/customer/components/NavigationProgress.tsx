'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export function NavigationProgress() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(false);
  }, [pathname]);

  return loading ? (
    <div className="fixed top-0 left-0 z-[60] h-0.5 w-full">
      <div className="h-full animate-pulse bg-accent" style={{ width: '70%' }} />
    </div>
  ) : null;
}
