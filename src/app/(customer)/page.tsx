import Link from 'next/link';
import { siteConfig } from '@/config/site';
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

const services = [
  {
    icon: Sparkles,
    name: 'Cleaning',
    slug: 'cleaning',
    desc: 'Professional cleaning for homes, offices, and move-in/out',
    price: 38,
    unit: '/hr',
    subs: [
      { name: 'Regular Cleaning', slug: 'regular-home-cleaning' },
      { name: 'Deep Cleaning', slug: 'deep-cleaning' },
      { name: 'Move-In/Out', slug: 'move-in-out-cleaning' },
      { name: 'Sofa Cleaning', slug: 'sofa-upholstery-cleaning' },
      { name: 'Carpet Cleaning', slug: 'carpet-cleaning' },
      { name: 'Window Cleaning', slug: 'window-cleaning' },
    ],
  },
  {
    icon: Wind,
    name: 'AC Services',
    slug: 'ac-services',
    desc: 'Complete AC care from routine servicing to full installation',
    price: 120,
    unit: '/unit',
    subs: [
      { name: 'AC Service', slug: 'ac-service' },
      { name: 'AC Deep Clean', slug: 'ac-deep-clean' },
      { name: 'Duct Cleaning', slug: 'ac-duct-cleaning' },
      { name: 'AC Repair', slug: 'ac-repair' },
      { name: 'AC Installation', slug: 'ac-installation' },
    ],
  },
  {
    icon: Bug,
    name: 'Pest Control',
    slug: 'pest-control',
    desc: 'Municipality-approved pest management for all property types',
    price: 220,
    unit: '',
    subs: [
      { name: 'General Pest', slug: 'general-pest-control' },
      { name: 'Bed Bugs', slug: 'bed-bug-treatment' },
      { name: 'Cockroach Gel', slug: 'cockroach-gel-treatment' },
      { name: 'Termite', slug: 'termite-treatment' },
      { name: 'Rodent Control', slug: 'rodent-control' },
    ],
  },
  {
    icon: Droplets,
    name: 'Plumbing',
    slug: 'plumbing',
    desc: 'Standard and emergency plumbing for any issue',
    price: 150,
    unit: '/hr',
    subs: [
      { name: 'Standard Plumbing', slug: 'plumbing-standard' },
      { name: 'Emergency Plumbing', slug: 'plumbing-emergency' },
      { name: 'Water Heater', slug: 'water-heater-install' },
      { name: 'Water Tank', slug: 'water-tank-cleaning' },
      { name: 'Handyman', slug: 'handyman-general' },
    ],
  },
  {
    icon: Plug,
    name: 'Electrical',
    slug: 'electrical',
    desc: 'Electrical repair, installation, and smart home setup',
    price: 150,
    unit: '/hr',
    subs: [
      { name: 'Standard Electrical', slug: 'electrical-standard' },
      { name: 'Emergency Electrical', slug: 'electrical-emergency' },
      { name: 'Appliance Repair', slug: 'appliance-repair' },
      { name: 'Smart Home', slug: 'smart-home-setup' },
      { name: 'CCTV Install', slug: 'cctv-installation' },
    ],
  },
  {
    icon: Paintbrush,
    name: 'Painting & Fit-Out',
    slug: 'painting',
    desc: 'Interior painting, renovation, and custom fit-out',
    price: 700,
    unit: '',
    subs: [
      { name: 'Painting', slug: 'painting-studio' },
      { name: 'Wallpaper', slug: 'wallpaper-install' },
      { name: 'Kitchen Reno', slug: 'kitchen-renovation' },
      { name: 'Bathroom Reno', slug: 'bathroom-renovation' },
      { name: 'Flooring', slug: 'flooring-install' },
    ],
  },
];

const trustBadges = [
  { icon: Shield, label: 'Licensed & Insured' },
  { icon: Clock, label: '72-Hour Guarantee' },
  { icon: Star, label: '4.8 Average Rating' },
  { icon: MapPin, label: '40+ Areas Covered' },
  { icon: Zap, label: 'Same-Day Available' },
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
  'Downtown Dubai',
  'JBR',
  'Palm Jumeirah',
  'Business Bay',
  'JLT',
  'DIFC',
  'Dubai Hills',
  'Arabian Ranches',
  'Sports City',
  'Motor City',
  'Silicon Oasis',
  'Al Barsha',
  'Jumeirah',
  'Mirdif',
  'Discovery Gardens',
  'International City',
  'Dubai Creek',
  'Deira',
  'Bur Dubai',
];

const testimonials = [
  {
    name: 'Sarah M.',
    area: 'Dubai Marina',
    rating: 5,
    text: 'Excellent deep cleaning service. The team was professional, thorough, and left my apartment spotless. Will definitely book again!',
  },
  {
    name: 'Ahmed K.',
    area: 'Downtown Dubai',
    rating: 5,
    text: 'Best AC service in Dubai. They cleaned all 4 units in my apartment and the difference in cooling is remarkable. Great value too.',
  },
  {
    name: 'Marina R.',
    area: 'Palm Jumeirah',
    rating: 5,
    text: 'The Care Plan has been a lifesaver. One call and everything gets handled. The dedicated coordinator really knows our villa.',
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-primary px-4 py-20 text-primary-foreground md:py-32">
        <div className="container mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <h1 className="mb-6 text-4xl font-bold leading-tight md:text-6xl">
              {siteConfig.tagline}
            </h1>
            <p className="mb-8 text-lg text-primary-foreground/80 md:text-xl">
              Professional cleaning, AC, pest control, plumbing, electrical &
              maintenance services across Dubai. Book online in 60 seconds.
            </p>
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
              Our Services
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              53+ professional services across 6 categories. All technicians are
              licensed, vetted, and insured.
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
              How It Works
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
                className="rounded-xl border border-border bg-card p-6"
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
              Serving 40+ Areas Across Dubai
            </h2>
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
            Ready to Get Started?
          </h2>
          <p className="mb-8 text-lg text-accent-foreground/80">
            Book your first service today and experience the {siteConfig.name}{' '}
            difference.
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
