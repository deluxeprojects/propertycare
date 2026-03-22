import Link from 'next/link';
import { siteConfig } from '@/config/site';
import { Sparkles, Wind, Bug, Droplets, Plug, Paintbrush } from 'lucide-react';

export const metadata = {
  title: 'All Services',
  description: `Professional home services in Dubai by ${siteConfig.name}. Cleaning, AC, pest control, plumbing, electrical, painting & more.`,
};

const categories = [
  {
    icon: Sparkles,
    name: 'Cleaning',
    slug: 'cleaning',
    desc: 'Regular cleaning, deep cleaning, move-in/out, sofa, carpet, mattress, window & water tank cleaning.',
    services: 12,
    startingPrice: 38,
  },
  {
    icon: Wind,
    name: 'AC Services',
    slug: 'ac-services',
    desc: 'AC servicing, deep clean, duct cleaning, repair, installation & maintenance contracts.',
    services: 5,
    startingPrice: 120,
  },
  {
    icon: Bug,
    name: 'Pest Control',
    slug: 'pest-control',
    desc: 'General pest treatment, bed bugs, cockroach gel, termite, rodent control & commercial pest management.',
    services: 10,
    startingPrice: 220,
  },
  {
    icon: Droplets,
    name: 'Plumbing',
    slug: 'plumbing',
    desc: 'Standard & emergency plumbing, water heater installation, appliance repair & handyman services.',
    services: 7,
    startingPrice: 130,
  },
  {
    icon: Plug,
    name: 'Electrical',
    slug: 'electrical',
    desc: 'Standard & emergency electrical, smart home setup, CCTV installation & appliance repair.',
    services: 5,
    startingPrice: 150,
  },
  {
    icon: Paintbrush,
    name: 'Painting & Fit-Out',
    slug: 'painting',
    desc: 'Interior painting, wallpaper installation, kitchen & bathroom renovation, flooring & custom carpentry.',
    services: 11,
    startingPrice: 700,
  },
];

export default function ServicesPage() {
  return (
    <div className="px-4 py-12 md:py-16">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-12">
          <h1 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
            Our Services
          </h1>
          <p className="max-w-2xl text-muted-foreground">
            53+ professional home services across Dubai. All technicians are
            licensed, insured, and background-checked. Book online in 60
            seconds.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/services/${cat.slug}`}
              className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-accent hover:shadow-lg"
            >
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-accent/10">
                <cat.icon className="h-7 w-7 text-accent" />
              </div>
              <h2 className="mb-2 text-xl font-semibold text-card-foreground group-hover:text-accent">
                {cat.name}
              </h2>
              <p className="mb-4 text-sm text-muted-foreground">{cat.desc}</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {cat.services} services
                </span>
                <span className="font-semibold text-accent">
                  From AED {cat.startingPrice}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
