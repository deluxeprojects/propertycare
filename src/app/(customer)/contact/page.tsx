import Link from 'next/link';
import { siteConfig } from '@/config/site';
import { Mail, Phone, MapPin, MessageCircle } from 'lucide-react';
import { ContactForm } from './ContactForm';

export const metadata = {
  title: 'Contact Us',
  description: `Get in touch with ${siteConfig.name}. Call, email, or WhatsApp us for home service bookings and inquiries.`,
};

export default function ContactPage() {
  return (
    <div className="px-4 py-12 md:py-16">
      <div className="container mx-auto max-w-4xl">
        <nav className="mb-6 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-accent-text">Home</Link>{' / '}
          <span className="text-foreground">Contact</span>
        </nav>
        <h1 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
          Contact Us
        </h1>
        <p className="mb-2 text-muted-foreground">
          Have a question, need a quote, or want to book a service? We&apos;re
          here to help — reach out through any of the channels below.
        </p>
        <div className="mb-8 flex flex-wrap gap-4 text-sm">
          <span className="rounded-full bg-accent/10 px-3 py-1 font-medium text-accent-text">
            Open 8 AM – 10 PM, 7 days a week (Dubai time, GST+4)
          </span>
          <span className="rounded-full bg-muted px-3 py-1 text-muted-foreground">
            We typically respond within 30 minutes during business hours
          </span>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {!siteConfig.phone.includes('XX') && (
            <a
              href={`tel:${siteConfig.phone}`}
              className="flex items-start gap-4 rounded-xl border border-border bg-card p-6 transition-colors hover:border-accent"
            >
              <Phone className="h-6 w-6 text-accent-text" />
              <div>
                <h3 className="font-semibold text-foreground">Call Us</h3>
                <p className="text-sm text-muted-foreground">{siteConfig.phone}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Available 8 AM – 10 PM (Dubai time, GST+4)
                </p>
              </div>
            </a>
          )}

          <a
            href={`https://wa.me/${siteConfig.whatsapp.replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-4 rounded-xl border border-border bg-card p-6 transition-colors hover:border-accent"
          >
            <MessageCircle className="h-6 w-6 text-accent-text" />
            <div>
              <h3 className="font-semibold text-foreground">WhatsApp</h3>
              <p className="text-sm text-muted-foreground">{siteConfig.whatsapp}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Quick replies, send photos
              </p>
            </div>
          </a>

          <a
            href={`mailto:${siteConfig.email}`}
            className="flex items-start gap-4 rounded-xl border border-border bg-card p-6 transition-colors hover:border-accent"
          >
            <Mail className="h-6 w-6 text-accent-text" />
            <div>
              <h3 className="font-semibold text-foreground">Email</h3>
              <p className="text-sm text-muted-foreground">{siteConfig.email}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                We reply within 2 hours
              </p>
            </div>
          </a>

          <div className="flex items-start gap-4 rounded-xl border border-border bg-card p-6">
            <MapPin className="h-6 w-6 text-accent-text" />
            <div>
              <h3 className="font-semibold text-foreground">Office</h3>
              <p className="text-sm text-muted-foreground">Dubai, UAE</p>
              <p className="mt-1 text-xs text-muted-foreground">
                By appointment only
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
