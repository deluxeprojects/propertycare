import Link from 'next/link';
import { notFound } from 'next/navigation';
import { siteConfig } from '@/config/site';
import { createAdminClient } from '@/lib/supabase/admin';
import { ArrowLeft } from 'lucide-react';

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
  return {
    title: data.seo_title_en || `${data.name_en} Services`,
    description: data.seo_desc_en || `Professional ${data.name_en.toLowerCase()} services in Dubai by ${siteConfig.name}`,
  };
}

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
      id, slug, service_code, name_en, short_desc_en, base_price_aed, price_unit,
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
        <div className="mb-8">
          <Link href="/home-services" className="mb-4 inline-flex items-center gap-1 text-sm text-accent hover:underline">
            <ArrowLeft className="h-4 w-4" /> All Services
          </Link>
          <h1 className="mb-2 text-3xl font-bold text-foreground md:text-4xl">{cat.name_en}</h1>
          <p className="max-w-2xl text-muted-foreground">{cat.description_en}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {(services ?? []).map((service) => (
            <Link
              key={service.slug}
              href={`/home-services/${category}/${service.slug}`}
              className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-accent hover:shadow-lg"
            >
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
