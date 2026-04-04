import { DollarSign } from 'lucide-react';
import { createAdminClient } from '@/lib/supabase/admin';
import { AdminTabs } from '@/features/admin/components/AdminTabs';

interface InvoiceRow {
  id: string;
  invoice_number: string;
  total_aed: number;
  status: string;
  created_at: string | null;
  due_date: string | null;
  profiles: { full_name: string }[];
}

interface PaymentRow {
  id: string;
  amount_aed: number;
  method: string | null;
  status: string;
  created_at: string | null;
  reference: string | null;
  profiles: { full_name: string }[];
}

interface TechnicianEarningRow {
  id: string;
  employee_code: string;
  hourly_rate: number | null;
  profiles: { full_name: string }[];
}

export default async function FinancialsPage() {
  const supabase = createAdminClient();

  // Revenue KPIs
  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);

  const dayOfWeek = now.getDay();
  const mondayOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - mondayOffset);
  const weekStartStr = weekStart.toISOString().slice(0, 10);

  const monthStartStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
  const yearStartStr = `${now.getFullYear()}-01-01`;

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

  // Invoice list (fetch larger set for both revenue and invoices tabs)
  const { data: invoices } = await supabase
    .from('invoices')
    .select(`
      id,
      invoice_number,
      total_aed,
      status,
      created_at,
      due_date,
      profiles!invoices_customer_id_fkey(full_name)
    `)
    .order('created_at', { ascending: false })
    .limit(50);
  const invoiceList = invoices ?? [];

  // Payment list
  const { data: payments } = await supabase
    .from('payments')
    .select(`
      id,
      amount_aed,
      method,
      status,
      created_at,
      reference,
      profiles!payments_customer_id_fkey(full_name)
    `)
    .order('created_at', { ascending: false })
    .limit(50);
  const paymentList = payments ?? [];

  // Payroll — technician earnings
  const { data: techs } = await supabase
    .from('technicians')
    .select(`
      id,
      employee_code,
      hourly_rate,
      profiles!technicians_profile_id_fkey(full_name)
    `)
    .is('deleted_at', null)
    .order('employee_code', { ascending: true })
    .limit(50);
  const technicianEarnings = techs ?? [];

  const revenueTab = (
    <>
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
                  <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">No invoices found</td>
                </tr>
              )}
              {invoiceList.slice(0, 10).map((inv: InvoiceRow) => (
                <tr key={inv.id} className="border-b border-border last:border-0">
                  <td className="px-6 py-3 font-medium text-accent">{inv.invoice_number}</td>
                  <td className="px-6 py-3 text-foreground">{inv.profiles?.[0]?.full_name ?? 'Unknown'}</td>
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
    </>
  );

  const invoicesTab = (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <h2 className="font-semibold text-foreground">All Invoices</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-6 py-3 text-left font-medium text-muted-foreground">Invoice #</th>
              <th className="px-6 py-3 text-left font-medium text-muted-foreground">Customer</th>
              <th className="px-6 py-3 text-left font-medium text-muted-foreground">Date</th>
              <th className="px-6 py-3 text-left font-medium text-muted-foreground">Due Date</th>
              <th className="px-6 py-3 text-right font-medium text-muted-foreground">Total</th>
              <th className="px-6 py-3 text-center font-medium text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody>
            {invoiceList.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">No invoices found</td>
              </tr>
            )}
            {invoiceList.map((inv: InvoiceRow) => (
              <tr key={inv.id} className="border-b border-border last:border-0">
                <td className="px-6 py-3 font-medium text-accent">{inv.invoice_number}</td>
                <td className="px-6 py-3 text-foreground">{inv.profiles?.[0]?.full_name ?? 'Unknown'}</td>
                <td className="px-6 py-3 text-muted-foreground">{inv.created_at ? new Date(inv.created_at).toLocaleDateString() : '—'}</td>
                <td className="px-6 py-3 text-muted-foreground">{inv.due_date ?? '—'}</td>
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
  );

  const paymentsTab = (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <h2 className="font-semibold text-foreground">All Payments</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-6 py-3 text-left font-medium text-muted-foreground">Reference</th>
              <th className="px-6 py-3 text-left font-medium text-muted-foreground">Customer</th>
              <th className="px-6 py-3 text-left font-medium text-muted-foreground">Method</th>
              <th className="px-6 py-3 text-left font-medium text-muted-foreground">Date</th>
              <th className="px-6 py-3 text-right font-medium text-muted-foreground">Amount</th>
              <th className="px-6 py-3 text-center font-medium text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody>
            {paymentList.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">No payments found</td>
              </tr>
            )}
            {paymentList.map((p: PaymentRow) => (
              <tr key={p.id} className="border-b border-border last:border-0">
                <td className="px-6 py-3 font-medium text-accent">{p.reference ?? p.id.slice(0, 8)}</td>
                <td className="px-6 py-3 text-foreground">{p.profiles?.[0]?.full_name ?? 'Unknown'}</td>
                <td className="px-6 py-3 text-foreground capitalize">{p.method ?? '—'}</td>
                <td className="px-6 py-3 text-muted-foreground">{p.created_at ? new Date(p.created_at).toLocaleDateString() : '—'}</td>
                <td className="px-6 py-3 text-right font-medium text-foreground">AED {Number(p.amount_aed).toFixed(2)}</td>
                <td className="px-6 py-3 text-center">
                  <span className={`rounded-full px-2 py-1 text-xs font-medium ${
                    p.status === 'succeeded' || p.status === 'completed' ? 'bg-green-100 text-green-800' :
                    p.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    p.status === 'failed' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>{p.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const payrollTab = (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">Technician Earnings Summary</h3>
          <button className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground hover:bg-accent/90">
            Export CSV
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-6 py-3 text-left font-medium text-muted-foreground">Code</th>
                <th className="px-6 py-3 text-left font-medium text-muted-foreground">Name</th>
                <th className="px-6 py-3 text-right font-medium text-muted-foreground">Hourly Rate</th>
              </tr>
            </thead>
            <tbody>
              {technicianEarnings.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-muted-foreground">No technicians found</td>
                </tr>
              )}
              {technicianEarnings.map((t: TechnicianEarningRow) => (
                <tr key={t.id} className="border-b border-border last:border-0">
                  <td className="px-6 py-3 font-medium text-accent">{t.employee_code}</td>
                  <td className="px-6 py-3 text-foreground">{t.profiles?.[0]?.full_name ?? 'Unknown'}</td>
                  <td className="px-6 py-3 text-right font-medium text-foreground">AED {Number(t.hourly_rate ?? 0).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const vatReportTab = (
    <div className="rounded-xl border border-border bg-card p-6">
      <h3 className="mb-6 font-semibold text-foreground">VAT Report Summary</h3>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-border p-4">
          <p className="text-sm text-muted-foreground">Total Revenue (YTD)</p>
          <p className="mt-1 text-2xl font-bold text-foreground">AED {ytdRevenue.toLocaleString()}</p>
        </div>
        <div className="rounded-lg border border-border p-4">
          <p className="text-sm text-muted-foreground">VAT Rate</p>
          <p className="mt-1 text-2xl font-bold text-foreground">5%</p>
        </div>
        <div className="rounded-lg border border-border p-4">
          <p className="text-sm text-muted-foreground">Estimated VAT Payable (YTD)</p>
          <p className="mt-1 text-2xl font-bold text-foreground">AED {(ytdRevenue * 0.05).toLocaleString()}</p>
        </div>
      </div>
      <p className="mt-4 text-xs text-muted-foreground">
        This is a simplified estimate. VAT = Total Revenue x 5%. Consult your accountant for the official VAT return.
      </p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Financials</h1>
        <p className="text-sm text-muted-foreground">Revenue, invoices, and financial reports</p>
      </div>

      <AdminTabs tabs={[
        { label: 'Revenue', content: revenueTab },
        { label: 'Invoices', content: invoicesTab },
        { label: 'Payments', content: paymentsTab },
        { label: 'Payroll', content: payrollTab },
        { label: 'VAT Report', content: vatReportTab },
      ]} />
    </div>
  );
}
