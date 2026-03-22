import { siteConfig } from '@/config/site';
import { Shield, Users, MapPin, Clock, Star, Award } from 'lucide-react';

export const metadata = {
  title: 'About Us',
  description: `${siteConfig.name} — Professional home services in Dubai. Licensed, insured, and trusted by thousands of homeowners.`,
};

const stats = [
  { icon: Users, value: '5,000+', label: 'Happy Customers' },
  { icon: MapPin, value: '40+', label: 'Areas Covered' },
  { icon: Star, value: '4.8', label: 'Average Rating' },
  { icon: Clock, value: '15,000+', label: 'Services Completed' },
];

export default function AboutPage() {
  return (
    <div className="px-4 py-12 md:py-16">
      <div className="container mx-auto max-w-4xl">
        <h1 className="mb-6 text-3xl font-bold text-foreground md:text-4xl">
          About {siteConfig.name}
        </h1>
        <p className="mb-8 text-lg text-muted-foreground">
          {siteConfig.name} is Dubai&apos;s trusted home services platform. We
          connect homeowners, tenants, and property managers with licensed,
          vetted professionals for cleaning, maintenance, and renovation
          services.
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
          <h2 className="text-2xl font-bold text-foreground">Our Mission</h2>
          <p>
            We believe every home in Dubai deserves professional care. Our
            mission is to make quality home services accessible, transparent,
            and hassle-free. From routine cleaning to emergency repairs, we
            are committed to delivering excellence every time.
          </p>

          <h2 className="text-2xl font-bold text-foreground">
            Why Choose {siteConfig.name}?
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                icon: Shield,
                title: 'Licensed & Insured',
                desc: 'All technicians are licensed by Dubai Municipality and fully insured.',
              },
              {
                icon: Award,
                title: '72-Hour Guarantee',
                desc: 'Not satisfied? We will redo the service within 72 hours at no extra cost.',
              },
              {
                icon: Clock,
                title: 'Same-Day Service',
                desc: 'Need it today? Book express service and we will be there within hours.',
              },
              {
                icon: Star,
                title: 'Vetted Professionals',
                desc: 'Every technician goes through background checks and skills verification.',
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
      </div>
    </div>
  );
}
