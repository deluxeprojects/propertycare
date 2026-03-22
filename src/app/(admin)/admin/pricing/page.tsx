import { Plus } from 'lucide-react';
import { PriceSimulator } from '@/features/admin/components/PriceSimulator';

const rules = [
  { name: 'Weekend Surcharge', type: 'time_surcharge', applies: 'All services', modifier: '+15%', priority: 10, stackable: false, active: true },
  { name: 'Evening Surcharge (6-10 PM)', type: 'time_surcharge', applies: 'All services', modifier: '+10%', priority: 5, stackable: true, active: true },
  { name: 'Marina Premium', type: 'area_multiplier', applies: 'Dubai Marina', modifier: '+10%', priority: 3, stackable: true, active: true },
  { name: 'Palm Jumeirah Premium', type: 'area_multiplier', applies: 'Palm Jumeirah', modifier: '+15%', priority: 3, stackable: true, active: true },
  { name: 'Summer Surge (Jun-Aug)', type: 'seasonal', applies: 'AC Services', modifier: '+20%', priority: 8, stackable: false, active: false },
  { name: 'High-Rise Tower Tier', type: 'building_tier', applies: 'Towers 40+ floors', modifier: '+AED 30', priority: 2, stackable: true, active: true },
];

export default function PricingPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Pricing Rules</h1>
          <p className="text-sm text-muted-foreground">Dynamic pricing modifiers for services</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-accent/90">
          <Plus className="h-4 w-4" /> Add Rule
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="overflow-x-auto rounded-xl border border-border bg-card">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Name</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Type</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Applies To</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Modifier</th>
                  <th className="px-4 py-3 text-center font-medium text-muted-foreground">Priority</th>
                  <th className="px-4 py-3 text-center font-medium text-muted-foreground">Stackable</th>
                  <th className="px-4 py-3 text-center font-medium text-muted-foreground">Active</th>
                </tr>
              </thead>
              <tbody>
                {rules.map((r) => (
                  <tr key={r.name} className="border-b border-border last:border-0 hover:bg-muted/30">
                    <td className="px-4 py-3 font-medium text-foreground">{r.name}</td>
                    <td className="px-4 py-3"><span className="rounded-full bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">{r.type.replace('_', ' ')}</span></td>
                    <td className="px-4 py-3 text-muted-foreground">{r.applies}</td>
                    <td className="px-4 py-3 font-medium text-foreground">{r.modifier}</td>
                    <td className="px-4 py-3 text-center text-foreground">{r.priority}</td>
                    <td className="px-4 py-3 text-center">{r.stackable ? <span className="text-green-600">Yes</span> : <span className="text-muted-foreground">No</span>}</td>
                    <td className="px-4 py-3 text-center"><div className={`mx-auto h-3 w-6 rounded-full ${r.active ? 'bg-green-500' : 'bg-gray-300'}`} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div>
          <PriceSimulator />
        </div>
      </div>
    </div>
  );
}
