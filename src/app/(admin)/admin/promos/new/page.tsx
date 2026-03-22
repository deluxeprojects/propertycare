import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NewPromoPage() {
  const inputClass = 'w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent';

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/promos" className="rounded-lg p-2 text-muted-foreground hover:bg-muted">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">New Promo Code</h1>
          <p className="text-sm text-muted-foreground">Create a new promotional offer</p>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Promo Code</label>
              <input type="text" placeholder="e.g. SUMMER25" className={inputClass} />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Name</label>
              <input type="text" placeholder="Summer 2026 Discount" className={inputClass} />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Description</label>
            <textarea rows={3} placeholder="Describe this promotion..." className={inputClass} />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Discount Type</label>
              <select className={inputClass}>
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed Amount</option>
                <option value="free_addon">Free Add-on</option>
                <option value="free_service">Free Service</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Discount Value</label>
              <input type="number" step="0.01" placeholder="e.g. 25" className={inputClass} />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Min Order Amount (AED)</label>
              <input type="number" step="0.01" placeholder="0" className={inputClass} />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Max Discount (AED)</label>
              <input type="number" step="0.01" placeholder="No limit" className={inputClass} />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Usage Limit (Total)</label>
              <input type="number" placeholder="Unlimited" className={inputClass} />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Usage Limit (Per User)</label>
              <input type="number" placeholder="Unlimited" className={inputClass} />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Valid From</label>
              <input type="date" className={inputClass} />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Valid Until</label>
              <input type="date" className={inputClass} />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <input type="checkbox" id="is_public" className="h-4 w-4 rounded border-input text-accent focus:ring-accent" />
              <label htmlFor="is_public" className="text-sm font-medium text-foreground">Public promo (visible to all users)</label>
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="is_first_order_only" className="h-4 w-4 rounded border-input text-accent focus:ring-accent" />
              <label htmlFor="is_first_order_only" className="text-sm font-medium text-foreground">First order only</label>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Link href="/admin/promos" className="rounded-lg border border-border px-6 py-2 text-sm font-medium text-foreground hover:bg-muted">
              Cancel
            </Link>
            <button className="rounded-lg bg-accent px-6 py-2 text-sm font-semibold text-accent-foreground hover:bg-accent/90">
              Save Promo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
