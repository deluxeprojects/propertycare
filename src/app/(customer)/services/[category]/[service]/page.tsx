import Link from 'next/link';
import { notFound } from 'next/navigation';
import { siteConfig } from '@/config/site';
import { createAdminClient } from '@/lib/supabase/admin';
import { ArrowLeft, Clock, Star, Shield, Zap, CheckCircle2 } from 'lucide-react';

interface Props {
  params: Promise<{ category: string; service: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { service } = await params;
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('services')
    .select('name_en, short_desc_en')
    .eq('slug', service)
    .single();

  if (!data) return { title: 'Service' };
  return {
    title: `${data.name_en} in Dubai`,
    description: `${data.short_desc_en} Professional ${data.name_en.toLowerCase()} service in Dubai by ${siteConfig.name}. Book online.`,
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { category, service: serviceSlug } = await params;
  const supabase = createAdminClient();

  const { data: service } = await supabase
    .from('services')
    .select(`
      *,
      service_categories(id, slug, name_en),
      service_variants(id, variant_label, price_aed, duration_minutes, sort_order, is_active),
      service_addons(id, name_en, price_aed, duration_minutes, sort_order, is_active)
    `)
    .eq('slug', serviceSlug)
    .single();

  if (!service) notFound();

  const activeVariants = (service.service_variants ?? [])
    .filter((v: { is_active: boolean }) => v.is_active)
    .sort((a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order);

  const activeAddons = (service.service_addons ?? [])
    .filter((a: { is_active: boolean }) => a.is_active)
    .sort((a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order);

  return (
    <div className="px-4 py-12 md:py-16">
      <div className="container mx-auto max-w-7xl">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-muted-foreground">
          <Link href="/services" className="hover:text-accent">Services</Link>
          {' / '}
          <Link href={`/services/${category}`} className="hover:text-accent">
            {service.service_categories?.name_en}
          </Link>
          {' / '}
          <span className="text-foreground">{service.name_en}</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left: Details */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs text-muted-foreground">{service.service_code}</span>
                {service.is_express_available && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800">
                    <Zap className="h-3 w-3" /> Express Available
                  </span>
                )}
              </div>
              <h1 className="mb-4 text-3xl font-bold text-foreground">{service.name_en}</h1>
              <p className="text-muted-foreground">{service.long_desc_en || service.short_desc_en}</p>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-4">
              {[
                { icon: Shield, label: 'Licensed & Insured' },
                { icon: Star, label: '4.8 Rating' },
                { icon: Clock, label: `${service.duration_minutes} min est.` },
              ].map((b) => (
                <div key={b.label} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <b.icon className="h-4 w-4 text-accent" />
                  {b.label}
                </div>
              ))}
            </div>

            {/* What's included */}
            <div>
              <h2 className="mb-4 text-xl font-semibold text-foreground">What&apos;s Included</h2>
              <ul className="space-y-2">
                {['Professional-grade equipment & materials', 'Licensed & background-checked technician', 'Full cleanup after service', '72-hour satisfaction guarantee', 'Digital invoice & receipt'].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-foreground">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Add-ons */}
            {activeAddons.length > 0 && (
              <div>
                <h2 className="mb-4 text-xl font-semibold text-foreground">Available Add-ons</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {activeAddons.map((addon: { id: string; name_en: string; price_aed: number; duration_minutes: number }) => (
                    <div key={addon.id} className="flex items-center justify-between rounded-lg border border-border bg-card p-3">
                      <div>
                        <p className="text-sm font-medium text-foreground">{addon.name_en}</p>
                        {addon.duration_minutes > 0 && (
                          <p className="text-xs text-muted-foreground">+{addon.duration_minutes} min</p>
                        )}
                      </div>
                      <span className="text-sm font-semibold text-accent">+AED {addon.price_aed}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Booking widget */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 rounded-xl border border-border bg-card p-6">
              <h3 className="mb-4 text-lg font-semibold text-foreground">Book This Service</h3>

              {activeVariants.length > 0 ? (
                <div className="mb-4 space-y-2">
                  <p className="text-sm font-medium text-foreground">Select property size:</p>
                  {activeVariants.map((v: { id: string; variant_label: string; price_aed: number; duration_minutes: number }) => (
                    <div key={v.id} className="flex cursor-pointer items-center justify-between rounded-lg border border-border p-3 transition-colors hover:border-accent hover:bg-accent/5">
                      <div>
                        <p className="text-sm font-medium text-foreground">{v.variant_label}</p>
                        <p className="text-xs text-muted-foreground">{v.duration_minutes} min</p>
                      </div>
                      <span className="font-semibold text-foreground">AED {v.price_aed}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mb-4">
                  <p className="text-2xl font-bold text-foreground">
                    AED {service.base_price_aed}
                    <span className="text-sm font-normal text-muted-foreground">
                      {service.price_unit === 'per_hour' ? '/hr' : service.price_unit === 'per_sqft' ? '/sqft' : ''}
                    </span>
                  </p>
                </div>
              )}

              <Link
                href={`/book?service=${serviceSlug}`}
                className="mb-3 block w-full rounded-lg bg-accent py-3 text-center text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90"
              >
                Book Now
              </Link>

              <p className="text-center text-xs text-muted-foreground">
                Free cancellation up to 12 hours before service
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
