import Link from 'next/link';
import { Plus, Pencil } from 'lucide-react';
import { createAdminClient } from '@/lib/supabase/admin';

interface Promotion {
  id: string;
  code: string | null;
  name: string;
  discount_type: string | null;
  discount_value: number | null;
  max_discount_aed: number | null;
  usage_count: number | null;
  usage_limit_total: number | null;
  valid_until: string | null;
  is_active: boolean;
  is_first_order_only: boolean;
}

export default async function PromosPage() {
  const supabase = createAdminClient();

  const { data: promos } = await supabase
    .from('promotions')
    .select(`
      id,
      code,
      name,
      discount_type,
      discount_value,
      max_discount_aed,
      usage_count,
      usage_limit_total,
      valid_until,
      is_active,
      is_first_order_only
    `)
    .order('created_at', { ascending: false });

  const promoList = promos ?? [];

  function formatValue(p: Promotion) {
    if (p.discount_type === 'percentage') return `${Number(p.discount_value)}%`;
    if (p.discount_type === 'fixed_amount') return `AED ${Number(p.discount_value)}`;
    if (p.discount_type === 'free_addon') return 'Free add-on';
    if (p.discount_type === 'free_service') return 'Free service';
    return String(p.discount_value);
  }

  function formatUsage(p: Promotion) {
    const used = p.usage_count ?? 0;
    const limit = p.usage_limit_total;
    return `${used}/${limit != null ? limit : '\u221e'}`;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Promotions</h1>
          <p className="text-sm text-muted-foreground">Manage discount codes and offers</p>
        </div>
        <Link href="/admin/promos/new" className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-accent/90">
          <Plus className="h-4 w-4" /> Create Promo
        </Link>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Code</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Name</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Type</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Value</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Usage</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Valid Until</th>
              <th className="px-4 py-3 text-center font-medium text-muted-foreground">Status</th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {promoList.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                  No promotions found
                </td>
              </tr>
            )}
            {promoList.map((p: Promotion) => (
              <tr key={p.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                <td className="px-4 py-3"><span className="rounded bg-muted px-2 py-1 font-mono text-xs font-bold text-foreground">{p.code ?? '—'}</span></td>
                <td className="px-4 py-3 font-medium text-foreground">
                  <Link href={`/admin/promos/${p.id}`} className="text-accent hover:underline">{p.name}</Link>
                  {p.is_first_order_only && <span className="ml-2 rounded-full bg-blue-100 px-1.5 py-0.5 text-[10px] text-blue-800">1st order</span>}
                </td>
                <td className="px-4 py-3"><span className="rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground">{(p.discount_type ?? '').replace(/_/g, ' ')}</span></td>
                <td className="px-4 py-3 font-medium text-foreground">{formatValue(p)}</td>
                <td className="px-4 py-3 text-muted-foreground">{formatUsage(p)}</td>
                <td className="px-4 py-3 text-muted-foreground">{p.valid_until ? new Date(p.valid_until).toISOString().slice(0, 10) : '—'}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`rounded-full px-2 py-1 text-xs font-medium ${p.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {p.is_active ? 'active' : 'inactive'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/promos/${p.id}`} className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-accent hover:bg-muted">
                    <Pencil className="h-3 w-3" /> Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
