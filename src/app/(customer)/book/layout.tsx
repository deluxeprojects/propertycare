import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'Book a Service',
  description: `Book professional home services in Dubai with ${siteConfig.name}. Choose your service, schedule, and pay online in minutes.`,
  robots: { index: false, follow: true },
};

export default function BookLayout({ children }: { children: React.ReactNode }) {
  return children;
}
