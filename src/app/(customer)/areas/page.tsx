import Link from 'next/link';
import { siteConfig } from '@/config/site';
import { MapPin } from 'lucide-react';

export const metadata = {
  title: 'Service Areas',
  description: `${siteConfig.name} serves 40+ areas across Dubai. Find professional home services in your neighborhood.`,
};

const zoneGroups = [
  {
    name: 'Marina & Coast',
    areas: [
      { name: 'Dubai Marina', slug: 'dubai-marina', services: 53 },
      { name: 'JBR', slug: 'jbr', services: 53 },
      { name: 'Palm Jumeirah', slug: 'palm-jumeirah', services: 53 },
      { name: 'Bluewaters Island', slug: 'bluewaters-island', services: 48 },
    ],
  },
  {
    name: 'Downtown & DIFC',
    areas: [
      { name: 'Downtown Dubai', slug: 'downtown-dubai', services: 53 },
      { name: 'DIFC', slug: 'difc', services: 45 },
      { name: 'Business Bay', slug: 'business-bay', services: 53 },
      { name: 'City Walk', slug: 'city-walk', services: 45 },
    ],
  },
  {
    name: 'New Dubai',
    areas: [
      { name: 'JLT', slug: 'jlt', services: 53 },
      { name: 'Dubai Hills', slug: 'dubai-hills', services: 53 },
      { name: 'Dubai Creek Harbour', slug: 'dubai-creek-harbour', services: 48 },
      { name: 'MBR City', slug: 'mbr-city', services: 45 },
    ],
  },
  {
    name: 'Villa Communities',
    areas: [
      { name: 'Arabian Ranches', slug: 'arabian-ranches', services: 53 },
      { name: 'Jumeirah', slug: 'jumeirah', services: 53 },
      { name: 'Al Barsha', slug: 'al-barsha', services: 53 },
      { name: 'Mirdif', slug: 'mirdif', services: 50 },
    ],
  },
];

export default function AreasPage() {
  return (
    <div className="px-4 py-12 md:py-16">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-12">
          <h1 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
            Service Areas in Dubai
          </h1>
          <p className="max-w-2xl text-muted-foreground">
            {siteConfig.name} serves 40+ areas across Dubai. Select your area
            to see available services and pricing.
          </p>
        </div>

        <div className="space-y-12">
          {zoneGroups.map((zone) => (
            <div key={zone.name}>
              <h2 className="mb-6 text-xl font-semibold text-foreground">
                {zone.name}
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {zone.areas.map((area) => (
                  <Link
                    key={area.slug}
                    href={`/areas/${area.slug}`}
                    className="group rounded-xl border border-border bg-card p-5 transition-all hover:border-accent hover:shadow-md"
                  >
                    <div className="mb-3 flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-accent" />
                      <h3 className="font-semibold text-card-foreground group-hover:text-accent">
                        {area.name}
                      </h3>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {area.services} services available
                    </p>
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
