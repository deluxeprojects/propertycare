import type { MetadataRoute } from 'next';
import { createAdminClient } from '@/lib/supabase/admin';
import { siteConfig } from '@/config/site';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = `https://${siteConfig.domain}`;
  const supabase = createAdminClient();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/services`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/areas`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/amc`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ];

  // Category pages
  const { data: categories } = await supabase.from('service_categories').select('slug').eq('is_active', true);
  const categoryPages: MetadataRoute.Sitemap = (categories ?? []).map((c) => ({
    url: `${baseUrl}/services/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Service pages
  const { data: services } = await supabase
    .from('services')
    .select('slug, service_categories(slug)')
    .eq('is_active', true)
    .eq('is_hidden', false);
  const servicePages: MetadataRoute.Sitemap = (services ?? []).map((s) => ({
    url: `${baseUrl}/services/${(s.service_categories as unknown as { slug: string } | null)?.slug}/${s.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Area pages
  const { data: areas } = await supabase.from('areas').select('slug').eq('is_active', true);
  const areaPages: MetadataRoute.Sitemap = (areas ?? []).map((a) => ({
    url: `${baseUrl}/areas/${a.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Area+Service pages
  const areaServicePages: MetadataRoute.Sitemap = [];
  for (const area of areas ?? []) {
    for (const service of services ?? []) {
      areaServicePages.push({
        url: `${baseUrl}/areas/${area.slug}/${service.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      });
    }
  }

  // Building pages
  const { data: buildings } = await supabase.from('buildings').select('slug, areas(slug)').eq('is_active', true).eq('noindex', false);
  const buildingPages: MetadataRoute.Sitemap = (buildings ?? []).map((b) => ({
    url: `${baseUrl}/buildings/${(b.areas as unknown as { slug: string } | null)?.slug}/${b.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }));

  return [
    ...staticPages,
    ...categoryPages,
    ...servicePages,
    ...areaPages,
    ...areaServicePages,
    ...buildingPages,
  ];
}
