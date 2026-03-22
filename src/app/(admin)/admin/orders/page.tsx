import Link from 'next/link';
import { createAdminClient } from '@/lib/supabase/admin';
import { Plus, Download } from 'lucide-react';

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    assigned: 'bg-purple-100 text-purple-800',
    in_progress: 'bg-cyan-100 text-cyan-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };
  return (
    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${colors[status] || 'bg-gray-100 text-gray-800'}`}>
      {status.replace('_', ' ')}
    </span>
  );
}

function PaymentBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    authorized: 'bg-blue-100 text-blue-800',
    captured: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
    refunded: 'bg-gray-100 text-gray-800',
  };
  return (
    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${colors[status] || 'bg-gray-100 text-gray-800'}`}>
      {status}
    </span>
  );
}

export default async function OrdersPage() {
  const supabase = createAdminClient();

  const { data: orders } = await supabase
    .from('orders')
    .select(`
      id,
      order_number,
      status,
      payment_status,
      total_amount_aed,
      scheduled_date,
      scheduled_time_slot,
      assigned_technician_id,
      created_at,
      profiles!orders_customer_id_fkey(full_name, phone),
      services(name_en),
      areas(name_en),
      technician_profile:profiles!orders_assigned_technician_id_fkey(full_name)
    `)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })
    .limit(50);

  const orderList = orders ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Orders</h1>
          <p className="text-sm text-muted-foreground">Manage all bookings and service orders</p>
        </div>
        <div className="flex gap-3">
          <button className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-muted">
            <Download className="h-4 w-4" /> Export
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-accent/90">
            <Plus className="h-4 w-4" /> New Order
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {['All', 'Pending', 'Confirmed', 'Assigned', 'In Progress', 'Completed', 'Cancelled'].map((f) => (
          <button
            key={f}
            className={`rounded-full px-3 py-1 text-sm font-medium ${f === 'All' ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Order #</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Customer</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Service</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Area</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Date/Time</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Technician</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Payment</th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">Total</th>
            </tr>
          </thead>
          <tbody>
            {orderList.length === 0 && (
              <tr>
                <td colSpan={9} className="px-4 py-8 text-center text-muted-foreground">
                  No orders found
                </td>
              </tr>
            )}
            {orderList.map((o: any) => (
              <tr key={o.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                <td className="px-4 py-3">
                  <Link href={`/admin/orders/${o.id}`} className="font-medium text-accent hover:underline">{o.order_number}</Link>
                </td>
                <td className="px-4 py-3">
                  <div>
                    <p className="font-medium text-foreground">{o.profiles?.full_name ?? 'Unknown'}</p>
                    <p className="text-xs text-muted-foreground">{o.profiles?.phone ?? ''}</p>
                  </div>
                </td>
                <td className="px-4 py-3 text-foreground">{o.services?.name_en ?? 'Unknown'}</td>
                <td className="px-4 py-3 text-muted-foreground">{o.areas?.name_en ?? '-'}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  <div>
                    <p>{o.scheduled_date}</p>
                    <p className="text-xs">{o.scheduled_time_slot}</p>
                  </div>
                </td>
                <td className="px-4 py-3 text-foreground">
                  {o.technician_profile?.full_name ?? (
                    <span className="font-medium text-destructive">Unassigned</span>
                  )}
                </td>
                <td className="px-4 py-3"><StatusBadge status={o.status} /></td>
                <td className="px-4 py-3"><PaymentBadge status={o.payment_status ?? 'pending'} /></td>
                <td className="px-4 py-3 text-right font-medium text-foreground">AED {Number(o.total_amount_aed).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
