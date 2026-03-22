import Link from 'next/link';
import { Plus, Download, Filter } from 'lucide-react';

const orders = [
  { id: 'LH-2026-00042', customer: 'Sarah M.', phone: '+971501234567', service: 'Deep Cleaning - 2BR', area: 'Dubai Marina', date: '2026-03-22', time: '10:00-12:00', technician: 'Ali H.', status: 'confirmed', payment: 'captured', total: 850 },
  { id: 'LH-2026-00041', customer: 'Ahmed K.', phone: '+971502345678', service: 'AC Service (x3)', area: 'Downtown Dubai', date: '2026-03-22', time: '14:00-16:00', technician: 'Omar M.', status: 'assigned', payment: 'captured', total: 360 },
  { id: 'LH-2026-00040', customer: 'Marina R.', phone: '+971503456789', service: 'Pest Control - 3BR', area: 'Palm Jumeirah', date: '2026-03-22', time: '08:00-10:00', technician: 'Raj P.', status: 'in_progress', payment: 'captured', total: 380 },
  { id: 'LH-2026-00039', customer: 'John D.', phone: '+971504567890', service: 'Plumbing - Standard', area: 'JBR', date: '2026-03-21', time: '16:00-18:00', technician: 'Hassan S.', status: 'completed', payment: 'captured', total: 300 },
  { id: 'LH-2026-00038', customer: 'Fatima A.', phone: '+971505678901', service: 'Regular Cleaning', area: 'Business Bay', date: '2026-03-21', time: '10:00-12:00', technician: 'Priya K.', status: 'completed', payment: 'captured', total: 152 },
  { id: 'LH-2026-00037', customer: 'Wei Z.', phone: '+971506789012', service: 'AC Deep Clean', area: 'JLT', date: '2026-03-21', time: '14:00-16:00', technician: 'Ali H.', status: 'pending', payment: 'pending', total: 280 },
  { id: 'LH-2026-00036', customer: 'Elena V.', phone: '+971507890123', service: 'Painting - 1BR', area: 'Dubai Marina', date: '2026-03-23', time: '08:00-10:00', technician: null, status: 'pending', payment: 'pending', total: 1200 },
];

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
    captured: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
  };
  return (
    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${colors[status] || 'bg-gray-100 text-gray-800'}`}>
      {status}
    </span>
  );
}

export default function OrdersPage() {
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
            {orders.map((o) => (
              <tr key={o.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                <td className="px-4 py-3">
                  <Link href={`/admin/orders/${o.id}`} className="font-medium text-accent hover:underline">{o.id}</Link>
                </td>
                <td className="px-4 py-3">
                  <div>
                    <p className="font-medium text-foreground">{o.customer}</p>
                    <p className="text-xs text-muted-foreground">{o.phone}</p>
                  </div>
                </td>
                <td className="px-4 py-3 text-foreground">{o.service}</td>
                <td className="px-4 py-3 text-muted-foreground">{o.area}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  <div>
                    <p>{o.date}</p>
                    <p className="text-xs">{o.time}</p>
                  </div>
                </td>
                <td className="px-4 py-3 text-foreground">{o.technician || <span className="text-destructive font-medium">Unassigned</span>}</td>
                <td className="px-4 py-3"><StatusBadge status={o.status} /></td>
                <td className="px-4 py-3"><PaymentBadge status={o.payment} /></td>
                <td className="px-4 py-3 text-right font-medium text-foreground">AED {o.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
