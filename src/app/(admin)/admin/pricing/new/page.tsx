import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { createAdminClient } from '@/lib/supabase/admin';

export default async function NewPricingRulePage() {
  const supabase = createAdminClient();

  const { data: services } = await supabase
    .from('services')
    .select('id, name_en')
    .eq('is_active', true)
    .is('deleted_at', null)
    .order('name_en', { ascending: true });

  const { data: categories } = await supabase
    .from('service_categories')
    .select('id, name_en')
    .is('deleted_at', null)
    .order('name_en', { ascending: true });

  const { data: areas } = await supabase
    .from('areas')
    .select('id, name_en')
    .eq('is_active', true)
    .is('deleted_at', null)
    .order('name_en', { ascending: true });

  const serviceList = services ?? [];
  const categoryList = categories ?? [];
  const areaList = areas ?? [];

  const inputClass = 'w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent';

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/pricing" className="rounded-lg p-2 text-muted-foreground hover:bg-muted">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">New Pricing Rule</h1>
          <p className="text-sm text-muted-foreground">Create a custom pricing modifier</p>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Rule Name</label>
              <input type="text" placeholder="e.g. Peak Season Surcharge" className={inputClass} />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Rule Type</label>
              <select className={inputClass}>
                <option value="surcharge">Surcharge</option>
                <option value="discount">Discount</option>
                <option value="override">Override</option>
                <option value="minimum">Minimum Price</option>
              </select>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Service (optional)</label>
              <select className={inputClass}>
                <option value="">All Services</option>
                {serviceList.map((s: any) => (
                  <option key={s.id} value={s.id}>{s.name_en}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Category (optional)</label>
              <select className={inputClass}>
                <option value="">All Categories</option>
                {categoryList.map((c: any) => (
                  <option key={c.id} value={c.id}>{c.name_en}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Area (optional)</label>
              <select className={inputClass}>
                <option value="">All Areas</option>
                {areaList.map((a: any) => (
                  <option key={a.id} value={a.id}>{a.name_en}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Modifier Type</label>
              <select className={inputClass}>
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed Amount (AED)</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Modifier Value</label>
              <input type="number" step="0.01" placeholder="e.g. 10" className={inputClass} />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Priority</label>
              <input type="number" placeholder="e.g. 10" className={inputClass} />
              <p className="mt-1 text-xs text-muted-foreground">Higher = applied first</p>
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

          <div className="flex items-center gap-3">
            <input type="checkbox" id="is_stackable" className="h-4 w-4 rounded border-input text-accent focus:ring-accent" />
            <label htmlFor="is_stackable" className="text-sm font-medium text-foreground">Stackable (can combine with other rules)</label>
          </div>

          <div className="flex justify-end gap-3">
            <Link href="/admin/pricing" className="rounded-lg border border-border px-6 py-2 text-sm font-medium text-foreground hover:bg-muted">
              Cancel
            </Link>
            <button className="rounded-lg bg-accent px-6 py-2 text-sm font-semibold text-accent-foreground hover:bg-accent/90">
              Save Pricing Rule
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
