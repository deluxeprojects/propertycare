import Link from 'next/link';
import { siteConfig } from '@/config/site';
import { createAdminClient } from '@/lib/supabase/admin';
import { Sparkles, Wind, Bug, Droplets, Plug, Paintbrush } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export const metadata = {
  title: 'Home Services in Dubai',
  description: '53+ professional home services in Dubai. Licensed cleaning, AC maintenance, pest control, plumbing, electrical & painting. Book online with ProKeep.',
};

const categoryIcons: Record<string, LucideIcon> = {
  cleaning: Sparkles,
  'ac-services': Wind,
  'pest-control': Bug,
  plumbing: Droplets,
  electrical: Plug,
  painting: Paintbrush,
};

export const revalidate = 3600; // Revalidate every hour

export default async function ServicesPage() {
  const supabase = createAdminClient();

  let categories: { slug: string; name_en: string; description_en: string; image_url: string | null }[] | null = null;
  let services: { category_id: string; base_price_aed: number; service_categories: unknown }[] | null = null;

  try {
    const [catResult, svcResult] = await Promise.all([
      supabase
        .from('service_categories')
        .select('slug, name_en, description_en, image_url')
        .eq('is_active', true)
        .order('sort_order'),
      supabase
        .from('services')
        .select('category_id, base_price_aed, service_categories(slug)')
        .eq('is_active', true)
        .eq('is_hidden', false),
    ]);
    categories = catResult.data;
    services = svcResult.data;
  } catch (error) {
    console.error('Error fetching services data:', error);
  }

  const categoryStats: Record<string, { count: number; minPrice: number }> = {};
  for (const s of services ?? []) {
    const slug = (s.service_categories as unknown as { slug: string })?.slug;
    if (!slug) continue;
    if (!categoryStats[slug]) categoryStats[slug] = { count: 0, minPrice: Infinity };
    categoryStats[slug].count++;
    categoryStats[slug].minPrice = Math.min(categoryStats[slug].minPrice, s.base_price_aed);
  }

  return (
    <div className="px-4 py-12 md:py-16">
      <div className="container mx-auto max-w-7xl">
        <nav className="mb-6 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-accent">Home</Link>{' / '}
          <span className="text-foreground">Home Services</span>
        </nav>
        <div className="mb-12">
          <h1 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
            Home Services in Dubai
          </h1>
          <p className="max-w-2xl text-muted-foreground">
            Licensed professionals, transparent pricing, 72-hour guarantee.
            From routine apartment cleaning to full villa maintenance — we
            handle it all across 40+ Dubai neighborhoods.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {(categories ?? []).map((cat) => {
            const Icon = categoryIcons[cat.slug] ?? Sparkles;
            const stats = categoryStats[cat.slug];
            return (
              <Link
                key={cat.slug}
                href={`/home-services/${cat.slug}`}
                className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-accent hover:shadow-lg"
              >
                {cat.image_url ? (
                  <div className="mb-4 -mx-6 -mt-6 overflow-hidden rounded-t-xl">
                    <img src={cat.image_url} alt={`${cat.name_en} services in Dubai`} className="h-36 w-full object-cover" loading="lazy" />
                  </div>
                ) : (
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-accent/10">
                    <Icon className="h-7 w-7 text-accent" />
                  </div>
                )}
                <h2 className="mb-2 text-xl font-semibold text-card-foreground group-hover:text-accent">
                  {cat.name_en}
                </h2>
                <p className="mb-4 text-sm text-muted-foreground">{cat.description_en}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {stats?.count ?? 0} services
                  </span>
                  {stats?.minPrice && stats.minPrice < Infinity && (
                    <span className="font-semibold text-accent">
                      From AED {stats.minPrice}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        <section className="mt-12 rounded-xl bg-accent p-8 text-center text-accent-foreground">
          <h2 className="mb-2 text-2xl font-bold">Ready to Book?</h2>
          <p className="mb-4 text-accent-foreground/80">Licensed professionals, transparent pricing, 72-hour guarantee.</p>
          <Link href="/book" className="inline-flex rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90">
            Book Now
          </Link>
        </section>
      </div>
    </div>
  );
}
