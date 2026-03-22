import Link from 'next/link';
import { siteConfig } from '@/config/site';
import { Shield, Camera, Droplets, Wind, Flower2, Key, Bell, ClipboardCheck, ArrowRight, Check } from 'lucide-react';

export const metadata = {
  title: 'Property Guardian — Home Watch for Absentee Owners',
  description: `Keep your Dubai property safe while you\'re away. ${siteConfig.name} Property Guardian offers regular inspections, maintenance coordination, and photo reports. From AED 300/month.`,
};

const plans = [
  {
    name: 'Basic Watch',
    price: 300,
    visits: '2 visits/month',
    desc: 'Peace of mind for properties left unoccupied',
    features: [
      'Visual inspection of all rooms',
      'Run taps & flush toilets to prevent dry traps',
      'Check for leaks, pests, and mold',
      'Photo report after every visit',
      'Emergency alert if issues found',
    ],
    ideal: 'Owners traveling 1-3 months',
  },
  {
    name: 'Standard Care',
    price: 600,
    visits: '4 visits/month',
    desc: 'Active care for your property while you are away',
    features: [
      'Everything in Basic Watch',
      'Light dusting & surface cleaning',
      'Collect mail & packages',
      'Water plants',
      'Run AC for 30 minutes each visit',
      'Check all appliances',
      'Monthly condition report',
    ],
    ideal: 'Owners away for extended periods',
    popular: true,
  },
  {
    name: 'Premium Care',
    price: 1200,
    visits: '8 visits/month',
    desc: 'Full property management for hands-off owners',
    features: [
      'Everything in Standard Care',
      'Full cleaning twice per month',
      'Garden & pool maintenance weekly',
      'Coordinate any needed repairs',
      'Grocery stocking before your return',
      'Pre-arrival deep clean & linen change',
      'Semi-annual property condition report',
    ],
    ideal: 'Villa owners or long-term absentees',
  },
  {
    name: 'Villa Guardian',
    price: 2500,
    visits: 'Daily / on-demand',
    desc: 'White-glove property management for luxury villas',
    features: [
      'Everything in Premium Care',
      'Pool maintenance 3x per week',
      'Full garden care & landscaping',
      'Pest prevention program',
      'Storm & weather preparation',
      'Security system monitoring coordination',
      'Pre-arrival deep clean, linen, flowers',
      'Dedicated property manager',
      'Quarterly detailed property report with photos',
    ],
    ideal: 'Large villas & luxury properties',
  },
];

const useCases = [
  { icon: Key, title: 'Traveling for Business', desc: 'Your property is checked, aired, and maintained while you work abroad. Come back to a clean, fresh home.' },
  { icon: Camera, title: 'Holiday Home Owners', desc: 'Keep your Dubai holiday home ready for your next visit. No more arriving to a dusty, stale apartment.' },
  { icon: Bell, title: 'Airbnb & Short-Term Rental', desc: 'We handle turnover cleaning, linen changes, guest-readiness checks, and welcome pack setup between guests.' },
  { icon: Shield, title: 'Investors & Landlords', desc: 'Protect your investment. Regular inspections catch problems early — leaks, pests, AC failures — before they become expensive repairs.' },
];

export default function GuardianPage() {
  return (
    <div className="px-4 py-12 md:py-16">
      <div className="container mx-auto max-w-7xl">
        {/* Breadcrumbs */}
        <nav className="mb-6 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-accent">Home</Link>{' / '}
          <Link href="/home-services" className="hover:text-accent">Home Services</Link>{' / '}
          <span className="text-foreground">Property Guardian</span>
        </nav>

        {/* Hero */}
        <div className="mb-16 text-center">
          <div className="mb-4 inline-flex items-center rounded-full bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent">
            <Shield className="mr-2 h-4 w-4" /> Property Guardian
          </div>
          <h1 className="mb-4 text-3xl font-bold text-foreground md:text-5xl">
            Your Property, Watched Over
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Leaving Dubai? Your property still needs care. {siteConfig.name} Property Guardian keeps your home inspected, maintained, and ready — so you never return to surprises.
          </p>
        </div>

        {/* Use Cases */}
        <div className="mb-16">
          <h2 className="mb-8 text-center text-2xl font-semibold text-foreground">Who Needs Property Guardian?</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {useCases.map((uc) => (
              <div key={uc.title} className="rounded-xl border border-border bg-card p-5">
                <uc.icon className="mb-3 h-8 w-8 text-accent" />
                <h3 className="mb-2 font-semibold text-foreground">{uc.title}</h3>
                <p className="text-sm text-muted-foreground">{uc.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Plans */}
        <div className="mb-16">
          <h2 className="mb-8 text-center text-2xl font-semibold text-foreground">Choose Your Level of Care</h2>
          <div className="grid gap-6 lg:grid-cols-4">
            {plans.map((plan) => (
              <div key={plan.name} className={`relative rounded-xl border bg-card p-6 ${plan.popular ? 'border-accent shadow-lg shadow-accent/10' : 'border-border'}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
                    Most Popular
                  </div>
                )}
                <h3 className="text-lg font-bold text-foreground">{plan.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{plan.desc}</p>
                <div className="my-4">
                  <span className="text-3xl font-bold text-foreground">AED {plan.price}</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <p className="mb-4 text-xs font-medium text-accent">{plan.visits}</p>
                <ul className="mb-6 space-y-2">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-foreground">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-green-600" />
                      {f}
                    </li>
                  ))}
                </ul>
                <p className="mb-4 text-xs text-muted-foreground">Ideal for: {plan.ideal}</p>
                <Link
                  href="/book"
                  className={`block w-full rounded-lg py-2.5 text-center text-sm font-semibold ${
                    plan.popular
                      ? 'bg-accent text-accent-foreground hover:bg-accent/90'
                      : 'border border-border text-foreground hover:bg-muted'
                  }`}
                >
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* How it works */}
        <div className="mb-16">
          <h2 className="mb-8 text-center text-2xl font-semibold text-foreground">How Property Guardian Works</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { step: '01', title: 'Sign Up & Share Access', desc: 'Choose your plan, share a key or access card with us. We handle the rest.' },
              { step: '02', title: 'Regular Visits & Reports', desc: 'Our team visits your property on schedule. After each visit, you receive a detailed photo report via WhatsApp and email.' },
              { step: '03', title: 'Issues Handled Proactively', desc: 'If we spot anything — a leak, pest signs, AC issue — we alert you immediately and coordinate the fix.' },
            ].map((s) => (
              <div key={s.step} className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent text-lg font-bold text-accent-foreground">
                  {s.step}
                </div>
                <h3 className="mb-2 font-semibold text-foreground">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="rounded-xl bg-primary p-8 text-center text-primary-foreground md:p-12">
          <h2 className="mb-4 text-2xl font-bold md:text-3xl">Don&apos;t Leave Your Property Unattended</h2>
          <p className="mb-6 text-primary-foreground/80">Starting from AED 300/month. Cancel anytime.</p>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link href="/book" className="rounded-lg bg-accent px-8 py-3 font-semibold text-accent-foreground hover:bg-accent/90">
              Get Started <ArrowRight className="ml-2 inline h-4 w-4" />
            </Link>
            <a href={`https://wa.me/${siteConfig.whatsapp.replace(/[^0-9]/g, '')}`} className="rounded-lg border border-primary-foreground/30 px-8 py-3 font-semibold hover:bg-primary-foreground/10">
              WhatsApp Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
