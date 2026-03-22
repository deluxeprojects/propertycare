import { siteConfig } from '@/config/site';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground">System configuration — super admin only</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-lg bg-muted p-1">
        {['Business Info', 'Booking Rules', 'Payment', 'Notifications', 'SEO', 'Integrations', 'Audit Log'].map((tab, i) => (
          <button key={tab} className={`rounded-md px-4 py-2 text-sm font-medium ${i === 0 ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
            {tab}
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="mb-6 font-semibold text-foreground">Business Information</h3>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Company Name</label>
            <input type="text" defaultValue={siteConfig.name} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Tagline</label>
            <input type="text" defaultValue={siteConfig.tagline} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Contact Email</label>
            <input type="email" defaultValue={siteConfig.email} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Contact Phone</label>
            <input type="text" defaultValue={siteConfig.phone} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">VAT TRN</label>
            <input type="text" placeholder="Enter VAT TRN" className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Currency</label>
            <input type="text" defaultValue="AED" disabled className="w-full rounded-lg border border-input bg-muted px-3 py-2 text-sm text-muted-foreground" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Order Prefix</label>
            <input type="text" defaultValue={siteConfig.orderPrefix} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Invoice Prefix</label>
            <input type="text" defaultValue={siteConfig.invoicePrefix} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent" />
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button className="rounded-lg bg-accent px-6 py-2 text-sm font-semibold text-accent-foreground hover:bg-accent/90">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
