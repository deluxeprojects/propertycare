import { Plus, Tag } from 'lucide-react';

const promos = [
  { code: 'WELCOME20', name: 'Welcome Discount', type: 'percentage', value: '20%', maxDiscount: 'AED 200', usage: '45/∞', validUntil: '2027-12-31', status: 'active', firstOnly: true },
  { code: 'SUMMER2026', name: 'Summer Special', type: 'percentage', value: '15%', maxDiscount: 'AED 150', usage: '12/500', validUntil: '2026-08-31', status: 'active', firstOnly: false },
  { code: 'MARINA10', name: 'Marina Area Discount', type: 'fixed', value: 'AED 50', maxDiscount: '-', usage: '8/100', validUntil: '2026-12-31', status: 'active', firstOnly: false },
  { code: 'FIRSTORDER', name: 'Free Balcony Clean', type: 'free_addon', value: 'Balcony cleaning', maxDiscount: '-', usage: '23/∞', validUntil: '2027-12-31', status: 'active', firstOnly: true },
  { code: 'REFER50', name: 'Referral Reward', type: 'fixed', value: 'AED 50', maxDiscount: '-', usage: '15/∞', validUntil: '2027-12-31', status: 'active', firstOnly: false },
];

export default function PromosPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Promotions</h1>
          <p className="text-sm text-muted-foreground">Manage discount codes and offers</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-accent/90">
          <Plus className="h-4 w-4" /> Create Promo
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Code</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Name</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Type</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Value</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Usage</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Valid Until</th>
              <th className="px-4 py-3 text-center font-medium text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody>
            {promos.map((p) => (
              <tr key={p.code} className="border-b border-border last:border-0 hover:bg-muted/30">
                <td className="px-4 py-3"><span className="rounded bg-muted px-2 py-1 font-mono text-xs font-bold text-foreground">{p.code}</span></td>
                <td className="px-4 py-3 font-medium text-foreground">
                  {p.name}
                  {p.firstOnly && <span className="ml-2 rounded-full bg-blue-100 px-1.5 py-0.5 text-[10px] text-blue-800">1st order</span>}
                </td>
                <td className="px-4 py-3"><span className="rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground">{p.type.replace('_', ' ')}</span></td>
                <td className="px-4 py-3 font-medium text-foreground">{p.value}</td>
                <td className="px-4 py-3 text-muted-foreground">{p.usage}</td>
                <td className="px-4 py-3 text-muted-foreground">{p.validUntil}</td>
                <td className="px-4 py-3 text-center"><span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">{p.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
