import Link from 'next/link';
import { Plus } from 'lucide-react';
import { createAdminClient } from '@/lib/supabase/admin';
import { PriceSimulator } from '@/features/admin/components/PriceSimulator';

interface PricingRule {
  id: string;
  name: string;
  rule_type: string | null;
  modifier_type: string;
  modifier_value: number;
  priority: number;
  is_stackable: boolean;
  is_active: boolean;
  service_id: string | null;
  category_id: string | null;
  area_id: string | null;
  conditions: unknown;
  services: { name_en: string }[];
  service_categories: { name_en: string }[];
  areas: { name_en: string }[];
}

export default async function PricingPage() {
  const supabase = createAdminClient();

  const { data: rules } = await supabase
    .from('pricing_rules')
    .select(`
      id,
      name,
      rule_type,
      modifier_type,
      modifier_value,
      priority,
      is_stackable,
      is_active,
      service_id,
      category_id,
      area_id,
      conditions,
      services(name_en),
      service_categories(name_en),
      areas(name_en)
    `)
    .order('priority', { ascending: false });

  const ruleList = rules ?? [];

  function formatModifier(r: PricingRule) {
    if (r.modifier_type === 'percentage') {
      return `+${Number(r.modifier_value)}%`;
    }
    return `+AED ${Number(r.modifier_value)}`;
  }

  function formatAppliesTo(r: PricingRule) {
    if (r.services?.[0]?.name_en) return r.services[0].name_en;
    if (r.service_categories?.[0]?.name_en) return r.service_categories[0].name_en;
    if (r.areas?.[0]?.name_en) return r.areas[0].name_en;
    return 'All services';
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Pricing Rules</h1>
          <p className="text-sm text-muted-foreground">Dynamic pricing modifiers for services</p>
        </div>
        <Link href="/admin/pricing/new" className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-accent/90">
          <Plus className="h-4 w-4" /> Add Rule
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="overflow-x-auto rounded-xl border border-border bg-card">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Name</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Type</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Applies To</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Modifier</th>
                  <th className="px-4 py-3 text-center font-medium text-muted-foreground">Priority</th>
                  <th className="px-4 py-3 text-center font-medium text-muted-foreground">Stackable</th>
                  <th className="px-4 py-3 text-center font-medium text-muted-foreground">Active</th>
                </tr>
              </thead>
              <tbody>
                {ruleList.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                      No pricing rules found
                    </td>
                  </tr>
                )}
                {ruleList.map((r: PricingRule) => (
                  <tr key={r.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                    <td className="px-4 py-3 font-medium text-foreground">{r.name}</td>
                    <td className="px-4 py-3"><span className="rounded-full bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">{(r.rule_type ?? '').replace(/_/g, ' ')}</span></td>
                    <td className="px-4 py-3 text-muted-foreground">{formatAppliesTo(r)}</td>
                    <td className="px-4 py-3 font-medium text-foreground">{formatModifier(r)}</td>
                    <td className="px-4 py-3 text-center text-foreground">{r.priority}</td>
                    <td className="px-4 py-3 text-center">{r.is_stackable ? <span className="text-green-600">Yes</span> : <span className="text-muted-foreground">No</span>}</td>
                    <td className="px-4 py-3 text-center"><div className={`mx-auto h-3 w-6 rounded-full ${r.is_active ? 'bg-green-500' : 'bg-gray-300'}`} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div>
          <PriceSimulator />
        </div>
      </div>
    </div>
  );
}
