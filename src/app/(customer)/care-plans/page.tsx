import Link from 'next/link';
import { siteConfig } from '@/config/site';
import {
  Check,
  X,
  ArrowRight,
  Wind,
  SprayCan,
  Bug,
  Home,
  Flower2,
  Waves,
  Crown,
} from 'lucide-react';

export const metadata = {
  title: 'Care Plans — Annual Home Service Contracts',
  description: 'Save up to 40% on home maintenance with ProKeep Care Plans. AC, cleaning, pest control, housekeeping & pool maintenance contracts for Dubai homes.',
};

/* ------------------------------------------------------------------ */
/*  New contract-type plans                                           */
/* ------------------------------------------------------------------ */

const contractPlans = [
  {
    name: 'AC Care Plan',
    icon: Wind,
    description: 'Annual AC service contract',
    details: [
      '2-4 services per year',
      'Duct cleaning included',
      'Filter replacement',
    ],
    price: 99,
    color: 'text-sky-500',
    bgColor: 'bg-sky-500/10',
  },
  {
    name: 'Cleaning Care Plan',
    icon: SprayCan,
    description: 'Regular scheduled cleaning',
    details: [
      'Weekly, biweekly, or monthly',
      'Flexible scheduling',
      'Trained & vetted cleaners',
    ],
    price: 149,
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500/10',
  },
  {
    name: 'Pest Care Plan',
    icon: Bug,
    description: 'Year-round pest prevention',
    details: [
      'Quarterly treatments',
      'Emergency callouts included',
      'Safe & certified products',
    ],
    price: 79,
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10',
  },
  {
    name: 'Housekeeping Care Plan',
    icon: Home,
    description:
      'Full housekeeping: cleaning + linen change + amenity restock',
    details: [
      'Ideal for holiday homes & Airbnb',
      'Linen & towel change',
      'Amenity restock',
    ],
    price: 299,
    color: 'text-violet-500',
    bgColor: 'bg-violet-500/10',
  },
  {
    name: 'Garden Care Plan',
    icon: Flower2,
    description: 'Villa garden maintenance',
    details: [
      'Weekly or biweekly visits',
      'Plant care & pruning',
      'Landscaping support',
    ],
    price: 199,
    color: 'text-green-600',
    bgColor: 'bg-green-600/10',
  },
  {
    name: 'Pool Care Plan',
    icon: Waves,
    description: 'Swimming pool maintenance',
    details: [
      'Chemical balancing',
      'Pool cleaning',
      'Equipment checks',
    ],
    price: 249,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
  {
    name: 'Total Care Plan',
    icon: Crown,
    description:
      'Everything bundled: AC + cleaning + pest + handyman + priority support',
    details: [
      'The ultimate plan',
      'All services included',
      'Priority support & response',
    ],
    price: 449,
    color: 'text-accent',
    bgColor: 'bg-accent/10',
    highlighted: true,
  },
];

/* ------------------------------------------------------------------ */
/*  Legacy bundled tiers (kept as secondary option)                    */
/* ------------------------------------------------------------------ */

const bundledTiers = [
  {
    tier: 'Essential',
    price: 79,
    desc: 'Basic coverage for routine maintenance',
    features: [
      { label: '2 AC services/year', included: true },
      { label: '2 plumbing callouts/year', included: true },
      { label: '2 electrical callouts/year', included: true },
      { label: '2 handyman hours/year', included: true },
      { label: 'Pest control', included: false },
      { label: 'Deep cleaning', included: false },
      { label: '24h response SLA', included: true },
      { label: '5% discount on extras', included: true },
    ],
    cta: 'Get Essential Plan',
    popular: false,
  },
  {
    tier: 'Standard',
    price: 149,
    desc: 'Comprehensive coverage for most properties',
    features: [
      { label: '4 AC services/year', included: true },
      { label: '4 plumbing callouts/year', included: true },
      { label: '4 electrical callouts/year', included: true },
      { label: '4 handyman hours/year', included: true },
      { label: '1 pest control/year', included: true },
      { label: 'Deep cleaning', included: false },
      { label: '8h response SLA', included: true },
      { label: '10% discount on extras', included: true },
    ],
    cta: 'Get Standard Plan',
    popular: true,
  },
  {
    tier: 'Premium',
    price: 249,
    desc: 'Full coverage with priority support',
    features: [
      { label: '4 AC + duct clean/year', included: true },
      { label: '6 plumbing callouts/year', included: true },
      { label: '6 electrical callouts/year', included: true },
      { label: '8 handyman hours/year', included: true },
      { label: '2 pest controls/year', included: true },
      { label: '1 deep cleaning/year', included: true },
      { label: '4h response SLA', included: true },
      { label: '15% discount on extras', included: true },
    ],
    cta: 'Get Premium Plan',
    popular: false,
  },
  {
    tier: 'VIP',
    price: 449,
    desc: 'White-glove service for luxury properties',
    features: [
      { label: '4 AC + duct + deep/year', included: true },
      { label: 'Unlimited plumbing', included: true },
      { label: 'Unlimited electrical', included: true },
      { label: '12 handyman hours/year', included: true },
      { label: '4 pest controls/year', included: true },
      { label: '2 deep cleanings/year', included: true },
      { label: '2h guaranteed response', included: true },
      { label: '20% discount on extras', included: true },
    ],
    cta: 'Get VIP Plan',
    popular: false,
  },
];

/* ------------------------------------------------------------------ */
/*  Page component                                                    */
/* ------------------------------------------------------------------ */

export default function CarePlansPage() {
  return (
    <div className="px-4 py-12 md:py-16">
      <div className="container mx-auto max-w-7xl">
        <nav className="mb-6 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-accent">Home</Link>{' / '}
          <span className="text-foreground">Care Plans</span>
        </nav>
        {/* Hero */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
            Care Plans
          </h1>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Stop overpaying for one-off services. A {siteConfig.name} Care Plan
            locks in lower rates for AC maintenance, cleaning, pest control,
            and more — with priority scheduling and a dedicated service team.
            Pick individual plans or bundle everything with Total Care and save
            up to 40%.
          </p>
        </div>

        {/* ---- Contract-type plans ---- */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {contractPlans.map((plan) => {
            const Icon = plan.icon;
            return (
              <div
                key={plan.name}
                className={`relative flex flex-col rounded-xl border bg-card p-6 transition-shadow hover:shadow-md ${
                  plan.highlighted
                    ? 'border-accent shadow-lg shadow-accent/10'
                    : 'border-border'
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
                    Best Value
                  </div>
                )}

                <div className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg ${plan.bgColor}`}>
                  <Icon className={`h-5 w-5 ${plan.color}`} />
                </div>

                <h2 className="text-lg font-bold text-foreground">
                  {plan.name}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {plan.description}
                </p>

                <ul className="mt-4 flex-1 space-y-2">
                  {plan.details.map((detail) => (
                    <li
                      key={detail}
                      className="flex items-start gap-2 text-sm text-foreground"
                    >
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                      {detail}
                    </li>
                  ))}
                </ul>

                <div className="mt-6">
                  <div className="mb-4">
                    <span className="text-2xl font-bold text-foreground">
                      AED {plan.price}
                    </span>
                    <span className="text-muted-foreground">/mo</span>
                  </div>

                  <Link
                    href="/book"
                    className={`inline-flex w-full items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors ${
                      plan.highlighted
                        ? 'bg-accent text-accent-foreground hover:bg-accent/90'
                        : 'border border-border bg-card text-foreground hover:bg-muted'
                    }`}
                  >
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                  <a
                    href={`https://wa.me/${siteConfig.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hi, I am interested in the ' + plan.name + ' Care Plan.')}`}
                    className="mt-2 inline-flex w-full items-center justify-center rounded-lg border border-border px-4 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Or WhatsApp Us
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* ---- Divider ---- */}
        <div className="my-16 flex items-center gap-4">
          <div className="h-px flex-1 bg-border" />
          <span className="text-sm font-medium text-muted-foreground">or</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        {/* ---- Bundled tiers (legacy) ---- */}
        <div className="mb-8 text-center">
          <h2 className="mb-2 text-2xl font-bold text-foreground md:text-3xl">
            Or choose a bundled tier
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Prefer a pre-built package? Our bundled tiers combine multiple
            services at a discounted rate — perfect if you want comprehensive
            cover without picking individual plans.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-4">
          {bundledTiers.map((plan) => (
            <div
              key={plan.tier}
              className={`relative rounded-xl border bg-card p-6 ${
                plan.popular
                  ? 'border-accent shadow-lg shadow-accent/10'
                  : 'border-border'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
                  Most Popular
                </div>
              )}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-foreground">
                  {plan.tier}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {plan.desc}
                </p>
                <div className="mt-4">
                  <span className="text-3xl font-bold text-foreground">
                    AED {plan.price}
                  </span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  For a studio apartment. Prices vary by size.
                </p>
              </div>

              <ul className="mb-6 space-y-3">
                {plan.features.map((f) => (
                  <li key={f.label} className="flex items-start gap-2 text-sm">
                    {f.included ? (
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                    ) : (
                      <X className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground/40" />
                    )}
                    <span
                      className={
                        f.included
                          ? 'text-foreground'
                          : 'text-muted-foreground/40'
                      }
                    >
                      {f.label}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                href="/book"
                className={`inline-flex w-full items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors ${
                  plan.popular
                    ? 'bg-accent text-accent-foreground hover:bg-accent/90'
                    : 'border border-border bg-card text-foreground hover:bg-muted'
                }`}
              >
                {plan.cta}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <a
                href={`https://wa.me/${siteConfig.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hi, I am interested in the ' + plan.tier + ' Care Plan.')}`}
                className="mt-2 inline-flex w-full items-center justify-center rounded-lg border border-border px-4 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted"
                target="_blank"
                rel="noopener noreferrer"
              >
                Or WhatsApp Us
              </a>
            </div>
          ))}
        </div>

        {/* ---- CTA footer ---- */}
        <div className="mt-12 rounded-xl bg-muted p-8 text-center">
          <h3 className="mb-2 text-lg font-semibold text-foreground">
            Not sure which care plan is right for you?
          </h3>
          <p className="mb-4 text-muted-foreground">
            Our team can help you choose the perfect care plan for your
            property.
          </p>
          <a
            href={`https://wa.me/${siteConfig.whatsapp.replace(/[^0-9]/g, '')}`}
            className="inline-flex items-center rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            Talk to Us on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
