import { siteConfig } from '@/config/site';
import { createAdminClient } from '@/lib/supabase/admin';
import { AdminTabs } from '@/features/admin/components/AdminTabs';

export default async function SettingsPage() {
  const supabase = createAdminClient();

  const { data: settings } = await supabase
    .from('system_settings')
    .select('key, value');

  const settingsMap: Record<string, string> = {};
  for (const s of settings ?? []) {
    settingsMap[s.key] = s.value;
  }

  const { data } = await supabase
    .from('audit_logs')
    .select('id, action, entity_type, entity_id, actor_id, created_at, metadata')
    .order('created_at', { ascending: false })
    .limit(50);
  const auditLogs = data ?? [];

  const inputClass = 'w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent';
  const disabledInputClass = 'w-full rounded-lg border border-input bg-muted px-3 py-2 text-sm text-muted-foreground';

  const businessTab = (
    <div className="rounded-xl border border-border bg-card p-6">
      <h3 className="mb-6 font-semibold text-foreground">Business Information</h3>
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Company Name</label>
          <input type="text" defaultValue={settingsMap['company_name'] ?? siteConfig.name} className={inputClass} />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Tagline</label>
          <input type="text" defaultValue={settingsMap['tagline'] ?? siteConfig.tagline} className={inputClass} />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Contact Email</label>
          <input type="email" defaultValue={settingsMap['contact_email'] ?? siteConfig.email} className={inputClass} />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Contact Phone</label>
          <input type="text" defaultValue={settingsMap['contact_phone'] ?? siteConfig.phone} className={inputClass} />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">VAT TRN</label>
          <input type="text" defaultValue={settingsMap['vat_trn'] ?? ''} placeholder="Enter VAT TRN" className={inputClass} />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Currency</label>
          <input type="text" defaultValue="AED" disabled className={disabledInputClass} />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Order Prefix</label>
          <input type="text" defaultValue={settingsMap['order_prefix'] ?? siteConfig.orderPrefix} className={inputClass} />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Invoice Prefix</label>
          <input type="text" defaultValue={settingsMap['invoice_prefix'] ?? siteConfig.invoicePrefix} className={inputClass} />
        </div>
      </div>
      <div className="mt-6 flex justify-end">
        <button className="rounded-lg bg-accent px-6 py-2 text-sm font-semibold text-accent-foreground hover:bg-accent/90">
          Save Changes
        </button>
      </div>
    </div>
  );

  const bookingTab = (
    <div className="rounded-xl border border-border bg-card p-6">
      <h3 className="mb-6 font-semibold text-foreground">Booking Rules</h3>
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Available Time Slots</label>
          <input type="text" defaultValue={settingsMap['time_slots'] ?? '08:00,09:00,10:00,11:00,12:00,13:00,14:00,15:00,16:00,17:00'} placeholder="Comma-separated, e.g. 08:00,09:00,10:00" className={inputClass} />
          <p className="mt-1 text-xs text-muted-foreground">Comma-separated time slots in 24h format</p>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Min Advance Booking (hours)</label>
          <input type="number" defaultValue={settingsMap['min_advance_booking_hours'] ?? '24'} className={inputClass} />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Cancellation Window (hours)</label>
          <input type="number" defaultValue={settingsMap['cancellation_hours'] ?? '12'} className={inputClass} />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Cancellation Fee (%)</label>
          <input type="number" defaultValue={settingsMap['cancellation_fee_pct'] ?? '25'} step="1" className={inputClass} />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Max Reschedules per Order</label>
          <input type="number" defaultValue={settingsMap['max_reschedules'] ?? '2'} className={inputClass} />
        </div>
      </div>
      <div className="mt-6 flex justify-end">
        <button className="rounded-lg bg-accent px-6 py-2 text-sm font-semibold text-accent-foreground hover:bg-accent/90">
          Save Changes
        </button>
      </div>
    </div>
  );

  const paymentTab = (
    <div className="rounded-xl border border-border bg-card p-6">
      <h3 className="mb-6 font-semibold text-foreground">Payment Configuration</h3>
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Stripe Publishable Key</label>
          <input type="text" defaultValue={settingsMap['stripe_pk'] ? '••••' + (settingsMap['stripe_pk'] ?? '').slice(-8) : ''} placeholder="pk_live_..." className={inputClass} />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Stripe Secret Key</label>
          <input type="text" defaultValue={settingsMap['stripe_sk'] ? '••••' + (settingsMap['stripe_sk'] ?? '').slice(-8) : ''} placeholder="sk_live_..." className={inputClass} />
        </div>
        <div className="md:col-span-2">
          <div className="flex items-center gap-3">
            <div className={`h-5 w-9 rounded-full p-0.5 ${settingsMap['cash_enabled'] === 'true' ? 'bg-green-500' : 'bg-gray-300'}`}>
              <div className={`h-4 w-4 rounded-full bg-white transition-transform ${settingsMap['cash_enabled'] === 'true' ? 'translate-x-4' : ''}`} />
            </div>
            <span className="text-sm font-medium text-foreground">Cash on Delivery Enabled</span>
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Bank Name</label>
          <input type="text" defaultValue={settingsMap['bank_name'] ?? ''} placeholder="e.g. Emirates NBD" className={inputClass} />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Account Number / IBAN</label>
          <input type="text" defaultValue={settingsMap['bank_iban'] ?? ''} placeholder="AE..." className={inputClass} />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Account Name</label>
          <input type="text" defaultValue={settingsMap['bank_account_name'] ?? ''} className={inputClass} />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">SWIFT Code</label>
          <input type="text" defaultValue={settingsMap['bank_swift'] ?? ''} className={inputClass} />
        </div>
      </div>
      <div className="mt-6 flex justify-end">
        <button className="rounded-lg bg-accent px-6 py-2 text-sm font-semibold text-accent-foreground hover:bg-accent/90">
          Save Changes
        </button>
      </div>
    </div>
  );

  const notificationsTab = (
    <div className="rounded-xl border border-border bg-card p-6">
      <h3 className="mb-6 font-semibold text-foreground">Notification Settings</h3>
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Email From Address</label>
          <input type="email" defaultValue={settingsMap['email_from'] ?? 'noreply@prokeep.ae'} className={inputClass} />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Reply-To Address</label>
          <input type="email" defaultValue={settingsMap['email_reply_to'] ?? siteConfig.email} className={inputClass} />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">WhatsApp Business Number</label>
          <input type="text" defaultValue={settingsMap['whatsapp_number'] ?? siteConfig.whatsapp} className={inputClass} />
        </div>
      </div>
      <div className="mt-6 flex justify-end">
        <button className="rounded-lg bg-accent px-6 py-2 text-sm font-semibold text-accent-foreground hover:bg-accent/90">
          Save Changes
        </button>
      </div>
    </div>
  );

  const seoTab = (
    <div className="rounded-xl border border-border bg-card p-6">
      <h3 className="mb-6 font-semibold text-foreground">SEO & Analytics</h3>
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Google Analytics 4 ID</label>
          <input type="text" defaultValue={settingsMap['ga4_id'] ?? ''} placeholder="G-XXXXXXXXXX" className={inputClass} />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Google Tag Manager ID</label>
          <input type="text" defaultValue={settingsMap['gtm_id'] ?? ''} placeholder="GTM-XXXXXXX" className={inputClass} />
        </div>
        <div className="md:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-foreground">Default OG Image URL</label>
          <input type="text" defaultValue={settingsMap['default_og_image'] ?? ''} placeholder="https://..." className={inputClass} />
        </div>
      </div>
      <div className="mt-6 flex justify-end">
        <button className="rounded-lg bg-accent px-6 py-2 text-sm font-semibold text-accent-foreground hover:bg-accent/90">
          Save Changes
        </button>
      </div>
    </div>
  );

  const integrationsTab = (
    <div className="rounded-xl border border-border bg-card p-6">
      <h3 className="mb-6 font-semibold text-foreground">Integrations</h3>
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Supabase URL</label>
          <input type="text" defaultValue={process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''} disabled className={disabledInputClass} />
          <p className="mt-1 text-xs text-muted-foreground">Read-only. Change via environment variables.</p>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Mapbox Token</label>
          <input type="text" defaultValue={settingsMap['mapbox_token'] ?? ''} placeholder="pk.eyJ..." className={inputClass} />
        </div>
        <div className="md:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-foreground">n8n Webhook Secret</label>
          <input type="text" defaultValue={settingsMap['n8n_webhook_secret'] ?? ''} placeholder="Enter webhook secret" className={inputClass} />
        </div>
      </div>
      <div className="mt-6 flex justify-end">
        <button className="rounded-lg bg-accent px-6 py-2 text-sm font-semibold text-accent-foreground hover:bg-accent/90">
          Save Changes
        </button>
      </div>
    </div>
  );

  const auditLogTab = (
    <div className="rounded-xl border border-border bg-card">
      <div className="border-b border-border px-6 py-4">
        <h3 className="font-semibold text-foreground">Recent Audit Log</h3>
        <p className="text-xs text-muted-foreground">Last 50 entries</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-6 py-3 text-left font-medium text-muted-foreground">Timestamp</th>
              <th className="px-6 py-3 text-left font-medium text-muted-foreground">Action</th>
              <th className="px-6 py-3 text-left font-medium text-muted-foreground">Entity</th>
              <th className="px-6 py-3 text-left font-medium text-muted-foreground">Actor</th>
            </tr>
          </thead>
          <tbody>
            {auditLogs.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                  No audit log entries found
                </td>
              </tr>
            )}
            {auditLogs.map((log: any) => (
              <tr key={log.id} className="border-b border-border last:border-0">
                <td className="px-6 py-3 text-muted-foreground">{new Date(log.created_at).toLocaleString()}</td>
                <td className="px-6 py-3 font-medium text-foreground">{log.action}</td>
                <td className="px-6 py-3 text-foreground">{log.entity_type} <span className="text-muted-foreground">#{log.entity_id?.slice(0, 8)}</span></td>
                <td className="px-6 py-3 text-muted-foreground">{log.actor_id?.slice(0, 8) ?? 'system'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground">System configuration — super admin only</p>
      </div>

      <AdminTabs tabs={[
        { label: 'Business Info', content: businessTab },
        { label: 'Booking Rules', content: bookingTab },
        { label: 'Payment', content: paymentTab },
        { label: 'Notifications', content: notificationsTab },
        { label: 'SEO', content: seoTab },
        { label: 'Integrations', content: integrationsTab },
        { label: 'Audit Log', content: auditLogTab },
      ]} />
    </div>
  );
}
