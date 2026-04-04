import Link from 'next/link';
import { notFound } from 'next/navigation';
import { siteConfig } from '@/config/site';
import { createAdminClient } from '@/lib/supabase/admin';
import { MapPin, ArrowRight, CheckCircle2, Shield, Star, Clock } from 'lucide-react';
import { ServiceContent } from '@/features/customer/components/ServiceContent';

interface Props {
  params: Promise<{ area: string; building: string; service: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { area: areaSlug, building: buildingSlug, service: serviceSlug } = await params;
  const supabase = createAdminClient();
  const { data: building } = await supabase.from('buildings').select('name_en, areas(name_en)').eq('slug', buildingSlug).single();
  const { data: service } = await supabase.from('services').select('name_en').eq('slug', serviceSlug).single();
  if (!building || !service) return { title: 'Service' };
  const areaName = (building.areas as unknown as { name_en: string } | null)?.name_en ?? '';
  return {
    title: `${service.name_en} at ${building.name_en}, ${areaName}`,
    description: `Professional ${service.name_en.toLowerCase()} at ${building.name_en} in ${areaName}, Dubai. Licensed technicians, 72-hr guarantee. Book with ${siteConfig.name}.`,
    alternates: {
      canonical: `https://${siteConfig.domain}/buildings/${areaSlug}/${buildingSlug}/${serviceSlug}`,
    },
  };
}

export default async function BuildingServicePage({ params }: Props) {
  const { area: areaSlug, building: buildingSlug, service: serviceSlug } = await params;
  const supabase = createAdminClient();

  const { data: building } = await supabase.from('buildings').select('*, areas(slug, name_en)').eq('slug', buildingSlug).single();
  const { data: service } = await supabase
    .from('services')
    .select('*, service_variants(id, variant_label, price_aed, duration_minutes, sort_order, is_active), service_addons(id, name_en, price_aed, is_active), service_categories(slug, name_en)')
    .eq('slug', serviceSlug)
    .single();

  if (!building || !service) notFound();

  const area = building.areas as { slug: string; name_en: string } | null;
  const variants = (service.service_variants ?? []).filter((v: { is_active: boolean }) => v.is_active).sort((a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order);
  const addons = (service.service_addons ?? []).filter((a: { is_active: boolean }) => a.is_active);

  return (
    <div className="px-4 py-12 md:py-16">
      <div className="container mx-auto max-w-7xl">
        <nav className="mb-6 text-sm text-muted-foreground">
          <Link href="/areas" className="hover:text-accent">Areas</Link>{' / '}
          <Link href={`/areas/${areaSlug}`} className="hover:text-accent">{area?.name_en}</Link>{' / '}
          <Link href={`/buildings/${areaSlug}/${buildingSlug}`} className="hover:text-accent">{building.name_en}</Link>{' / '}
          <span className="text-foreground">{service.name_en}</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h1 className="mb-2 text-3xl font-bold text-foreground">
                {service.name_en} at {building.name_en}
              </h1>
              <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                {area?.name_en}, Dubai
                {building.developer && <span>· by {building.developer}</span>}
              </div>
              <ServiceContent content={service.long_desc_en || service.short_desc_en || ''} />
            </div>

            <div className="flex flex-wrap gap-4">
              {[
                { icon: Shield, label: 'Licensed & Insured' },
                { icon: Star, label: '4.8 Rating' },
                { icon: Clock, label: `${service.duration_minutes} min est.` },
              ].map((b) => (
                <div key={b.label} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <b.icon className="h-4 w-4 text-accent" /> {b.label}
                </div>
              ))}
            </div>

            <div>
              <h2 className="mb-4 text-xl font-semibold text-foreground">What&apos;s Included</h2>
              <ul className="space-y-2">
                {['Professional-grade equipment', 'Licensed technician familiar with this building', 'Full cleanup after service', '72-hour satisfaction guarantee', 'Digital invoice'].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-foreground">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600" /> {item}
                  </li>
                ))}
              </ul>
            </div>

            {addons.length > 0 && (
              <div>
                <h2 className="mb-4 text-xl font-semibold text-foreground">Available Add-ons</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {addons.map((addon: { id: string; name_en: string; price_aed: number }) => (
                    <div key={addon.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                      <span className="text-sm font-medium text-foreground">{addon.name_en}</span>
                      <span className="text-sm font-semibold text-accent">+AED {addon.price_aed}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-20 rounded-xl border border-border bg-card p-6">
              <h3 className="mb-4 text-lg font-semibold text-foreground">Book at {building.name_en}</h3>
              {variants.length > 0 ? (
                <div className="mb-4 space-y-2">
                  {variants.map((v: { id: string; variant_label: string; price_aed: number; duration_minutes: number }) => (
                    <div key={v.id} className="flex cursor-pointer items-center justify-between rounded-lg border border-border p-3 hover:border-accent hover:bg-accent/5">
                      <div>
                        <p className="text-sm font-medium text-foreground">{v.variant_label}</p>
                        <p className="text-xs text-muted-foreground">{v.duration_minutes} min</p>
                      </div>
                      <span className="font-semibold text-foreground">AED {v.price_aed}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mb-4 text-2xl font-bold text-foreground">AED {service.base_price_aed}</p>
              )}
              <Link href={`/book?service=${serviceSlug}`} className="mb-3 block w-full rounded-lg bg-accent py-3 text-center text-sm font-semibold text-accent-foreground hover:bg-accent/90">
                Book Now
              </Link>
              <p className="text-center text-xs text-muted-foreground">Free cancellation up to 12 hours before</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
