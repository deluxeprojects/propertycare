import Link from 'next/link';
import { siteConfig } from '@/config/site';
import { createAdminClient } from '@/lib/supabase/admin';
import { MapPin } from 'lucide-react';

export const metadata = {
  title: 'Service Areas in Dubai',
  description: 'ProKeep serves 40+ areas across Dubai. Find professional cleaning, AC, pest control & maintenance services in your neighborhood. Same-day booking available.',
};

export default async function AreasPage() {
  const supabase = createAdminClient();
  const { data: areas } = await supabase
    .from('areas')
    .select('slug, name_en, zone_group')
    .eq('is_active', true)
    .order('zone_group')
    .order('name_en');

  // Group areas by zone_group
  const zoneGroups: Record<string, Array<{ slug: string; name_en: string }>> = {};
  for (const area of areas ?? []) {
    const group = area.zone_group ?? 'Other';
    if (!zoneGroups[group]) zoneGroups[group] = [];
    zoneGroups[group].push({ slug: area.slug, name_en: area.name_en });
  }

  const formatGroupName = (key: string) =>
    key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className="px-4 py-12 md:py-16">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-12">
          <h1 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
            Service Areas in Dubai
          </h1>
          <p className="max-w-2xl text-muted-foreground">
            We operate across Dubai — from Marina and Downtown to JLT and
            Arabian Ranches. Select your neighborhood to see available
            services, pricing, and same-day availability.
          </p>
        </div>

        <div className="space-y-12">
          {Object.entries(zoneGroups).map(([group, groupAreas]) => (
            <div key={group}>
              <h2 className="mb-6 text-xl font-semibold text-foreground">
                {formatGroupName(group)}
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {groupAreas.map((area) => (
                  <Link
                    key={area.slug}
                    href={`/areas/${area.slug}`}
                    className="group rounded-xl border border-border bg-card p-5 transition-all hover:border-accent hover:shadow-md"
                  >
                    <div className="mb-3 flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-accent" />
                      <h3 className="font-semibold text-card-foreground group-hover:text-accent">
                        {area.name_en}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
