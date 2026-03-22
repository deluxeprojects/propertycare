'use client';

import { useRouter, useSearchParams } from 'next/navigation';

interface CategoryFilterProps {
  categories: string[];
}

export function CategoryFilter({ categories }: CategoryFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const active = searchParams.get('category') || '';

  function handleClick(category: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (category === active) {
      params.delete('category');
    } else {
      params.set('category', category);
    }
    const qs = params.toString();
    router.push(qs ? `/blog?${qs}` : '/blog');
  }

  return (
    <div className="mb-8 flex flex-wrap gap-2">
      <button
        onClick={() => {
          const params = new URLSearchParams(searchParams.toString());
          params.delete('category');
          const qs = params.toString();
          router.push(qs ? `/blog?${qs}` : '/blog');
        }}
        className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
          !active
            ? 'bg-accent text-accent-foreground'
            : 'bg-muted text-muted-foreground hover:bg-muted/80'
        }`}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => handleClick(cat)}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            active === cat
              ? 'bg-accent text-accent-foreground'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
