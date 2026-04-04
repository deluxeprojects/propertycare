import type { Metadata } from 'next';
import Link from 'next/link';
import { siteConfig } from '@/config/site';
import { SearchBar } from '@/features/customer/components/SearchBar';
import {
  Shield,
  Clock,
  Star,
  MapPin,
  Zap,
  Sparkles,
  Wind,
  Bug,
  Wrench,
  Paintbrush,
  Droplets,
  Plug,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Users,
  Phone,
} from 'lucide-react';

export const metadata: Metadata = {
  title: `${siteConfig.name} — ${siteConfig.tagline} | Professional Home Services in Dubai`,
  description: `${siteConfig.name} — Dubai's trusted home services platform. 53+ services including cleaning, AC maintenance, pest control, plumbing, electrical & painting. Book online in 60 seconds. Licensed professionals, transparent pricing, 72-hour guarantee.`,
  alternates: {
    canonical: `https://${siteConfig.domain}`,
  },
};

// TODO-REVIEW: Homepage service data is hardcoded and may drift from the database.
// Consider fetching from Supabase (with ISR caching) to stay in sync with the admin panel.
const services = [
  {
    icon: Sparkles,
    name: 'Cleaning',
    slug: 'cleaning',
    desc: 'Apartment deep cleaning, regular maid service, move-in/out cleaning, sofa & carpet shampooing, and window washing across Dubai',
    price: 38,
    unit: '/hr',
    subs: [
      { name: 'Regular Cleaning', slug: 'regular-home-cleaning' },
      { name: 'Deep Cleaning', slug: 'deep-cleaning' },
      { name: 'Move-In/Out', slug: 'move-in-out-cleaning' },
      { name: 'Sofa Cleaning', slug: 'sofa-cleaning' },
      { name: 'Carpet Cleaning', slug: 'carpet-cleaning' },
      { name: 'Mattress Cleaning', slug: 'mattress-cleaning' },
    ],
  },
  {
    icon: Wind,
    name: 'AC Services',
    slug: 'ac-services',
    desc: 'Split AC servicing, coil deep cleaning, duct sanitization, emergency repair, and new unit installation for Dubai homes',
    price: 120,
    unit: '/unit',
    subs: [
      { name: 'AC Service', slug: 'ac-general-service' },
      { name: 'AC Deep Clean', slug: 'ac-deep-cleaning' },
      { name: 'Duct Cleaning', slug: 'ac-duct-cleaning' },
      { name: 'AC Repair', slug: 'ac-repair' },
      { name: 'AC Installation', slug: 'ac-installation' },
    ],
  },
  {
    icon: Bug,
    name: 'Pest Control',
    slug: 'pest-control',
    desc: 'Dubai Municipality-approved treatments for cockroaches, bed bugs, termites, rodents, and general pests in apartments & villas',
    price: 220,
    unit: '',
    subs: [
      { name: 'General Pest', slug: 'general-pest-control' },
      { name: 'Bed Bugs', slug: 'bed-bug-treatment' },
      { name: 'Cockroach Gel', slug: 'cockroach-treatment' },
      { name: 'Termite', slug: 'termite-treatment' },
      { name: 'Rodent Control', slug: 'rodent-control' },
    ],
  },
  {
    icon: Droplets,
    name: 'Plumbing',
    slug: 'plumbing',
    desc: 'Leak repair, drain unblocking, water heater installation, tank cleaning, and 24/7 emergency plumbing across Dubai',
    price: 150,
    unit: '/hr',
    subs: [
      { name: 'Standard Plumbing', slug: 'plumbing-repair' },
      { name: 'Drain Unblocking', slug: 'drain-unblocking' },
      { name: 'Water Heater', slug: 'water-heater-installation' },
      { name: 'Water Tank', slug: 'water-tank-cleaning' },
      { name: 'TV Mounting & Handyman', slug: 'tv-mounting' },
    ],
  },
  {
    icon: Plug,
    name: 'Electrical',
    slug: 'electrical',
    desc: 'Socket repair, wiring fixes, smart home setup, CCTV installation, and emergency electrical services for Dubai properties',
    price: 150,
    unit: '/hr',
    subs: [
      { name: 'Standard Electrical', slug: 'electrical-repair' },
      { name: 'Circuit Breaker Repair', slug: 'circuit-breaker-repair' },
      { name: 'Appliance Repair', slug: 'water-heater-repair' },
      { name: 'Smart Home', slug: 'smart-home-setup' },
      { name: 'CCTV Install', slug: 'cctv-installation' },
    ],
  },
  {
    icon: Paintbrush,
    name: 'Painting & Fit-Out',
    slug: 'painting',
    desc: 'Apartment painting, villa exterior coating, wallpaper installation, kitchen renovation, bathroom remodeling, and custom fit-out',
    price: 700,
    unit: '',
    subs: [
      { name: 'Interior Painting', slug: 'interior-painting' },
      { name: 'Villa Exterior', slug: 'villa-exterior-painting' },
      { name: 'Wallpaper', slug: 'wallpaper-installation' },
      { name: 'Bathroom Reno', slug: 'bathroom-renovation' },
      { name: 'Flooring', slug: 'flooring-installation' },
    ],
  },
];

