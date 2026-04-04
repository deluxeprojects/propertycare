'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Search, X, ArrowRight } from 'lucide-react';

interface SearchResult {
  services: Array<{
    id: string;
    slug: string;
    name_en: string;
    short_desc_en: string | null;
    base_price_aed: number;
    service_categories: { slug: string; name_en: string } | null;
  }>;
  areas: Array<{
    id: string;
    slug: string;
    name_en: string;
  }>;
  pages?: Array<{
    slug: string;
    name: string;
    href: string;
  }>;
}

export function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>(undefined);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (query.length < 2) {
      setResults(null);
      setOpen(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/v1/public/search?q=${encodeURIComponent(query)}`);
        if (!res.ok) {
          setResults(null);
          return;
        }
        const data = await res.json();
        setResults(data);
        setOpen(true);
      } catch {
        setResults(null);
      }
      setLoading(false);
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  return (
    <div ref={ref} className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results && setOpen(true)}
          placeholder="Search services... (e.g. maid, AC repair, plumber)"
          className="w-full rounded-lg border border-border bg-card py-2.5 pl-9 pr-9 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
        />
        {loading && query.length >= 2 && (
          <span className="absolute right-9 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
            <svg className="inline h-3.5 w-3.5 animate-spin text-accent-text" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </span>
        )}
        {query && (
          <button onClick={() => { setQuery(''); setOpen(false); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" aria-label="Clear search">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {open && results && (
        <div className="absolute top-full z-50 mt-1 w-full rounded-xl border border-border bg-card shadow-lg">
          {results.services.length === 0 && results.areas.length === 0 && (!results.pages || results.pages.length === 0) ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No results for &ldquo;{query}&rdquo;
            </div>
          ) : (
            <>
              {results.services.length > 0 && (
                <div>
                  <p className="px-4 pt-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Services</p>
                  {results.services.map((s) => {
                    const catSlug = (s.service_categories as { slug: string } | null)?.slug ?? '';
                    return (
                      <Link
                        key={s.id}
                        href={`/home-services/${catSlug}/${s.slug}`}
                        onClick={() => setOpen(false)}
                        className="flex items-center justify-between px-4 py-2.5 hover:bg-muted"
                      >
                        <div>
                          <p className="text-sm font-medium text-foreground">{s.name_en}</p>
                          {s.short_desc_en && <p className="text-xs text-muted-foreground">{s.short_desc_en}</p>}
                        </div>
                        <span className="shrink-0 text-xs font-semibold text-accent-text">AED {s.base_price_aed}</span>
                      </Link>
                    );
                  })}
                </div>
              )}

              {results.areas.length > 0 && (
                <div className="border-t border-border">
                  <p className="px-4 pt-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Areas</p>
                  {results.areas.map((a) => (
                    <Link
                      key={a.id}
                      href={`/areas/${a.slug}`}
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-between px-4 py-2.5 hover:bg-muted"
                    >
                      <p className="text-sm font-medium text-foreground">{a.name_en}</p>
                      <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                    </Link>
                  ))}
                </div>
              )}

              {results.pages && results.pages.length > 0 && (
                <div className="border-t border-border">
                  <p className="px-4 pt-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Pages</p>
                  {results.pages.map((p) => (
                    <Link
                      key={p.slug}
                      href={p.href}
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-between px-4 py-2.5 hover:bg-muted"
                    >
                      <p className="text-sm font-medium text-foreground">{p.name}</p>
                      <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
