import { siteConfig } from '@/config/site';

export const metadata = {
  title: 'Terms of Service',
  description: `${siteConfig.name} terms of service. Booking, payment, cancellation policy, 72-hour guarantee, and liability for home services in Dubai, UAE.`,
};

export default function TermsPage() {
  return (
    <div className="px-4 py-12 md:py-16">
      <div className="container mx-auto max-w-3xl prose prose-gray">
        <h1 className="text-3xl font-bold text-foreground">Terms of Service</h1>
        <p className="text-muted-foreground">Last updated: March 2026</p>
        <div className="mt-8 space-y-6 text-sm text-muted-foreground">
          <section>
            <h2 className="text-lg font-semibold text-foreground">1. Services</h2>
            <p>{siteConfig.name} provides home maintenance and cleaning services in Dubai, UAE. By booking a service, you agree to these terms.</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground">2. Booking & Payment</h2>
            <p>All bookings are subject to availability. Payment is required at the time of booking unless cash payment is selected. Prices are in AED and include 5% UAE VAT.</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground">3. Cancellation Policy</h2>
            <p>Free cancellation up to 12 hours before your scheduled service. Late cancellations may incur a 25% fee. No-shows are charged the full amount.</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground">4. Service Guarantee</h2>
            <p>{siteConfig.name} offers a 72-hour satisfaction guarantee. If you are not satisfied with the service, contact us within 72 hours and we will arrange a redo at no additional cost.</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground">5. Liability</h2>
            <p>All technicians are insured. {siteConfig.name} carries professional liability insurance covering damages during service delivery.</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground">6. Privacy</h2>
            <p>Your personal data is handled in accordance with our Privacy Policy and UAE Data Protection Law.</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground">7. Contact</h2>
            <p>For questions about these terms, contact us at {siteConfig.email}.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
