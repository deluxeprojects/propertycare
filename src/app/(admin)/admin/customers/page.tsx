import { Users, Download } from 'lucide-react';

const customers = [
  { name: 'Sarah M.', email: 'sarah@example.com', phone: '+971501234567', area: 'Dubai Marina', orders: 8, spent: 4250, lastOrder: '2026-03-22', amc: 'Premium', wallet: 150 },
  { name: 'Ahmed K.', email: 'ahmed@example.com', phone: '+971502345678', area: 'Downtown Dubai', orders: 12, spent: 6800, lastOrder: '2026-03-22', amc: null, wallet: 0 },
  { name: 'Marina R.', email: 'marina@example.com', phone: '+971503456789', area: 'Palm Jumeirah', orders: 15, spent: 12500, lastOrder: '2026-03-22', amc: 'VIP', wallet: 500 },
  { name: 'John D.', email: 'john@example.com', phone: '+971504567890', area: 'JBR', orders: 3, spent: 950, lastOrder: '2026-03-21', amc: null, wallet: 50 },
  { name: 'Fatima A.', email: 'fatima@example.com', phone: '+971505678901', area: 'Business Bay', orders: 6, spent: 2100, lastOrder: '2026-03-21', amc: 'Essential', wallet: 0 },
  { name: 'Wei Z.', email: 'wei@example.com', phone: '+971506789012', area: 'JLT', orders: 2, spent: 560, lastOrder: '2026-03-21', amc: null, wallet: 0 },
];

export default function CustomersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Customers</h1>
          <p className="text-sm text-muted-foreground">{customers.length} total customers</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-muted">
          <Download className="h-4 w-4" /> Export CSV
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Customer</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Area</th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">Orders</th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">Total Spent</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Last Order</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Care Plan</th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">Wallet</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.email} className="border-b border-border last:border-0 hover:bg-muted/30">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                      {c.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{c.name}</p>
                      <p className="text-xs text-muted-foreground">{c.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{c.area}</td>
                <td className="px-4 py-3 text-right text-foreground">{c.orders}</td>
                <td className="px-4 py-3 text-right font-medium text-foreground">AED {c.spent.toLocaleString()}</td>
                <td className="px-4 py-3 text-muted-foreground">{c.lastOrder}</td>
                <td className="px-4 py-3">
                  {c.amc ? (
                    <span className="rounded-full bg-accent/10 px-2 py-1 text-xs font-medium text-accent">{c.amc}</span>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right text-foreground">AED {c.wallet}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
