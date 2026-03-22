import { DollarSign, FileText, CreditCard, Users, Receipt } from 'lucide-react';

const kpis = [
  { label: 'Today', value: 'AED 12,450', change: '+12%', icon: DollarSign },
  { label: 'This Week', value: 'AED 68,200', change: '+8%', icon: DollarSign },
  { label: 'This Month', value: 'AED 245,800', change: '+15%', icon: DollarSign },
  { label: 'YTD', value: 'AED 892,400', change: '+22%', icon: DollarSign },
];

const recentInvoices = [
  { number: 'INV-2026-00089', customer: 'Sarah M.', service: 'Deep Cleaning - 2BR', total: 892.50, status: 'paid' },
  { number: 'INV-2026-00088', customer: 'Ahmed K.', service: 'AC Service (x3)', total: 378.00, status: 'paid' },
  { number: 'INV-2026-00087', customer: 'Marina R.', service: 'Pest Control - 3BR', total: 399.00, status: 'sent' },
  { number: 'INV-2026-00086', customer: 'John D.', service: 'Plumbing - Standard', total: 315.00, status: 'paid' },
  { number: 'INV-2026-00085', customer: 'Wei Z.', service: 'AC Deep Clean', total: 294.00, status: 'draft' },
];

export default function FinancialsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Financials</h1>
        <p className="text-sm text-muted-foreground">Revenue, invoices, and financial reports</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-lg bg-muted p-1">
        {['Revenue', 'Invoices', 'Payments', 'Payroll', 'VAT Report'].map((tab, i) => (
          <button key={tab} className={`rounded-md px-4 py-2 text-sm font-medium ${i === 0 ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
            {tab}
          </button>
        ))}
      </div>

      {/* Revenue KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <kpi.icon className="h-5 w-5 text-muted-foreground" />
              <span className="text-xs font-medium text-green-600">{kpi.change}</span>
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
                <th className="px-6 py-3 text-left font-medium text-muted-foreground">Service</th>
                <th className="px-6 py-3 text-right font-medium text-muted-foreground">Total</th>
                <th className="px-6 py-3 text-center font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentInvoices.map((inv) => (
                <tr key={inv.number} className="border-b border-border last:border-0">
                  <td className="px-6 py-3 font-medium text-accent">{inv.number}</td>
                  <td className="px-6 py-3 text-foreground">{inv.customer}</td>
                  <td className="px-6 py-3 text-muted-foreground">{inv.service}</td>
                  <td className="px-6 py-3 text-right font-medium text-foreground">AED {inv.total.toFixed(2)}</td>
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
    </div>
  );
}
