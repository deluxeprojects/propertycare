import Link from 'next/link';
import { Download, Plus, Pencil } from 'lucide-react';
import { createAdminClient } from '@/lib/supabase/admin';

interface AmcSubscription {
  status: string;
  amc_plans: { name_en: string; tier: string }[];
}

interface CustomerRow {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  created_at: string;
  customer_wallets: { balance_aed: number }[];
  amc_subscriptions: AmcSubscription[];
}

export default async function CustomersPage() {
  const supabase = createAdminClient();

  const { data: customers } = await supabase
    .from('profiles')
    .select(`
      id,
      full_name,
      email,
      phone,
      created_at,
      customer_wallets(balance_aed),
      amc_subscriptions(
        status,
        amc_plans(name_en, tier)
      )
    `)
    .eq('role', 'customer')
    .is('deleted_at', null)
    .order('created_at', { ascending: false });

  // Get order stats per customer
  const customerIds = (customers ?? []).map((c: CustomerRow) => c.id);
  let orderStats: Record<string, { count: number; total: number; last_date: string | null }> = {};

  if (customerIds.length > 0) {
    const { data: orders } = await supabase
      .from('orders')
      .select('customer_id, total_amount_aed, created_at')
      .in('customer_id', customerIds)
      .is('deleted_at', null);

    for (const o of orders ?? []) {
      const cid = o.customer_id;
      if (!orderStats[cid]) {
        orderStats[cid] = { count: 0, total: 0, last_date: null };
      }
      orderStats[cid].count += 1;
      orderStats[cid].total += Number(o.total_amount_aed);
      if (!orderStats[cid].last_date || o.created_at > orderStats[cid].last_date!) {
        orderStats[cid].last_date = o.created_at;
      }
    }
  }

  const customerList = customers ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Customers</h1>
          <p className="text-sm text-muted-foreground">{customerList.length} total customers</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/customers/new" className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground hover:bg-accent/90">
            <Plus className="h-4 w-4" /> Add Customer
          </Link>
          <Link href="/api/v1/admin/export/customers" className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-muted">
            <Download className="h-4 w-4" /> Export CSV
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Customer</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Area</th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">Orders</th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">Total Spent</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Last Order</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Care Plan</th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">Wallet</th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {customerList.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                  No customers found
                </td>
              </tr>
            )}
            {customerList.map((c: CustomerRow) => {
              const stats = orderStats[c.id] ?? { count: 0, total: 0, last_date: null };
              const activeSub = (c.amc_subscriptions ?? []).find((s: AmcSubscription) => s.status === 'active');
              const walletBalance = c.customer_wallets?.[0]?.balance_aed ?? 0;
              const initials = (c.full_name ?? '')
                .split(' ')
                .map((n: string) => n[0])
                .join('')
                .toUpperCase();

              return (
                <tr key={c.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                        {initials}
                      </div>
                      <div>
                        <Link href={`/admin/customers/${c.id}`} className="font-medium text-accent hover:underline">{c.full_name}</Link>
                        <p className="text-xs text-muted-foreground">{c.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">—</td>
                  <td className="px-4 py-3 text-right text-foreground">{stats.count}</td>
                  <td className="px-4 py-3 text-right font-medium text-foreground">AED {stats.total.toLocaleString()}</td>
                  <td className="px-4 py-3 text-muted-foreground">{stats.last_date ? stats.last_date.slice(0, 10) : '—'}</td>
                  <td className="px-4 py-3">
                    {activeSub ? (
                      <span className="rounded-full bg-accent/10 px-2 py-1 text-xs font-medium text-accent">
                        {activeSub.amc_plans?.[0]?.name_en ?? activeSub.amc_plans?.[0]?.tier ?? '—'}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right text-foreground">AED {Number(walletBalance)}</td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/admin/customers/${c.id}`} className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-accent hover:bg-muted">
                      <Pencil className="h-3 w-3" /> Edit
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
