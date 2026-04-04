import { siteConfig } from '@/config/site';
import { createAdminClient } from '@/lib/supabase/admin';
import {
  DollarSign,
  ShoppingCart,
  Clock,
  Users,
  Shield,
  Star,
  AlertTriangle,
} from 'lucide-react';

interface RecentOrder {
  id: string;
  order_number: string;
  total_amount_aed: number;
  status: string;
  created_at: string;
  profiles: { full_name: string }[];
  services: { name_en: string }[];
}

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
      {status.replace(/_/g, ' ')}
    </span>
  );
}

function formatAED(amount: number): string {
  return `AED ${amount.toLocaleString('en-AE', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

export default async function AdminDashboard() {
  const supabase = createAdminClient();

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayISO = todayStart.toISOString();

  const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();

  // Run all queries in parallel
  const [
    todayOrdersRes,
    pendingOrdersRes,
    activeTechniciansRes,
    activeCarePlansRes,
    avgRatingRes,
    recentOrdersRes,
    unassignedAlertsRes,
    lowRatingAlertsRes,
  ] = await Promise.all([
    // Today's orders + revenue
    supabase
      .from('orders')
      .select('total_amount_aed')
      .gte('created_at', todayISO)
      .is('deleted_at', null)
      .not('status', 'in', '("cancelled","refunded")'),

    // Pending orders count
    supabase
      .from('orders')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'pending')
      .is('deleted_at', null),

    // Active technicians
    supabase
      .from('technicians')
      .select('id', { count: 'exact', head: true })
      .eq('is_available', true),

    // Active care plan subscriptions
    supabase
      .from('amc_subscriptions')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'active'),

    // Average rating from completed orders
    supabase
      .from('orders')
      .select('rating')
      .eq('status', 'completed')
      .not('rating', 'is', null)
      .is('deleted_at', null),

    // Recent 10 orders
    supabase
      .from('orders')
      .select(`
        id,
        order_number,
        total_amount_aed,
        status,
        created_at,
        profiles!orders_customer_id_fkey(full_name),
        services(name_en)
      `)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .limit(10),

    // Unassigned orders older than 2 hours
    supabase
      .from('orders')
      .select('order_number, created_at')
      .is('assigned_technician_id', null)
      .in('status', ['pending', 'confirmed'])
      .is('deleted_at', null)
      .lt('created_at', twoHoursAgo)
      .order('created_at', { ascending: true })
      .limit(5),

    // Low-rated orders (rating <= 2)
    supabase
      .from('orders')
      .select('order_number, rating')
      .lte('rating', 2)
      .is('deleted_at', null)
      .order('updated_at', { ascending: false })
      .limit(5),
  ]);

  // Calculate KPIs
  const todayOrders = todayOrdersRes.data ?? [];
  const todayOrderCount = todayOrders.length;
  const todayRevenue = todayOrders.reduce(
    (sum, o) => sum + Number(o.total_amount_aed ?? 0),
    0
  );
  const pendingCount = pendingOrdersRes.count ?? 0;
  const activeTechCount = activeTechniciansRes.count ?? 0;
  const activeCarePlanCount = activeCarePlansRes.count ?? 0;

  const ratedOrders = avgRatingRes.data ?? [];
  const avgRating =
    ratedOrders.length > 0
      ? (
          ratedOrders.reduce((sum, o) => sum + Number(o.rating), 0) /
          ratedOrders.length
        ).toFixed(1)
      : 'N/A';

  const recentOrders = recentOrdersRes.data ?? [];

  // Build alerts
  const alerts: { type: string; message: string }[] = [];
  const unassigned = unassignedAlertsRes.data ?? [];
  for (const o of unassigned) {
    const hoursAgo = Math.round(
      (Date.now() - new Date(o.created_at).getTime()) / (1000 * 60 * 60)
    );
    alerts.push({
      type: 'error',
      message: `Order ${o.order_number} unassigned for ${hoursAgo} hours`,
    });
  }
  const lowRated = lowRatingAlertsRes.data ?? [];
  for (const o of lowRated) {
    alerts.push({
      type: 'warning',
      message: `Order ${o.order_number} rated ${o.rating}/5 -- review needed`,
    });
  }

  const kpis = [
    {
      label: 'Today Revenue',
      value: formatAED(todayRevenue),
      icon: DollarSign,
    },
    {
      label: 'Today Orders',
      value: String(todayOrderCount),
      icon: ShoppingCart,
    },
    {
      label: 'Pending Orders',
      value: String(pendingCount),
      icon: Clock,
    },
    {
      label: 'Active Technicians',
      value: String(activeTechCount),
      icon: Users,
    },
    {
      label: 'Active Care Plans',
      value: String(activeCarePlanCount),
      icon: Shield,
    },
    {
      label: 'Avg Rating',
      value: avgRating,
      icon: Star,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Welcome to {siteConfig.name} Admin
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            className="rounded-xl border border-border bg-card p-4"
          >
            <div className="flex items-center justify-between">
              <kpi.icon className="h-5 w-5 text-muted-foreground" />
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
                {recentOrders.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                      No orders yet
                    </td>
                  </tr>
                )}
                {recentOrders.map((order: RecentOrder) => (
                  <tr
                    key={order.id}
                    className="border-b border-border last:border-0"
                  >
                    <td className="px-6 py-3 font-medium text-foreground">
                      {order.order_number}
                    </td>
                    <td className="px-6 py-3 text-foreground">
                      {order.profiles?.[0]?.full_name ?? 'Unknown'}
                    </td>
                    <td className="px-6 py-3 text-muted-foreground">
                      {order.services?.[0]?.name_en ?? 'Unknown'}
                    </td>
                    <td className="px-6 py-3">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-6 py-3 text-right font-medium text-foreground">
                      {formatAED(Number(order.total_amount_aed))}
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
            {alerts.length === 0 && (
              <p className="px-3 py-4 text-center text-sm text-muted-foreground">
                No alerts right now
              </p>
            )}
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
                {alert.type === 'error' ? (
                  <AlertTriangle className="mt-0.5 h-4 w-4 text-red-600" />
                ) : (
                  <Star className="mt-0.5 h-4 w-4 text-yellow-600" />
                )}
                <p className="text-sm text-foreground">{alert.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
