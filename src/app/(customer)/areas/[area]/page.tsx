import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { siteConfig } from '@/config/site';
import { createAdminClient } from '@/lib/supabase/admin';
import { MapPin, ArrowLeft, ArrowRight } from 'lucide-react';
import { AreaMap } from '@/features/customer/components/AreaMap';
import { ExpandableText } from '@/features/customer/components/ExpandableText';

interface Props {
  params: Promise<{ area: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { area } = await params;
  const supabase = createAdminClient();
  const { data } = await supabase.from('areas').select('name_en, meta_title_en, meta_desc_en').eq('slug', area).single();
  if (!data) return { title: 'Area' };
  return {
    title: data.meta_title_en || `Home Services in ${data.name_en}, Dubai`,
    description: data.meta_desc_en || `Professional home services in ${data.name_en}, Dubai. Cleaning, AC, pest control & more by ${siteConfig.name}.`,
    alternates: {
      canonical: `https://${siteConfig.domain}/areas/${area}`,
    },
    openGraph: {
      title: data.meta_title_en || `Home Services in ${data.name_en}, Dubai`,
      description: data.meta_desc_en || `Professional home services in ${data.name_en}, Dubai. Cleaning, AC, pest control & more by ${siteConfig.name}.`,
      url: `https://${siteConfig.domain}/areas/${area}`,
      images: [{ url: `https://${siteConfig.domain}/og-image.png`, width: 1200, height: 630 }],
    },
  };
}

export const revalidate = 3600; // Revalidate every hour

export default async function AreaPage({ params }: Props) {
  const { area: areaSlug } = await params;
  const supabase = createAdminClient();

  const { data: area } = await supabase.from('areas').select('*').eq('slug', areaSlug).eq('is_active', true).single();
  if (!area) notFound();

  const { data: services } = await supabase
    .from('services')
    .select('id, slug, name_en, short_desc_en, base_price_aed, price_unit, service_categories(slug, name_en)')
    .eq('is_active', true)
    .eq('is_hidden', false)
    .order('sort_order')
    .limit(12);

  const { data: buildings } = await supabase
    .from('buildings')
    .select('id, slug, name_en, developer, unit_count_approx')
    .eq('area_id', area.id)
    .eq('is_active', true)
    .order('name_en')
    .limit(20);

  const { data: otherAreas } = await supabase
    .from('areas')
    .select('slug, name_en')
    .eq('zone_group', area.zone_group)
    .neq('slug', areaSlug)
    .eq('is_active', true)
    .limit(5);

  return (
    <div className="px-4 py-12 md:py-16">
      <div className="container mx-auto max-w-7xl">
        <Link href="/areas" className="mb-4 inline-flex items-center gap-1 text-sm text-accent hover:underline">
          <ArrowLeft className="h-4 w-4" /> All Areas
        </Link>

        {/* Hero */}
        <div className="mb-12">
          <div className="mb-2 flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span className="text-sm">{area.zone_group.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())}</span>
          </div>
          <h1 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
            Home Services in {area.name_en}, Dubai
          </h1>
          {area.image_url && (
            <div className="mt-4 overflow-hidden rounded-xl">
              <Image src={area.image_url} alt={`Home services in ${area.name_en}, Dubai`} className="h-48 w-full object-cover md:h-72" width={1200} height={288} priority />
            </div>
          )}

          <div className="mt-6">
            <ExpandableText text={area.description_en} maxLines={3} />
          </div>

          <div className="mt-6">
            <AreaMap latitude={Number(area.latitude)} longitude={Number(area.longitude)} areaName={area.name_en} />
          </div>

          {area.approximate_units && (
            <p className="mt-3 text-sm text-muted-foreground">
              ~{area.approximate_units.toLocaleString()} residential units
            </p>
          )}
        </div>

        {/* Services available */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-semibold text-foreground">Services Available in {area.name_en}</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(services ?? []).map((s) => (
              <Link
                key={s.id}
                href={`/areas/${areaSlug}/${s.slug}`}
                className="group flex items-center justify-between rounded-lg border border-border bg-card p-4 transition-colors hover:border-accent"
              >
                <div>
                  <p className="font-medium text-foreground group-hover:text-accent">{s.name_en}</p>
                  <p className="text-xs text-muted-foreground">{s.short_desc_en}</p>
                </div>
                <span className="shrink-0 text-sm font-semibold text-accent">
                  AED {s.base_price_aed}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Buildings */}
        {buildings && buildings.length > 0 && (
          <section className="mb-12">
            <h2 className="mb-6 text-2xl font-semibold text-foreground">Buildings in {area.name_en}</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {buildings.map((b) => (
                <Link
                  key={b.id}
                  href={`/buildings/${areaSlug}/${b.slug}`}
                  className="group rounded-lg border border-border bg-card p-4 transition-colors hover:border-accent"
                >
                  <p className="font-medium text-foreground group-hover:text-accent">{b.name_en}</p>
                  {b.developer && <p className="text-xs text-muted-foreground">by {b.developer}</p>}
                  {b.unit_count_approx && <p className="text-xs text-muted-foreground">~{b.unit_count_approx} units</p>}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Related areas */}
        {otherAreas && otherAreas.length > 0 && (
          <section className="mb-12">
            <h2 className="mb-4 text-xl font-semibold text-foreground">Nearby Areas</h2>
            <div className="flex flex-wrap gap-3">
              {otherAreas.map((a) => (
                <Link
                  key={a.slug}
                  href={`/areas/${a.slug}`}
                  className="rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-accent hover:text-accent"
                >
                  {a.name_en}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Guides */}
        <section className="mb-12">
          <h2 className="mb-4 text-xl font-semibold text-foreground">Guides for {area.name_en}</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { angle: 'best-for-families', label: 'Best for Families' },
              { angle: 'most-affordable', label: 'Most Affordable' },
              { angle: 'premium-packages', label: 'Premium Packages' },
              { angle: 'same-day', label: 'Same-Day Services' },
              { angle: 'for-high-rises', label: 'For High-Rise Residents' },
              { angle: 'annual-plans', label: 'Annual Care Plans' },
            ].map((g) => (
              <Link
                key={g.angle}
                href={`/guides/${areaSlug}/${g.angle}`}
                className="group rounded-lg border border-border p-3 transition-colors hover:border-accent"
              >
                <p className="text-sm font-medium text-foreground group-hover:text-accent">{g.label}</p>
                <p className="text-xs text-muted-foreground">in {area.name_en}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="rounded-xl bg-accent p-8 text-center text-accent-foreground">
          <h2 className="mb-2 text-2xl font-bold">Need a Service in {area.name_en}?</h2>
          <p className="mb-4 text-accent-foreground/80">Book online in 60 seconds — same-day service available</p>
          <Link href="/book" className="inline-flex items-center rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90">
            Book Now <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </section>
      </div>
    </div>
  );
}
