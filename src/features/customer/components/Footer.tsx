import Link from 'next/link';
import { siteConfig } from '@/config/site';
import { ProKeepLogo } from '@/components/shared/ProKeepLogo';

const serviceLinks = [
  { label: 'Cleaning', href: '/services/cleaning' },
  { label: 'AC Services', href: '/services/ac-services' },
  { label: 'Pest Control', href: '/services/pest-control' },
  { label: 'Plumbing', href: '/services/plumbing' },
  { label: 'Electrical', href: '/services/electrical' },
  { label: 'Painting', href: '/services/painting' },
];

const areaLinks = [
  { label: 'Dubai Marina', href: '/areas/dubai-marina' },
  { label: 'Downtown Dubai', href: '/areas/downtown-dubai' },
  { label: 'JBR', href: '/areas/jbr' },
  { label: 'Palm Jumeirah', href: '/areas/palm-jumeirah' },
  { label: 'Business Bay', href: '/areas/business-bay' },
  { label: 'JLT', href: '/areas/jlt' },
];

const companyLinks = [
  { label: 'About Us', href: '/about' },
  { label: 'Contact', href: '/contact' },
  { label: 'Blog', href: '/blog' },
  { label: 'AMC Plans', href: '/amc' },
  { label: 'Terms of Service', href: '/terms' },
  { label: 'Privacy Policy', href: '/privacy' },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-primary text-primary-foreground">
      <div className="container mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="mb-4">
              <ProKeepLogo size="xs" dark />
            </div>
            <p className="mb-4 text-sm text-primary-foreground/70">
              {siteConfig.tagline}. Professional home services across 40+ areas
              in Dubai.
            </p>
            <p className="text-sm text-primary-foreground/70">
              {siteConfig.email}
            </p>
            <p className="text-sm text-primary-foreground/70">
              {siteConfig.phone}
            </p>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider">
              Services
            </h4>
            <ul className="space-y-2">
              {serviceLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-primary-foreground/70 transition-colors hover:text-primary-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider">
              Areas
            </h4>
            <ul className="space-y-2">
              {areaLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-primary-foreground/70 transition-colors hover:text-primary-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider">
              Company
            </h4>
            <ul className="space-y-2">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-primary-foreground/70 transition-colors hover:text-primary-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-primary-foreground/20 pt-8 text-center text-sm text-primary-foreground/50">
          &copy; {new Date().getFullYear()} {siteConfig.name}. All rights
          reserved. Licensed & regulated in Dubai, UAE.
        </div>
      </div>
    </footer>
  );
}