// TODO-REVIEW: Trust badge stats (review count, area count) are hardcoded.
// Consider fetching these from the database or a config to keep them accurate.
const trustBadges = [
  { icon: Shield, label: 'DM Licensed & Insured' },
  { icon: Clock, label: '72-Hour Redo Guarantee' },
  { icon: Star, label: '4.8\u2605 from 2,000+ Reviews' },
  { icon: MapPin, label: '40+ Dubai Areas' },
  { icon: Zap, label: 'Same-Day Booking' },
];

const steps = [
  {
    number: '01',
    title: 'Choose Service',
    desc: 'Browse our catalog and select the service you need',
    icon: Wrench,
  },
  {
    number: '02',
    title: 'Configure & Schedule',
    desc: 'Pick your property size, add extras, choose date & time',
    icon: Calendar,
  },
  {
    number: '03',
    title: 'Confirm & Pay',
    desc: 'Review your order and pay securely online or cash',
    icon: CheckCircle2,
  },
  {
    number: '04',
    title: 'We Come to You',
    desc: 'Our vetted technician arrives on time, every time',
    icon: Users,
  },
];

const areas = [
  'Dubai Marina',
  'JBR',
  'Palm Jumeirah',
  'Downtown Dubai',
  'Business Bay',
  'DIFC',
  'JLT',
  'Dubai Hills',
  'Arabian Ranches',
  'Jumeirah',
  'Al Barsha',
  'Mirdif',
];

