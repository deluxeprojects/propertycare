import Link from 'next/link';
import { notFound } from 'next/navigation';
import { siteConfig } from '@/config/site';
import { createAdminClient } from '@/lib/supabase/admin';
import { MapPin, Building2, Calendar, ArrowLeft, ArrowRight, Users } from 'lucide-react';
import { AreaMap } from '@/features/customer/components/AreaMap';

interface Props {
  params: Promise<{ area: string; building: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { area: areaSlug, building: buildingSlug } = await params;
  const supabase = createAdminClient();
  const { data } = await supabase.from('buildings').select('name_en, areas(name_en)').eq('slug', buildingSlug).single();
  if (!data) return { title: 'Building' };
  const areaName = (data.areas as unknown as { name_en: string } | null)?.name_en ?? '';
  return {
    title: `Home Services at ${data.name_en}, ${areaName}`,
    description: `Professional home services at ${data.name_en} in ${areaName}, Dubai. Cleaning, AC, pest control & more by ${siteConfig.name}.`,
    alternates: {
      canonical: `https://${siteConfig.domain}/buildings/${areaSlug}/${buildingSlug}`,
    },
  };
}

export default async function BuildingPage({ params }: Props) {
  const { area: areaSlug, building: buildingSlug } = await params;
  const supabase = createAdminClient();

  const { data: building } = await supabase
    .from('buildings')
    .select('*, areas(id, slug, name_en, zone_group)')
    .eq('slug', buildingSlug)
    .eq('is_active', true)
    .single();

  if (!building) notFound();

  const area = building.areas as { id: string; slug: string; name_en: string; zone_group: string } | null;

  const { data: services } = await supabase
    .from('services')
    .select('id, slug, name_en, base_price_aed, price_unit, service_categories(slug)')
    .eq('is_active', true)
    .eq('is_hidden', false)
    .order('sort_order')
    .limit(12);

  const { data: otherBuildings } = await supabase
    .from('buildings')
    .select('slug, name_en')
    .eq('area_id', area?.id)
    .neq('slug', buildingSlug)
    .eq('is_active', true)
    .limit(6);

  return (
    <div className="px-4 py-12 md:py-16">
      <div className="container mx-auto max-w-7xl">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-muted-foreground">
          <Link href="/areas" className="hover:text-accent-text">Areas</Link>
          {' / '}
          <Link href={`/areas/${areaSlug}`} className="hover:text-accent-text">{area?.name_en}</Link>
          {' / '}
          <span className="text-foreground">{building.name_en}</span>
        </nav>

        {/* Hero */}
        <div className="mb-10">
          <h1 className="mb-3 text-3xl font-bold text-foreground md:text-4xl">
            Home Services at {building.name_en}
          </h1>
          <div className="mb-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            {area && (
              <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{area.name_en}, Dubai</span>
            )}
            {building.developer && (
              <span className="flex items-center gap-1"><Building2 className="h-4 w-4" />by {building.developer}</span>
            )}
            {building.year_built && (
              <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />Built {building.year_built}</span>
            )}
            {building.unit_count_approx && (
              <span className="flex items-center gap-1"><Users className="h-4 w-4" />~{building.unit_count_approx} units</span>
            )}
          </div>
          {building.description_en && (
            <p className="max-w-3xl text-muted-foreground">{building.description_en}</p>
          )}
        </div>

        {/* Map */}
        <div className="mb-12">
          <AreaMap latitude={Number(building.latitude)} longitude={Number(building.longitude)} areaName={building.name_en} />
        </div>

        {/* Services */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-semibold text-foreground">
            Services Available at {building.name_en}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(services ?? []).map((s) => {
              const catSlug = (s.service_categories as unknown as { slug: string } | null)?.slug ?? '';
              return (
                <Link
                  key={s.id}
                  href={`/buildings/${areaSlug}/${buildingSlug}/${s.slug}`}
                  className="group flex items-center justify-between rounded-lg border border-border bg-card p-4 transition-colors hover:border-accent"
                >
                  <p className="font-medium text-foreground group-hover:text-accent-text">{s.name_en}</p>
                  <span className="shrink-0 text-sm font-semibold text-accent-text">AED {s.base_price_aed}</span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Other buildings */}
        {otherBuildings && otherBuildings.length > 0 && (
          <section className="mb-12">
            <h2 className="mb-4 text-xl font-semibold text-foreground">
              Other Buildings in {area?.name_en}
            </h2>
            <div className="flex flex-wrap gap-3">
              {otherBuildings.map((b) => (
                <Link
                  key={b.slug}
                  href={`/buildings/${areaSlug}/${b.slug}`}
                  className="rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-accent hover:text-accent-text"
                >
                  {b.name_en}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="rounded-xl bg-accent p-8 text-center text-accent-foreground">
          <h2 className="mb-2 text-2xl font-bold">Need a Service at {building.name_en}?</h2>
          <p className="mb-4 text-accent-foreground/80">Book online in 60 seconds — we know your building</p>
          <Link href="/book" className="inline-flex items-center rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90">
            Book Now <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </section>
      </div>
    </div>
  );
}
