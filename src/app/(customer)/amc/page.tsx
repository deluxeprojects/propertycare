import Link from 'next/link';
import { siteConfig } from '@/config/site';
import { Check, X, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Annual Maintenance Contracts',
  description: `Save up to 40% with ${siteConfig.name} AMC plans. 4 tiers from AED 79/month. Priority service, dedicated support.`,
};

const plans = [
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
    cta: 'Get Essential',
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
    cta: 'Get Standard',
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
    cta: 'Get Premium',
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
    cta: 'Get VIP',
    popular: false,
  },
];

export default function AmcPage() {
  return (
    <div className="px-4 py-12 md:py-16">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
            Annual Maintenance Contracts
          </h1>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Save up to 40% on your home maintenance with a {siteConfig.name}{' '}
            AMC. Choose a plan that fits your property and enjoy priority
            service year-round.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-4">
          {plans.map((plan) => (
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
                <h2 className="text-xl font-bold text-foreground">
                  {plan.tier}
                </h2>
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
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-xl bg-muted p-8 text-center">
          <h3 className="mb-2 text-lg font-semibold text-foreground">
            Not sure which plan is right for you?
          </h3>
          <p className="mb-4 text-muted-foreground">
            Our team can help you choose the perfect plan for your property.
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
