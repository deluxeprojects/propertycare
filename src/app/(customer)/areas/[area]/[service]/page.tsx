import Link from 'next/link';
import { notFound } from 'next/navigation';
import { siteConfig } from '@/config/site';
import { createAdminClient } from '@/lib/supabase/admin';
import { MapPin, ArrowRight, CheckCircle2, Shield, Star, Clock } from 'lucide-react';

interface Props {
  params: Promise<{ area: string; service: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { area: areaSlug, service: serviceSlug } = await params;
  const supabase = createAdminClient();
  const { data: area } = await supabase.from('areas').select('name_en').eq('slug', areaSlug).single();
  const { data: service } = await supabase.from('services').select('name_en, base_price_aed').eq('slug', serviceSlug).single();
  if (!area || !service) return { title: 'Service' };
  return {
    title: `${service.name_en} in ${area.name_en}, Dubai`,
    description: `Professional ${service.name_en.toLowerCase()} in ${area.name_en}, Dubai. Starting AED ${service.base_price_aed}. Licensed technicians, 72-hr guarantee. Book online with ${siteConfig.name}.`,
  };
}

export default async function AreaServicePage({ params }: Props) {
  const { area: areaSlug, service: serviceSlug } = await params;
  const supabase = createAdminClient();

  const { data: area } = await supabase.from('areas').select('*').eq('slug', areaSlug).eq('is_active', true).single();
  const { data: service } = await supabase
    .from('services')
    .select('*, service_variants(id, variant_label, price_aed, duration_minutes, sort_order, is_active), service_addons(id, name_en, price_aed, is_active), service_categories(slug, name_en)')
    .eq('slug', serviceSlug).single();

  if (!area || !service) notFound();

  const variants = (service.service_variants ?? []).filter((v: { is_active: boolean }) => v.is_active).sort((a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order);

  const { data: buildings } = await supabase
    .from('buildings')
    .select('slug, name_en, developer')
    .eq('area_id', area.id)
    .eq('is_active', true)
    .limit(10);

  const { data: relatedServices } = await supabase
    .from('services')
    .select('slug, name_en, base_price_aed, service_categories(slug)')
    .eq('category_id', service.category_id)
    .neq('slug', serviceSlug)
    .eq('is_active', true)
    .eq('is_hidden', false)
    .limit(4);

  return (
    <div className="px-4 py-12 md:py-16">
      <div className="container mx-auto max-w-7xl">
        <nav className="mb-6 text-sm text-muted-foreground">
          <Link href="/areas" className="hover:text-accent">Areas</Link>{' / '}
          <Link href={`/areas/${areaSlug}`} className="hover:text-accent">{area.name_en}</Link>{' / '}
          <span className="text-foreground">{service.name_en}</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h1 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
                {service.name_en} in {area.name_en}, Dubai
              </h1>
              <p className="text-muted-foreground">
                {service.long_desc_en || service.short_desc_en}
                {' '}We serve all buildings and properties in {area.name_en} with licensed, insured technicians.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              {[
                { icon: Shield, label: 'Licensed & Insured' },
                { icon: Star, label: '4.8 Rating in ' + area.name_en },
                { icon: Clock, label: `${service.duration_minutes} min est.` },
              ].map((b) => (
                <div key={b.label} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <b.icon className="h-4 w-4 text-accent" /> {b.label}
                </div>
              ))}
            </div>

            {/* Pricing table */}
            {variants.length > 0 && (
              <div>
                <h2 className="mb-4 text-xl font-semibold text-foreground">Pricing in {area.name_en}</h2>
                <div className="overflow-x-auto rounded-lg border border-border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/50">
                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">Property Size</th>
                        <th className="px-4 py-3 text-right font-medium text-muted-foreground">Price (AED)</th>
                        <th className="px-4 py-3 text-right font-medium text-muted-foreground">Duration</th>
                      </tr>
                    </thead>
                    <tbody>
                      {variants.map((v: { id: string; variant_label: string; price_aed: number; duration_minutes: number }) => (
                        <tr key={v.id} className="border-b border-border last:border-0">
                          <td className="px-4 py-3 font-medium text-foreground">{v.variant_label}</td>
                          <td className="px-4 py-3 text-right font-semibold text-foreground">AED {v.price_aed}</td>
                          <td className="px-4 py-3 text-right text-muted-foreground">{v.duration_minutes} min</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Buildings served */}
            {buildings && buildings.length > 0 && (
              <div>
                <h2 className="mb-4 text-xl font-semibold text-foreground">Buildings We Serve in {area.name_en}</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {buildings.map((b) => (
                    <Link
                      key={b.slug}
                      href={`/buildings/${areaSlug}/${b.slug}/${serviceSlug}`}
                      className="group rounded-lg border border-border p-3 transition-colors hover:border-accent"
                    >
                      <p className="font-medium text-foreground group-hover:text-accent">{b.name_en}</p>
                      {b.developer && <p className="text-xs text-muted-foreground">by {b.developer}</p>}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Related services */}
            {relatedServices && relatedServices.length > 0 && (
              <div>
                <h2 className="mb-4 text-xl font-semibold text-foreground">Other Services in {area.name_en}</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {relatedServices.map((s) => {
                    return (
                      <Link key={s.slug} href={`/areas/${areaSlug}/${s.slug}`} className="group rounded-lg border border-border p-3 transition-colors hover:border-accent">
                        <p className="font-medium text-foreground group-hover:text-accent">{s.name_en}</p>
                        <p className="text-xs text-accent">From AED {s.base_price_aed}</p>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Booking sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 rounded-xl border border-border bg-card p-6">
              <h3 className="mb-1 text-lg font-semibold text-foreground">{service.name_en}</h3>
              <p className="mb-4 text-sm text-muted-foreground">in {area.name_en}</p>
              {variants.length > 0 ? (
                <p className="mb-4 text-2xl font-bold text-foreground">
                  From AED {variants[0]?.price_aed}
                </p>
              ) : (
                <p className="mb-4 text-2xl font-bold text-foreground">AED {service.base_price_aed}</p>
              )}
              <Link href={`/book?service=${serviceSlug}&area=${areaSlug}`} className="mb-3 block w-full rounded-lg bg-accent py-3 text-center text-sm font-semibold text-accent-foreground hover:bg-accent/90">
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
