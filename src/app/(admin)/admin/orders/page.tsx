import Link from 'next/link';
import { createAdminClient } from '@/lib/supabase/admin';
import { Download, Pencil } from 'lucide-react';
import { OrderFilters } from '@/features/admin/components/orders/OrderFilters';

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    assigned: 'bg-purple-100 text-purple-800',
    in_transit: 'bg-indigo-100 text-indigo-800',
    in_progress: 'bg-cyan-100 text-cyan-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    refunded: 'bg-red-100 text-red-800',
  };
  return (
    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${colors[status] || 'bg-gray-100 text-gray-800'}`}>
      {status.replace(/_/g, ' ')}
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

interface Props {
  searchParams: Promise<{ status?: string }>;
}

export default async function OrdersPage({ searchParams }: Props) {
  const params = await searchParams;
  const statusFilter = params.status;
  const supabase = createAdminClient();

  let query = supabase
    .from('orders')
    .select(`
      id, order_number, status, payment_status, total_amount_aed,
      scheduled_date, scheduled_time_slot, assigned_technician_id, created_at,
      profiles!orders_customer_id_fkey(full_name, phone),
      services(name_en),
      areas(name_en)
    `)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })
    .limit(50);

  if (statusFilter && statusFilter !== 'all') {
    query = query.eq('status', statusFilter);
  }

  const { data: orders } = await query;

  // Get technician names separately
  const techIds = (orders ?? [])
    .map((o: Record<string, unknown>) => o.assigned_technician_id as string | null)
    .filter((id): id is string => !!id);

  let techMap = new Map<string, string>();
  if (techIds.length > 0) {
    const { data: techs } = await supabase
      .from('profiles')
      .select('id, full_name')
      .in('id', [...new Set(techIds)]);
    for (const t of techs ?? []) {
      techMap.set(t.id, t.full_name);
    }
  }

  const orderList = orders ?? [];
  const activeFilter = statusFilter ?? 'all';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Orders</h1>
          <p className="text-sm text-muted-foreground">{orderList.length} orders shown</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/api/v1/admin/export/orders"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
          >
            <Download className="h-4 w-4" /> Export
          </Link>
        </div>
      </div>

      {/* Filters — client component with working links */}
      <OrderFilters active={activeFilter} />

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
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orderList.length === 0 && (
              <tr>
                <td colSpan={10} className="px-4 py-8 text-center text-muted-foreground">
                  No orders found{statusFilter ? ` with status "${statusFilter}"` : ''}
                </td>
              </tr>
            )}
            {orderList.map((o: Record<string, unknown>) => {
              const customer = o.profiles as Record<string, string> | null;
              const service = o.services as Record<string, string> | null;
              const area = o.areas as Record<string, string> | null;
              const techName = o.assigned_technician_id
                ? techMap.get(o.assigned_technician_id as string)
                : null;

              return (
                <tr key={o.id as string} className="border-b border-border last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <Link href={`/admin/orders/${o.id}`} className="font-medium text-accent hover:underline">
                      {o.order_number as string}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-foreground">{customer?.full_name ?? 'Unknown'}</p>
                      <p className="text-xs text-muted-foreground">{customer?.phone ?? ''}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-foreground">{service?.name_en ?? '—'}</td>
                  <td className="px-4 py-3 text-muted-foreground">{area?.name_en ?? '—'}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    <div>
                      <p>{o.scheduled_date as string}</p>
                      <p className="text-xs">{o.scheduled_time_slot as string}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-foreground">
                    {techName ?? <span className="font-medium text-destructive">Unassigned</span>}
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={o.status as string} /></td>
                  <td className="px-4 py-3"><PaymentBadge status={(o.payment_status as string) ?? 'pending'} /></td>
                  <td className="px-4 py-3 text-right font-medium text-foreground">
                    AED {Number(o.total_amount_aed).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/admin/orders/${o.id}`} className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-accent hover:bg-muted">
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
