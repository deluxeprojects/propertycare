import Link from 'next/link';
import { notFound } from 'next/navigation';
import { siteConfig } from '@/config/site';
import { createAdminClient } from '@/lib/supabase/admin';
import { ArrowRight, Star, Shield, Clock, CheckCircle2 } from 'lucide-react';

interface Props {
  params: Promise<{ area: string; angle: string }>;
}

const angleTemplates: Record<string, { title: (area: string) => string; intro: (area: string, company: string) => string }> = {
  'best-for-families': {
    title: (area) => `Best Home Services for Families in ${area}`,
    intro: (area, company) => `Families in ${area} need reliable, safe, and thorough home services. From child-safe cleaning products to pet-friendly pest control, here are the top services ${company} offers for family homes in ${area}, Dubai.`,
  },
  'best-for-large-apartments': {
    title: (area) => `Best Services for Large Apartments in ${area}`,
    intro: (area, company) => `Large apartments in ${area} require specialized care — deeper cleaning, more AC units to service, and comprehensive pest prevention. ${company} offers tailored packages for 3BR+ apartments in ${area}.`,
  },
  'most-affordable': {
    title: (area) => `Most Affordable Home Services in ${area}`,
    intro: (area, company) => `Quality home services in ${area} don't have to break the bank. ${company} offers competitive pricing across all services, with transparent rates and no hidden fees. Here's how to get the best value.`,
  },
  'premium-packages': {
    title: (area) => `Premium Home Service Packages in ${area}`,
    intro: (area, company) => `For ${area} residents who want the best, ${company} offers premium service packages with dedicated technicians, priority scheduling, and extended warranties. White-glove service for discerning homeowners.`,
  },
  'for-villas': {
    title: (area) => `Home Services for Villas in ${area}`,
    intro: (area, company) => `Villa maintenance in ${area} goes beyond apartments — pool care, garden maintenance, external pest control, and larger-scale deep cleaning. ${company} specializes in comprehensive villa care packages.`,
  },
  'for-high-rises': {
    title: (area) => `Services for High-Rise Residents in ${area}`,
    intro: (area, company) => `High-rise living in ${area} comes with unique maintenance needs — AC systems work harder at elevation, window cleaning requires specialized equipment, and building access coordination matters. ${company} knows how to handle it.`,
  },
  'top-rated': {
    title: (area) => `Top-Rated Home Service Providers in ${area}`,
    intro: (area, company) => `With a 4.8-star average across 2,000+ reviews, ${company} is one of the highest-rated home service providers in ${area}. Here's what our customers love about our service quality, reliability, and professionalism.`,
  },
  'same-day': {
    title: (area) => `Same-Day Home Services in ${area}`,
    intro: (area, company) => `Need a service today in ${area}? ${company} offers same-day booking on select services with express availability. AC breakdown, plumbing emergency, or urgent cleaning — we can be there within hours.`,
  },
  'annual-plans': {
    title: (area) => `Annual Care Plans in ${area}`,
    intro: (area, company) => `${area} residents can save up to 40% on home maintenance with a ${company} Care Plan. Annual contracts for AC, cleaning, pest control, and more — with priority scheduling and dedicated support.`,
  },
};

const validAngles = Object.keys(angleTemplates);

export async function generateMetadata({ params }: Props) {
  const { area: areaSlug, angle } = await params;
  if (!validAngles.includes(angle)) return { title: 'Guide' };

  const supabase = createAdminClient();
  const { data: area } = await supabase.from('areas').select('name_en').eq('slug', areaSlug).single();
  if (!area) return { title: 'Guide' };

  const template = angleTemplates[angle];
  if (!template) return { title: 'Guide' };

  const title = template.title(area.name_en);
  return {
    title,
    description: `${title}. Expert-curated guide with pricing, ratings, and booking links. By ${siteConfig.name}.`,
    alternates: {
      canonical: `https://${siteConfig.domain}/guides/${areaSlug}/${angle}`,
    },
  };
}