const testimonials = [
  {
    name: 'Sarah M.',
    area: 'Dubai Marina',
    rating: 5,
    text: 'We moved into a new apartment in Marina Gate and needed a full deep clean before unpacking. The team arrived on time, brought all their own supplies, and the place was spotless in 4 hours. Already booked them for monthly cleaning.',
  },
  {
    name: 'Ahmed K.',
    area: 'Downtown Dubai',
    rating: 5,
    text: 'Had 4 AC units serviced in our Burj Vista apartment. The technician was thorough \u2014 cleaned the filters, coils, and checked the drainage. Our electricity bill dropped noticeably the following month.',
  },
  {
    name: 'Marina R.',
    area: 'Palm Jumeirah',
    rating: 5,
    text: 'Managing a villa in Palm Jumeirah remotely was a headache until we got the Total Care Plan. Now everything from AC servicing to pool maintenance is handled without me having to coordinate anything.',
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative px-4 py-20 text-primary-foreground md:py-32 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-primary" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1920&q=50')] bg-cover bg-center opacity-10" />
        <div className="relative container mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <h1 className="mb-6 text-4xl font-bold leading-tight md:text-6xl">
              {siteConfig.tagline}
            </h1>
            <p className="mb-8 text-lg text-primary-foreground/80 md:text-xl">
              Dubai&apos;s trusted home services platform. From deep cleaning to
              AC maintenance, pest control to plumbing &mdash; book vetted
              professionals online in 60 seconds.
            </p>
            <div className="mb-8">
              <SearchBar />
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                href="/book"
                className="inline-flex items-center justify-center rounded-lg bg-accent px-8 py-3 text-lg font-semibold text-accent-foreground transition-colors hover:bg-accent/90"
              >
                Book a Service
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="/home-services"
                className="inline-flex items-center justify-center rounded-lg border border-primary-foreground/30 px-8 py-3 text-lg font-semibold transition-colors hover:bg-primary-foreground/10"
              >
                View All Services
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="border-b border-border bg-muted py-4">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
            {trustBadges.map((badge) => (
              <div key={badge.label} className="flex items-center gap-2">
                <badge.icon className="h-5 w-5 text-accent" />
                <span className="text-sm font-medium text-foreground">
                  {badge.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="px-4 py-16 md:py-24">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
              Home Services in Dubai
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              From routine apartment cleaning to villa maintenance &mdash; 53
              professional services delivered by licensed technicians across
              Dubai.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <div
                key={service.slug}
                className="rounded-xl border border-border bg-card p-6 transition-all hover:border-accent hover:shadow-lg"
              >
                <Link href={`/home-services/${service.slug}`}>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                    <service.icon className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-card-foreground hover:text-accent">
                    {service.name}
                  </h3>
                  <p className="mb-3 text-sm text-muted-foreground">
                    {service.desc}
                  </p>
                  <p className="mb-4 text-sm font-semibold text-accent">
                    From AED {service.price}
                    {service.unit}
                  </p>
                </Link>
                <div className="border-t border-border pt-3">
                  <div className="flex flex-wrap gap-x-3 gap-y-1">
                    {service.subs.map((sub) => (
                      <Link
                        key={sub.slug}
                        href={`/home-services/${service.slug}/${sub.slug}`}
                        className="text-xs text-muted-foreground transition-colors hover:text-accent"
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-muted px-4 py-16 md:py-24">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
              Book Home Services in 4 Easy Steps
            </h2>
            <p className="text-muted-foreground">
              Book your service in 4 simple steps
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => (
              <div key={step.number} className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent text-2xl font-bold text-accent-foreground">
                  {step.number}
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Care Plan Teaser */}
      <section className="px-4 py-16 md:py-24">
        <div className="container mx-auto max-w-7xl">
          <div className="rounded-2xl bg-primary p-8 text-primary-foreground md:p-12">
            <div className="grid items-center gap-8 md:grid-cols-2">
              <div>
                <h2 className="mb-4 text-3xl font-bold md:text-4xl">
                  Save Up to 40% with a Care Plan
                </h2>
                <p className="mb-6 text-primary-foreground/80">
                  Get priority service, dedicated support, and bundled
                  maintenance for your property. 4 plans from AED 79/month.
                </p>
                <Link
                  href="/care-plans"
                  className="inline-flex items-center rounded-lg bg-accent px-6 py-3 font-semibold text-accent-foreground transition-colors hover:bg-accent/90"
                >
                  View Care Plans
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { tier: 'Essential', price: '79' },
                  { tier: 'Standard', price: '149' },
                  { tier: 'Premium', price: '249' },
                  { tier: 'VIP', price: '449' },
                ].map((plan) => (
                  <div
                    key={plan.tier}
                    className="rounded-lg bg-primary-foreground/10 p-4 text-center"
                  >
                    <p className="text-sm font-medium text-primary-foreground/70">
                      {plan.tier}
                    </p>
                    <p className="text-2xl font-bold">AED {plan.price}</p>
                    <p className="text-xs text-primary-foreground/60">/month</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-muted px-4 py-16 md:py-24">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
              What Our Customers Say
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="rounded-xl border border-border bg-card p-6 transition-all hover:border-accent hover:shadow-lg"
              >
                <div className="mb-4 flex gap-1">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="mb-4 text-sm text-card-foreground">{t.text}</p>
                <div className="text-sm">
                  <p className="font-semibold text-foreground">{t.name}</p>
                  <p className="text-muted-foreground">{t.area}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Area Tags */}
      <section className="px-4 py-16 md:py-24">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-8 text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
              Serving 40+ Neighborhoods Across Dubai
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Select your area to see available services, local pricing, and
              same-day availability.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {areas.map((area) => (
              <Link
                key={area}
                href={`/areas/${area.toLowerCase().replace(/\s+/g, '-')}`}
                className="rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-accent hover:bg-accent/10 hover:text-accent"
              >
                {area}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-accent px-4 py-16 text-accent-foreground">
        <div className="container mx-auto max-w-7xl text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Your Home Deserves Better Care
          </h2>
          <p className="mb-8 text-lg text-accent-foreground/80">
            Join thousands of Dubai residents who trust {siteConfig.name} for
            their home maintenance. First booking? Use code WELCOME20 for 20%
            off.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/book"
              className="rounded-lg bg-primary px-8 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Book Now
            </Link>
            <a
              href={`https://wa.me/${siteConfig.whatsapp.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-lg border border-accent-foreground/30 px-8 py-3 font-semibold transition-colors hover:bg-accent-foreground/10"
            >
              <Phone className="mr-2 h-5 w-5" />
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
