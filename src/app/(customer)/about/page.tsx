import Link from 'next/link';
import { siteConfig } from '@/config/site';
import { Shield, Users, MapPin, Clock, Star, Award } from 'lucide-react';

export const metadata = {
  title: 'About Us',
  description: `Learn about ${siteConfig.name} — Dubai's trusted home services platform. Licensed, vetted professionals with a 72-hour satisfaction guarantee. Serving 40+ neighborhoods.`,
};

const stats = [
  { icon: Users, value: '5,000+', label: 'Dubai Homes Served' },
  { icon: MapPin, value: '40+', label: 'Neighborhoods Covered' },
  { icon: Star, value: '4.8', label: 'Average Customer Rating' },
  { icon: Clock, value: '15,000+', label: 'Jobs Completed' },
];

export default function AboutPage() {
  return (
    <div className="px-4 py-12 md:py-16">
      <div className="container mx-auto max-w-4xl">
        <nav className="mb-6 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-accent">Home</Link>{' / '}
          <span className="text-foreground">About</span>
        </nav>
        <h1 className="mb-6 text-3xl font-bold text-foreground md:text-4xl">
          About {siteConfig.name}
        </h1>
        <p className="mb-8 text-lg text-muted-foreground">
          We started {siteConfig.name} because we were tired of the same
          problems every Dubai resident faces: overpriced quotes, unreliable
          technicians, and zero transparency. Founded by a team that has lived
          in Dubai for over a decade, we built the home services platform we
          wished existed — one where quality is guaranteed, pricing is upfront,
          and every professional is properly vetted.
        </p>

        <div className="mb-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-xl border border-border bg-card p-6 text-center"
            >
              <s.icon className="mx-auto mb-3 h-8 w-8 text-accent" />
              <p className="text-2xl font-bold text-foreground">{s.value}</p>
              <p className="text-sm text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="space-y-6 text-muted-foreground">
          <h2 className="text-2xl font-bold text-foreground">
            Why Dubai Needs {siteConfig.name}
          </h2>
          <p>
            Anyone who has lived in Dubai knows the frustration. You need an AC
            service, so you call three companies and get three wildly different
            prices. A plumber shows up two hours late — or doesn&apos;t show up
            at all. You pay upfront and the work is subpar, but there&apos;s no
            recourse. We heard these stories hundreds of times because we lived
            them ourselves.
          </p>
          <p>
            Dubai&apos;s home services market is fragmented. There are thousands
            of small operators, many unlicensed, with no standardized pricing
            and no accountability. {siteConfig.name} fixes that by bringing
            structure, vetting, and a real guarantee to every job — whether
            it&apos;s a routine apartment cleaning or a full villa renovation.
          </p>

          <h2 className="text-2xl font-bold text-foreground">
            How We Vet Our Professionals
          </h2>
          <p>
            Every technician on {siteConfig.name} goes through a rigorous
            four-step vetting process before they touch a single job. First,
            we verify their Dubai Municipality trade license and insurance
            coverage. Then we run a full background check. Next comes hands-on
            skills testing — we watch them do the actual work. Finally, they
            complete a probation period where customer ratings determine
            whether they stay on the platform. The result: only about 1 in 5
            applicants make it through.
          </p>

          <h2 className="text-2xl font-bold text-foreground">
            The 72-Hour Guarantee
          </h2>
          <p>
            We stand behind every service with our 72-hour satisfaction
            guarantee. If something isn&apos;t right — a cleaning wasn&apos;t
            thorough enough, an AC is still making noise, a paint edge
            isn&apos;t clean — just let us know within 72 hours and we&apos;ll
            send someone back to fix it at no extra charge. No arguments, no
            fine print. We can offer this because we trust the professionals on
            our platform, and because we track quality closely.
          </p>

          <h2 className="text-2xl font-bold text-foreground">
            Why Choose {siteConfig.name}?
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                icon: Shield,
                title: 'Licensed & Insured',
                desc: 'Every technician holds a valid Dubai Municipality license and carries full liability insurance — so you are always protected.',
              },
              {
                icon: Award,
                title: '72-Hour Guarantee',
                desc: 'Not satisfied with the work? We will send someone back within 72 hours to redo it, completely free of charge.',
              },
              {
                icon: Clock,
                title: 'Same-Day Availability',
                desc: 'Book before noon and we can have a professional at your door the same day. Express service available across 40+ Dubai areas.',
              },
              {
                icon: Star,
                title: 'Transparent Pricing',
                desc: 'See the price before you book. No hidden fees, no surprise charges. What you see on the screen is what you pay.',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-lg border border-border bg-card p-4"
              >
                <div className="mb-2 flex items-center gap-2">
                  <item.icon className="h-5 w-5 text-accent" />
                  <h3 className="font-semibold text-foreground">
                    {item.title}
                  </h3>
                </div>
                <p className="text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <section className="mt-12 rounded-xl bg-accent p-8 text-center text-accent-foreground">
          <h2 className="mb-2 text-2xl font-bold">Ready to Book?</h2>
          <p className="mb-4 text-accent-foreground/80">Licensed professionals, transparent pricing, 72-hour guarantee.</p>
          <Link href="/book" className="inline-flex rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90">
            Book Now
          </Link>
        </section>
      </div>
    </div>
  );
}
