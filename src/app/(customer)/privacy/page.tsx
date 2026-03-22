import { siteConfig } from '@/config/site';

export const metadata = { title: 'Privacy Policy' };

export default function PrivacyPage() {
  return (
    <div className="px-4 py-12 md:py-16">
      <div className="container mx-auto max-w-3xl prose prose-gray">
        <h1 className="text-3xl font-bold text-foreground">Privacy Policy</h1>
        <p className="text-muted-foreground">Last updated: March 2026</p>
        <div className="mt-8 space-y-6 text-sm text-muted-foreground">
          <section>
            <h2 className="text-lg font-semibold text-foreground">1. Information We Collect</h2>
            <p>{siteConfig.name} collects personal information necessary to provide our services: name, email, phone number, address, and payment details.</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground">2. How We Use Your Data</h2>
            <p>We use your data to process bookings, communicate service updates, improve our services, and comply with legal obligations under UAE law.</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground">3. Data Storage</h2>
            <p>Your data is stored securely on Supabase infrastructure with encryption at rest and in transit. We retain data for as long as your account is active.</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground">4. Third-Party Services</h2>
            <p>We share data with payment processors (Stripe), communication providers, and analytics services only as necessary to deliver our services.</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground">5. Your Rights</h2>
            <p>Under UAE Data Protection Law, you have the right to access, correct, or delete your personal data. Contact {siteConfig.email} to exercise these rights.</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground">6. Cookies</h2>
            <p>We use essential cookies for authentication and analytics cookies (with consent) to improve the user experience.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
