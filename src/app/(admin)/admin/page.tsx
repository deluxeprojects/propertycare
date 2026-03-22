import { siteConfig } from '@/config/site';
import {
  DollarSign,
  ShoppingCart,
  Clock,
  Users,
  Shield,
  Star,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
} from 'lucide-react';

const kpis = [
  {
    label: 'Today Revenue',
    value: 'AED 12,450',
    change: '+12%',
    trend: 'up',
    icon: DollarSign,
  },
  {
    label: 'Today Orders',
    value: '18',
    change: '+5%',
    trend: 'up',
    icon: ShoppingCart,
  },
  {
    label: 'Pending Orders',
    value: '6',
    change: '-2',
    trend: 'down',
    icon: Clock,
  },
  {
    label: 'Active Technicians',
    value: '7',
    change: '0',
    trend: 'neutral',
    icon: Users,
  },
  {
    label: 'Active Care Plans',
    value: '24',
    change: '+3',
    trend: 'up',
    icon: Shield,
  },
  {
    label: 'Avg Rating',
    value: '4.8',
    change: '+0.1',
    trend: 'up',
    icon: Star,
  },
];

const recentOrders = [
  {
    id: 'LH-2026-00042',
    customer: 'Sarah M.',
    service: 'Deep Cleaning - 2BR',
    area: 'Dubai Marina',
    date: '2026-03-22',
    time: '10:00-12:00',
    status: 'confirmed',
    total: 'AED 850',
  },
  {
    id: 'LH-2026-00041',
    customer: 'Ahmed K.',
    service: 'AC Service (x3)',
    area: 'Downtown Dubai',
    date: '2026-03-22',
    time: '14:00-16:00',
    status: 'assigned',
    total: 'AED 360',
  },
  {
    id: 'LH-2026-00040',
    customer: 'Marina R.',
    service: 'Pest Control - 3BR',
    area: 'Palm Jumeirah',
    date: '2026-03-22',
    time: '08:00-10:00',
    status: 'in_progress',
    total: 'AED 380',
  },
  {
    id: 'LH-2026-00039',
    customer: 'John D.',
    service: 'Plumbing - Standard',
    area: 'JBR',
    date: '2026-03-21',
    time: '16:00-18:00',
    status: 'completed',
    total: 'AED 300',
  },
  {
    id: 'LH-2026-00038',
    customer: 'Fatima A.',
    service: 'Regular Cleaning',
    area: 'Business Bay',
    date: '2026-03-21',
    time: '10:00-12:00',
    status: 'completed',
    total: 'AED 152',
  },
];

const alerts = [
  {
    type: 'error',
    message: 'Order LH-2026-00036 unassigned for 3 hours',
    icon: AlertTriangle,
  },
  {
    type: 'warning',
    message: 'Order LH-2026-00035 rated 2/5 — review needed',
    icon: Star,
  },
  {
    type: 'info',
    message: '3 Care Plan subscriptions expiring in 14 days',
    icon: Shield,
  },
];

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    assigned: 'bg-purple-100 text-purple-800',
    in_transit: 'bg-indigo-100 text-indigo-800',
    in_progress: 'bg-cyan-100 text-cyan-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  return (
    <span
      className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${colors[status] || 'bg-gray-100 text-gray-800'}`}
    >
      {status.replace('_', ' ')}
    </span>
  );
}

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Welcome to {siteConfig.name} Admin
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            className="rounded-xl border border-border bg-card p-4"
          >
            <div className="flex items-center justify-between">
              <kpi.icon className="h-5 w-5 text-muted-foreground" />
              <span
                className={`flex items-center text-xs font-medium ${
                  kpi.trend === 'up'
                    ? 'text-green-600'
                    : kpi.trend === 'down'
                      ? 'text-red-600'
                      : 'text-muted-foreground'
                }`}
              >
                {kpi.trend === 'up' && (
                  <TrendingUp className="mr-1 h-3 w-3" />
                )}
                {kpi.trend === 'down' && (
                  <TrendingDown className="mr-1 h-3 w-3" />
                )}
                {kpi.change}
              </span>
            </div>
            <p className="mt-2 text-2xl font-bold text-foreground">
              {kpi.value}
            </p>
            <p className="text-xs text-muted-foreground">{kpi.label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Orders */}
        <div className="col-span-2 rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <h2 className="font-semibold text-foreground">Recent Orders</h2>
            <a
              href="/admin/orders"
              className="text-sm text-accent hover:underline"
            >
              View all
            </a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-6 py-3 text-left font-medium text-muted-foreground">
                    Order
                  </th>
                  <th className="px-6 py-3 text-left font-medium text-muted-foreground">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left font-medium text-muted-foreground">
                    Service
                  </th>
                  <th className="px-6 py-3 text-left font-medium text-muted-foreground">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right font-medium text-muted-foreground">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-border last:border-0"
                  >
                    <td className="px-6 py-3 font-medium text-foreground">
                      {order.id}
                    </td>
                    <td className="px-6 py-3 text-foreground">
                      {order.customer}
                    </td>
                    <td className="px-6 py-3 text-muted-foreground">
                      {order.service}
                    </td>
                    <td className="px-6 py-3">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-6 py-3 text-right font-medium text-foreground">
                      {order.total}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Alerts */}
        <div className="rounded-xl border border-border bg-card">
          <div className="border-b border-border px-6 py-4">
            <h2 className="font-semibold text-foreground">Alerts</h2>
          </div>
          <div className="space-y-1 p-3">
            {alerts.map((alert, i) => (
              <div
                key={i}
                className={`flex items-start gap-3 rounded-lg p-3 ${
                  alert.type === 'error'
                    ? 'bg-red-50'
                    : alert.type === 'warning'
                      ? 'bg-yellow-50'
                      : 'bg-blue-50'
                }`}
              >
                <alert.icon
                  className={`mt-0.5 h-4 w-4 ${
                    alert.type === 'error'
                      ? 'text-red-600'
                      : alert.type === 'warning'
                        ? 'text-yellow-600'
                        : 'text-blue-600'
                  }`}
                />
                <p className="text-sm text-foreground">{alert.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
