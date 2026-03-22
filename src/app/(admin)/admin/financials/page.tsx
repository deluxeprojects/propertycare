import { Suspense } from 'react';
import { DollarSign } from 'lucide-react';
import { createAdminClient } from '@/lib/supabase/admin';
import { AdminTabs } from '@/features/admin/components/AdminTabs';

export default async function FinancialsPage() {
  const supabase = createAdminClient();

  // Calculate revenue KPIs from orders
  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);

  // Start of week (Monday)
  const dayOfWeek = now.getDay();
  const mondayOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - mondayOffset);
  const weekStartStr = weekStart.toISOString().slice(0, 10);

  // Start of month
  const monthStartStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;

  // Start of year
  const yearStartStr = `${now.getFullYear()}-01-01`;

  // Fetch all completed/paid orders for the year to calculate KPIs in one query
  const { data: yearOrders } = await supabase
    .from('orders')
    .select('total_amount_aed, scheduled_date, created_at')
    .gte('scheduled_date', yearStartStr)
    .in('status', ['completed', 'in_progress', 'confirmed', 'assigned'])
    .is('deleted_at', null);

  const ordersList = yearOrders ?? [];

  let todayRevenue = 0;
  let weekRevenue = 0;
  let monthRevenue = 0;
  let ytdRevenue = 0;

  for (const o of ordersList) {
    const amount = Number(o.total_amount_aed ?? 0);
    const date = o.scheduled_date;
    ytdRevenue += amount;
    if (date >= monthStartStr) monthRevenue += amount;
    if (date >= weekStartStr) weekRevenue += amount;
    if (date === todayStr) todayRevenue += amount;
  }

  const kpis = [
    { label: 'Today', value: `AED ${todayRevenue.toLocaleString()}` },
    { label: 'This Week', value: `AED ${weekRevenue.toLocaleString()}` },
    { label: 'This Month', value: `AED ${monthRevenue.toLocaleString()}` },
    { label: 'YTD', value: `AED ${ytdRevenue.toLocaleString()}` },
  ];

  // Fetch recent invoices
  const { data: invoices } = await supabase
    .from('invoices')
    .select(`
      id,
      invoice_number,
      total_aed,
      status,
      profiles!invoices_customer_id_fkey(full_name)
    `)
    .order('created_at', { ascending: false })
    .limit(10);

  const invoiceList = invoices ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Financials</h1>
        <p className="text-sm text-muted-foreground">Revenue, invoices, and financial reports</p>
      </div>

      {/* Tabs */}
      <Suspense>
        <AdminTabs tabs={['Revenue', 'Invoices', 'Payments', 'Payroll', 'VAT Report']} />
      </Suspense>

      {/* Revenue KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <DollarSign className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="mt-2 text-2xl font-bold text-foreground">{kpi.value}</p>
            <p className="text-xs text-muted-foreground">{kpi.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Invoices */}
      <div className="rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="font-semibold text-foreground">Recent Invoices</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-6 py-3 text-left font-medium text-muted-foreground">Invoice #</th>
                <th className="px-6 py-3 text-left font-medium text-muted-foreground">Customer</th>
                <th className="px-6 py-3 text-right font-medium text-muted-foreground">Total</th>
                <th className="px-6 py-3 text-center font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {invoiceList.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                    No invoices found
                  </td>
                </tr>
              )}
              {invoiceList.map((inv: any) => (
                <tr key={inv.id} className="border-b border-border last:border-0">
                  <td className="px-6 py-3 font-medium text-accent">{inv.invoice_number}</td>
                  <td className="px-6 py-3 text-foreground">{inv.profiles?.full_name ?? 'Unknown'}</td>
                  <td className="px-6 py-3 text-right font-medium text-foreground">AED {Number(inv.total_aed).toFixed(2)}</td>
                  <td className="px-6 py-3 text-center">
                    <span className={`rounded-full px-2 py-1 text-xs font-medium ${
                      inv.status === 'paid' ? 'bg-green-100 text-green-800' :
                      inv.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>{inv.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
