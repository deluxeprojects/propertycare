import { Shield } from 'lucide-react';
import { createAdminClient } from '@/lib/supabase/admin';

export default async function CarePlansAdminPage() {
  const supabase = createAdminClient();

  const { data: plans } = await supabase
    .from('amc_plans')
    .select(`
      id,
      name_en,
      tier,
      response_time_hours,
      discount_on_extras_pct,
      is_active
    `)
    .order('priority_level', { ascending: true });

  // Get subscription counts per plan
  const { data: subscriptions } = await supabase
    .from('amc_subscriptions')
    .select('id, plan_id, status, end_date, billing_cycle, total_paid_aed');

  const subList = subscriptions ?? [];

  // Calculate 30 days from now for "expiring soon"
  const now = new Date();
  const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  const thirtyDaysStr = thirtyDaysFromNow.toISOString().slice(0, 10);
  const todayStr = now.toISOString().slice(0, 10);

  type PlanStats = { subs: number; active: number; expiring: number; revenue: number };
  const planStats: Record<string, PlanStats> = {};

  for (const sub of subList) {
    const pid = sub.plan_id;
    if (!planStats[pid]) {
      planStats[pid] = { subs: 0, active: 0, expiring: 0, revenue: 0 };
    }
    planStats[pid].subs += 1;
    if (sub.status === 'active') {
      planStats[pid].active += 1;
      // Check if expiring within 30 days
      if (sub.end_date && sub.end_date <= thirtyDaysStr && sub.end_date >= todayStr) {
        planStats[pid].expiring += 1;
      }
    }
    planStats[pid].revenue += Number(sub.total_paid_aed ?? 0);
  }

  const planList = plans ?? [];

  // Totals
  const totalSubs = Object.values(planStats).reduce((s, p) => s + p.subs, 0);
  const totalActive = Object.values(planStats).reduce((s, p) => s + p.active, 0);
  const totalExpiring = Object.values(planStats).reduce((s, p) => s + p.expiring, 0);
  const totalRevenue = Object.values(planStats).reduce((s, p) => s + p.revenue, 0);

  function formatResponseTime(hours: number) {
    if (hours < 1) return `${hours * 60}m`;
    return `${hours}h`;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Care Plans</h1>
        <p className="text-sm text-muted-foreground">Manage care plans and subscriptions</p>
      </div>

      {/* Plan Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {planList.length === 0 && (
          <div className="col-span-full rounded-xl border border-border bg-card p-5 text-center text-muted-foreground">
            No care plans found
          </div>
        )}
        {planList.map((p: any) => {
          const stats = planStats[p.id] ?? { subs: 0, active: 0, expiring: 0, revenue: 0 };
          return (
            <div key={p.id} className="rounded-xl border border-border bg-card p-5">
              <div className="mb-3 flex items-center gap-2">
                <Shield className="h-5 w-5 text-accent" />
                <h3 className="font-semibold text-foreground">{p.name_en}</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subscriptions</span>
                  <span className="font-medium text-foreground">{stats.subs}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Active</span>
                  <span className="font-medium text-green-600">{stats.active}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Expiring (30d)</span>
                  <span className="font-medium text-yellow-600">{stats.expiring}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Revenue</span>
                  <span className="font-medium text-foreground">AED {stats.revenue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Response SLA</span>
                  <span className="font-medium text-foreground">{formatResponseTime(p.response_time_hours)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Total stats */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="mb-4 font-semibold text-foreground">Subscription Overview</h3>
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-foreground">{totalSubs}</p>
            <p className="text-xs text-muted-foreground">Total Subscriptions</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">{totalActive}</p>
            <p className="text-xs text-muted-foreground">Active</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-yellow-600">{totalExpiring}</p>
            <p className="text-xs text-muted-foreground">Expiring Soon</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">AED {totalRevenue.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Total Revenue</p>
          </div>
        </div>
      </div>
    </div>
  );
}
