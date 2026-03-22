import { Shield } from 'lucide-react';

const plans = [
  { tier: 'Essential', subs: 12, active: 10, expiring: 2, revenue: 9480, responseTime: '24h', discount: '5%' },
  { tier: 'Standard', subs: 18, active: 15, expiring: 3, revenue: 32220, responseTime: '8h', discount: '10%' },
  { tier: 'Premium', subs: 8, active: 7, expiring: 1, revenue: 23880, responseTime: '4h', discount: '15%' },
  { tier: 'VIP', subs: 4, active: 4, expiring: 0, revenue: 21560, responseTime: '2h', discount: '20%' },
];

export default function CarePlansAdminPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Care Plans</h1>
        <p className="text-sm text-muted-foreground">Manage care plans and subscriptions</p>
      </div>

      {/* Plan Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {plans.map((p) => (
          <div key={p.tier} className="rounded-xl border border-border bg-card p-5">
            <div className="mb-3 flex items-center gap-2">
              <Shield className="h-5 w-5 text-accent" />
              <h3 className="font-semibold text-foreground">{p.tier}</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subscriptions</span>
                <span className="font-medium text-foreground">{p.subs}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Active</span>
                <span className="font-medium text-green-600">{p.active}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Expiring (30d)</span>
                <span className="font-medium text-yellow-600">{p.expiring}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Monthly Revenue</span>
                <span className="font-medium text-foreground">AED {p.revenue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Response SLA</span>
                <span className="font-medium text-foreground">{p.responseTime}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Total stats */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="mb-4 font-semibold text-foreground">Subscription Overview</h3>
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-foreground">42</p>
            <p className="text-xs text-muted-foreground">Total Subscriptions</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">36</p>
            <p className="text-xs text-muted-foreground">Active</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-yellow-600">6</p>
            <p className="text-xs text-muted-foreground">Expiring Soon</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">AED 87,140</p>
            <p className="text-xs text-muted-foreground">Monthly Revenue</p>
          </div>
        </div>
      </div>
    </div>
  );
}
