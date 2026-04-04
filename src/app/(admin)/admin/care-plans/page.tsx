import Link from 'next/link';
import { Shield } from 'lucide-react';
import { createAdminClient } from '@/lib/supabase/admin';
import { AdminTabs } from '@/features/admin/components/AdminTabs';

interface AmcPlan {
  id: string;
  name_en: string;
  tier: string;
  response_time_hours: number;
  discount_on_extras_pct: number;
  is_active: boolean;
  priority_level: number;
}

interface AmcSubscription {
  id: string;
  plan_id: string;
  customer_id: string;
  status: string;
  start_date: string | null;
  end_date: string | null;
  billing_cycle: string | null;
  total_paid_aed: number | null;
  profiles: { full_name: string; email: string }[];
  amc_plans: { name_en: string; tier: string }[];
}

const planTypes = [
  {
    slug: 'ac',
    name: 'AC Care Plan',
    description: 'Annual AC service contract',
    includes: ['2-4 AC services/year', 'Filter replacement', 'Duct inspection'],
    fromPrice: 99,
    icon: '❄️',
  },
  {
    slug: 'cleaning',
    name: 'Cleaning Care Plan',
    description: 'Regular scheduled cleaning',
    includes: ['Weekly/biweekly/monthly options', 'Supplies included'],
    fromPrice: 149,
    icon: '✨',
  },
  {
    slug: 'pest',
    name: 'Pest Care Plan',
    description: 'Year-round pest prevention',
    includes: ['Quarterly treatments', 'Emergency callouts', 'Follow-ups'],
    fromPrice: 79,
    icon: '🛡️',
  },
  {
    slug: 'housekeeping',
    name: 'Housekeeping Care Plan',
    description: 'Full housekeeping service',
    includes: ['Cleaning + linen change + towel refresh + amenity restock'],
    idealFor: 'Holiday homes, Airbnb, short-term rentals',
    fromPrice: 299,
    icon: '🏠',
  },
  {
    slug: 'garden',
    name: 'Garden Care Plan',
    description: 'Villa garden maintenance',
    includes: ['Weekly/biweekly visits', 'Plant care', 'Lawn mowing', 'Irrigation check'],
    fromPrice: 199,
    icon: '🌿',
  },
  {
    slug: 'pool',
    name: 'Pool Care Plan',
    description: 'Swimming pool maintenance',
    includes: ['Chemical balancing', 'Skimming', 'Filter cleaning', 'Equipment check'],
    fromPrice: 249,
    icon: '🏊',
  },
  {
    slug: 'maintenance',
    name: 'Maintenance Care Plan',
    description: 'General property maintenance',
    includes: ['Plumbing + electrical + handyman hours', 'Priority response'],
    fromPrice: 119,
    icon: '🔧',
  },
  {
    slug: 'total',
    name: 'Total Care Plan',
    description: 'Everything bundled',
    includes: ['AC + cleaning + pest + maintenance', 'Priority support'],
    fromPrice: 449,
    icon: '⭐',
  },
];

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
      is_active,
      priority_level
    `)
    .order('priority_level', { ascending: true });

  const { data: subscriptions } = await supabase
    .from('amc_subscriptions')
    .select(`
      id,
      plan_id,
      customer_id,
      status,
      start_date,
      end_date,
      billing_cycle,
      total_paid_aed,
      profiles(full_name, email),
      amc_plans(name_en, tier)
    `)
    .order('start_date', { ascending: false });

  const subList = subscriptions ?? [];
  const planList = plans ?? [];

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
      if (sub.end_date && sub.end_date <= thirtyDaysStr && sub.end_date >= todayStr) {
        planStats[pid].expiring += 1;
      }
    }
    planStats[pid].revenue += Number(sub.total_paid_aed ?? 0);
  }

  const totalActive = subList.filter((s: AmcSubscription) => s.status === 'active').length;
  const totalRevenue = subList.reduce((s: number, sub: AmcSubscription) => s + Number(sub.total_paid_aed ?? 0), 0);

  function formatResponseTime(hours: number) {
    if (hours < 1) return `${hours * 60}m`;
    return `${hours}h`;
  }

  const planTypesTab = (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {planTypes.length} care plan types available for customers
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {planTypes.map((pt) => (
          <div key={pt.slug} className="rounded-xl border border-border bg-card p-5">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{pt.icon}</span>
                <div>
                  <h3 className="font-semibold text-foreground">{pt.name}</h3>
                  <p className="text-xs text-muted-foreground">{pt.description}</p>
                </div>
              </div>
              <span
                title="Plan type editing coming soon"
                className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground opacity-50 cursor-not-allowed"
              >
                Edit
              </span>
            </div>
            <div className="mb-3 space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Includes</p>
              <ul className="space-y-1">
                {pt.includes.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-foreground">
                    <span className="mt-1 block h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            {pt.idealFor && (
              <p className="mb-3 text-xs text-muted-foreground">
                <span className="font-medium">Ideal for:</span> {pt.idealFor}
              </p>
            )}
            <div className="border-t border-border pt-3">
              <p className="text-sm font-semibold text-accent">From AED {pt.fromPrice}/mo</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const bundledTiersTab = (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {planList.length === 0 && (
          <div className="col-span-full rounded-xl border border-border bg-card p-5 text-center text-muted-foreground">
            No bundled tiers found in database
          </div>
        )}
        {planList.map((p: AmcPlan) => {
          const stats = planStats[p.id] ?? { subs: 0, active: 0, expiring: 0, revenue: 0 };
          return (
            <div key={p.id} className="rounded-xl border border-border bg-card p-5">
              <div className="mb-3 flex items-center gap-2">
                <Shield className="h-5 w-5 text-accent" />
                <h3 className="font-semibold text-foreground">{p.name_en}</h3>
                {!p.is_active && (
                  <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">Inactive</span>
                )}
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
                {p.discount_on_extras_pct > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Extras Discount</span>
                    <span className="font-medium text-foreground">{p.discount_on_extras_pct}%</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Totals */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="mb-4 font-semibold text-foreground">Subscription Overview</h3>
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-foreground">{subList.length}</p>
            <p className="text-xs text-muted-foreground">Total Subscriptions</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">{totalActive}</p>
            <p className="text-xs text-muted-foreground">Active</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-yellow-600">
              {Object.values(planStats).reduce((s, p) => s + p.expiring, 0)}
            </p>
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

  const subscriptionsTab = (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">{subList.length} subscriptions total</p>
      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Customer</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Plan</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Billing</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Start</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">End</th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">Paid</th>
            </tr>
          </thead>
          <tbody>
            {subList.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                  No subscriptions found
                </td>
              </tr>
            )}
            {subList.map((sub: AmcSubscription) => {
              const statusColors: Record<string, string> = {
                active: 'bg-green-100 text-green-700',
                expired: 'bg-red-100 text-red-700',
                cancelled: 'bg-gray-100 text-gray-600',
                pending: 'bg-yellow-100 text-yellow-700',
              };
              const statusClass = statusColors[sub.status] ?? 'bg-muted text-muted-foreground';

              return (
                <tr key={sub.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <div>
                      <Link
                        href={`/admin/customers/${sub.customer_id}`}
                        className="font-medium text-accent hover:underline"
                      >
                        {sub.profiles?.[0]?.full_name ?? 'Unknown'}
                      </Link>
                      <p className="text-xs text-muted-foreground">{sub.profiles?.[0]?.email ?? ''}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-foreground">
                    {sub.amc_plans?.[0]?.name_en ?? sub.amc_plans?.[0]?.tier ?? '—'}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-1 text-xs font-medium ${statusClass}`}>
                      {sub.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 capitalize text-muted-foreground">
                    {sub.billing_cycle ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {sub.start_date?.slice(0, 10) ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {sub.end_date?.slice(0, 10) ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-foreground">
                    AED {Number(sub.total_paid_aed ?? 0).toLocaleString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Care Plans</h1>
        <p className="text-sm text-muted-foreground">
          Manage care plan types, bundled tiers, and subscriptions
        </p>
      </div>

      <AdminTabs
        tabs={[
          { label: 'Plan Types', content: planTypesTab },
          { label: 'Bundled Tiers', content: bundledTiersTab },
          { label: 'Subscriptions', content: subscriptionsTab },
        ]}
      />
    </div>
  );
}
