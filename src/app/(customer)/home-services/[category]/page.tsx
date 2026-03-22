import Link from 'next/link';
import { notFound } from 'next/navigation';
import { siteConfig } from '@/config/site';
import { createAdminClient } from '@/lib/supabase/admin';

interface Props {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { category } = await params;
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('service_categories')
    .select('name_en, seo_title_en, seo_desc_en')
    .eq('slug', category)
    .single();

  if (!data) return { title: 'Services' };
  const title = data.seo_title_en || (data.name_en.toLowerCase().includes('service') ? data.name_en : `${data.name_en} Services`);
  const description = data.seo_desc_en || (data.name_en.toLowerCase().includes('service')
    ? `Professional ${data.name_en.toLowerCase()} in Dubai by ${siteConfig.name}`
    : `Professional ${data.name_en.toLowerCase()} services in Dubai by ${siteConfig.name}`);
  return { title, description };
}

export const revalidate = 3600; // Revalidate every hour

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const supabase = createAdminClient();

  const { data: cat } = await supabase
    .from('service_categories')
    .select('*')
    .eq('slug', category)
    .eq('is_active', true)
    .single();

  if (!cat) notFound();

  const { data: services } = await supabase
    .from('services')
    .select(`
      id, slug, service_code, name_en, short_desc_en, image_url, base_price_aed, price_unit,
      duration_minutes, is_express_available, is_featured,
      service_variants(id, variant_label, price_aed, sort_order)
    `)
    .eq('category_id', cat.id)
    .eq('is_active', true)
    .eq('is_hidden', false)
    .order('sort_order');

  return (
    <div className="px-4 py-12 md:py-16">
      <div className="container mx-auto max-w-7xl">
        <nav className="mb-6 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-accent">Home</Link>{' / '}
          <Link href="/home-services" className="hover:text-accent">Home Services</Link>{' / '}
          <span className="text-foreground">{cat.name_en}</span>
        </nav>
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-foreground md:text-4xl">{cat.name_en}</h1>
          <p className="max-w-2xl text-muted-foreground">{cat.description_en}</p>
          {cat.image_url && (
            <div className="mt-6 overflow-hidden rounded-xl">
              <img src={cat.image_url} alt={`${cat.name_en} services in Dubai`} className="h-48 w-full object-cover md:h-64" loading="lazy" />
            </div>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {(services ?? []).map((service) => (
            <Link
              key={service.slug}
              href={`/home-services/${category}/${service.slug}`}
              className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-accent hover:shadow-lg"
            >
              {service.image_url ? (
                <div className="mb-3 -mx-6 -mt-6 overflow-hidden rounded-t-xl">
                  <img src={service.image_url} alt={`${service.name_en} in Dubai`} className="h-32 w-full object-cover" loading="lazy" />
                </div>
              ) : (
                <div className="mb-3 -mx-6 -mt-6 flex h-32 items-center justify-center rounded-t-xl bg-gradient-to-br from-accent/5 to-accent/10">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-accent/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.049.58.025 1.193-.14 1.743" />
                  </svg>
                </div>
              )}
              <div className="mb-2 flex items-center gap-2">
                <span className="font-mono text-xs text-muted-foreground">{service.service_code}</span>
                {service.is_featured && (
                  <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-semibold text-accent">Popular</span>
                )}
                {service.is_express_available && (
                  <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-[10px] font-semibold text-yellow-800">Express</span>
                )}
              </div>
              <h3 className="mb-2 text-lg font-semibold text-card-foreground group-hover:text-accent">
                {service.name_en}
              </h3>
              <p className="mb-4 text-sm text-muted-foreground">{service.short_desc_en}</p>

              {service.service_variants && service.service_variants.length > 0 ? (
                <div className="space-y-1">
                  {service.service_variants.slice(0, 3).map((v) => (
                    <div key={v.id} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{v.variant_label}</span>
                      <span className="font-medium text-foreground">AED {v.price_aed}</span>
                    </div>
                  ))}
                  {service.service_variants.length > 3 && (
                    <p className="text-xs text-accent">+{service.service_variants.length - 3} more sizes</p>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{service.duration_minutes} min</span>
                  <span className="font-semibold text-accent">
                    From AED {service.base_price_aed}
                    {service.price_unit === 'per_hour' ? '/hr' : service.price_unit === 'per_sqft' ? '/sqft' : ''}
                  </span>
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