export default async function GuidePage({ params }: Props) {
  const { area: areaSlug, angle } = await params;
  const template = angleTemplates[angle];
  if (!template) notFound();

  const supabase = createAdminClient();
  const { data: area } = await supabase.from('areas').select('*').eq('slug', areaSlug).eq('is_active', true).single();
  if (!area) notFound();

  const { data: services } = await supabase
    .from('services')
    .select('id, slug, name_en, short_desc_en, base_price_aed, price_unit, is_express_available, service_categories(slug, name_en)')
    .eq('is_active', true)
    .eq('is_hidden', false)
    .order('sort_order')
    .limit(10);

  const title = template.title(area.name_en);
  const intro = template.intro(area.name_en, siteConfig.name);

  return (
    <div className="px-4 py-12 md:py-16">
      <div className="container mx-auto max-w-4xl">
        <nav className="mb-6 text-sm text-muted-foreground">
          <Link href="/areas" className="hover:text-accent-text">Areas</Link>{' / '}
          <Link href={`/areas/${areaSlug}`} className="hover:text-accent-text">{area.name_en}</Link>{' / '}
          <span className="text-foreground">Guide</span>
        </nav>

        <article>
          <h1 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">{title}</h1>
          <div className="mb-2 flex items-center gap-3 text-sm text-muted-foreground">
            <span>By {siteConfig.name} Team</span>
            <span>·</span>
            <span>Updated {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
          </div>

          <p className="mb-8 text-lg text-muted-foreground leading-relaxed">{intro}</p>

          {/* Quick stats */}
          <div className="mb-8 grid grid-cols-3 gap-4">
            {[
              { icon: Star, value: '4.8★', label: 'Average rating' },
              { icon: Shield, value: '53+', label: 'Services available' },
              { icon: Clock, value: 'Same day', label: 'Express booking' },
            ].map((stat) => (
              <div key={stat.label} className="rounded-lg border border-border bg-card p-4 text-center">
                <stat.icon className="mx-auto mb-2 h-5 w-5 text-accent-text" />
                <p className="text-lg font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Service recommendations */}
          <h2 className="mb-4 text-2xl font-semibold text-foreground">Recommended Services in {area.name_en}</h2>
          <div className="mb-8 space-y-4">
            {(services ?? []).map((s, i) => {
              const catName = (s.service_categories as unknown as { name_en: string } | null)?.name_en ?? '';
              return (
                <div key={s.id} className="rounded-xl border border-border bg-card p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="mb-1 flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground">{i + 1}</span>
                        <h3 className="text-lg font-semibold text-foreground">{s.name_en}</h3>
                      </div>
                      <p className="mb-2 text-sm text-muted-foreground">{s.short_desc_en}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="rounded-full bg-muted px-2 py-0.5">{catName}</span>
                        {s.is_express_available && <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-yellow-800">Same-day available</span>}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-foreground">AED {s.base_price_aed}</p>
                      <Link href={`/areas/${areaSlug}/${s.slug}`} className="mt-1 inline-flex items-center text-xs font-medium text-accent-text hover:underline">
                        Book now <ArrowRight className="ml-1 h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Why choose ProKeep */}
          <h2 className="mb-4 text-2xl font-semibold text-foreground">Why {area.name_en} Residents Choose {siteConfig.name}</h2>
          <ul className="mb-8 space-y-2">
            {[
              `Licensed by Dubai Municipality — every technician is verified and insured`,
              `Transparent pricing — see exact costs before you book, no surprises`,
              `72-hour redo guarantee — not satisfied? We come back and fix it free`,
              `Same-day availability — express booking for urgent needs`,
              `Dedicated ${area.name_en} coverage — technicians who know your area`,
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-foreground">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                {item}
              </li>
            ))}
          </ul>

          {/* Other guides */}
          <h2 className="mb-4 text-xl font-semibold text-foreground">More Guides for {area.name_en}</h2>
          <div className="mb-8 flex flex-wrap gap-2">
            {validAngles.filter(a => a !== angle).map((a) => (
              <Link
                key={a}
                href={`/guides/${areaSlug}/${a}`}
                className="rounded-full border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-accent hover:text-accent-text"
              >
                {angleTemplates[a]?.title(area.name_en).replace(` in ${area.name_en}`, '')}
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="rounded-xl bg-accent p-8 text-center text-accent-foreground">
            <h3 className="mb-2 text-xl font-bold">Ready to Book in {area.name_en}?</h3>
            <p className="mb-4 text-sm text-accent-foreground/80">Join thousands of {area.name_en} residents who trust {siteConfig.name}</p>
            <Link href="/book" className="inline-flex items-center rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90">
              Book Now <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </article>
      </div>
    </div>
  );
}
