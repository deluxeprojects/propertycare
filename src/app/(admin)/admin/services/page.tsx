import { Wrench, Plus } from 'lucide-react';

const services = [
  { code: 'CLN-001', name: 'Regular Cleaning', category: 'Cleaning', price: 38, unit: '/hr', duration: '2-4 hrs', express: true, featured: true, active: true },
  { code: 'CLN-002', name: 'Deep Cleaning – Studio', category: 'Cleaning', price: 450, unit: '', duration: '3-4 hrs', express: false, featured: true, active: true },
  { code: 'CLN-003', name: 'Deep Cleaning – 1BR', category: 'Cleaning', price: 600, unit: '', duration: '4-5 hrs', express: false, featured: false, active: true },
  { code: 'TEC-001', name: 'AC Service (split unit)', category: 'AC Services', price: 120, unit: '/unit', duration: '45 min', express: true, featured: true, active: true },
  { code: 'TEC-002', name: 'AC Deep Clean', category: 'AC Services', price: 280, unit: '/unit', duration: '1.5 hrs', express: false, featured: false, active: true },
  { code: 'PST-001', name: 'General Pest – Studio', category: 'Pest Control', price: 220, unit: '', duration: '1 hr', express: false, featured: true, active: true },
  { code: 'TEC-006', name: 'Plumbing – Standard', category: 'Plumbing', price: 150, unit: '/hr', duration: '1-2 hrs', express: false, featured: false, active: true },
  { code: 'PNT-001', name: 'Painting – Studio', category: 'Painting', price: 700, unit: '', duration: '1 day', express: false, featured: false, active: true },
];

export default function ServicesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Service Catalog</h1>
          <p className="text-sm text-muted-foreground">Manage services, variants, and add-ons</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-accent/90">
          <Plus className="h-4 w-4" /> Add Service
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Code</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Service</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Category</th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">Price (AED)</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Duration</th>
              <th className="px-4 py-3 text-center font-medium text-muted-foreground">Express</th>
              <th className="px-4 py-3 text-center font-medium text-muted-foreground">Featured</th>
              <th className="px-4 py-3 text-center font-medium text-muted-foreground">Active</th>
            </tr>
          </thead>
          <tbody>
            {services.map((s) => (
              <tr key={s.code} className="border-b border-border last:border-0 hover:bg-muted/30">
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{s.code}</td>
                <td className="px-4 py-3 font-medium text-foreground">{s.name}</td>
                <td className="px-4 py-3"><span className="rounded-full bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">{s.category}</span></td>
                <td className="px-4 py-3 text-right font-medium">{s.price}{s.unit}</td>
                <td className="px-4 py-3 text-muted-foreground">{s.duration}</td>
                <td className="px-4 py-3 text-center">{s.express ? <span className="text-green-600">Yes</span> : <span className="text-muted-foreground">—</span>}</td>
                <td className="px-4 py-3 text-center">{s.featured ? <span className="text-green-600">Yes</span> : <span className="text-muted-foreground">—</span>}</td>
                <td className="px-4 py-3 text-center">
                  <div className={`mx-auto h-3 w-6 rounded-full ${s.active ? 'bg-green-500' : 'bg-gray-300'}`} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
