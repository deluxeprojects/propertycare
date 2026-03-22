import Link from 'next/link';
import { siteConfig } from '@/config/site';
import { Sparkles, Wind, Bug, Droplets, Plug, Paintbrush } from 'lucide-react';

export const metadata = {
  title: 'Home Services in Dubai',
  description: '53+ professional home services in Dubai. Licensed cleaning, AC maintenance, pest control, plumbing, electrical & painting. Book online with ProKeep.',
};

const categories = [
  {
    icon: Sparkles,
    name: 'Cleaning',
    slug: 'cleaning',
    desc: 'Apartment deep cleaning, villa cleaning, move-in/out prep, sofa and carpet shampooing, mattress sanitization, and window cleaning — all with eco-friendly products.',
    services: 12,
    startingPrice: 38,
  },
  {
    icon: Wind,
    name: 'AC Services',
    slug: 'ac-services',
    desc: 'Split and central AC servicing, coil deep cleaning, full duct sanitization, refrigerant top-up, and annual maintenance contracts for Dubai apartments and villas.',
    services: 5,
    startingPrice: 120,
  },
  {
    icon: Bug,
    name: 'Pest Control',
    slug: 'pest-control',
    desc: 'DM-approved pest treatments for cockroaches, bed bugs, termites, and rodents. Gel baiting, fumigation, and quarterly prevention plans for homes and offices.',
    services: 10,
    startingPrice: 220,
  },
  {
    icon: Droplets,
    name: 'Plumbing',
    slug: 'plumbing',
    desc: 'Leak repairs, drain unblocking, water heater installation, toilet and faucet replacement, and 24/7 emergency plumbing across all Dubai communities.',
    services: 7,
    startingPrice: 130,
  },
  {
    icon: Plug,
    name: 'Electrical',
    slug: 'electrical',
    desc: 'Light and socket installation, circuit breaker repairs, smart home wiring, CCTV setup, and emergency electrical fault-finding by DEWA-certified technicians.',
    services: 5,
    startingPrice: 150,
  },
  {
    icon: Paintbrush,
    name: 'Painting & Fit-Out',
    slug: 'painting',
    desc: 'Professional interior painting, wallpaper hanging, kitchen and bathroom renovations, flooring installation, and custom carpentry — with free color consultations.',
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
            Home Services in Dubai
          </h1>
          <p className="max-w-2xl text-muted-foreground">
            Licensed professionals, transparent pricing, 72-hour guarantee.
            From routine apartment cleaning to full villa maintenance — we
            handle it all across 40+ Dubai neighborhoods.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/home-services/${cat.slug}`}
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
