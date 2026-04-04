import Link from 'next/link';
import { Plus, Pencil } from 'lucide-react';
import { createAdminClient } from '@/lib/supabase/admin';

interface ServiceRow {
  id: string;
  service_code: string;
  name_en: string;
  base_price_aed: number;
  price_unit: string;
  duration_minutes: number;
  is_express_available: boolean;
  is_featured: boolean;
  is_active: boolean;
  service_categories: { name_en: string }[];
}

export default async function ServicesPage() {
  const supabase = createAdminClient();

  const { data: services } = await supabase
    .from('services')
    .select(`
      id,
      service_code,
      name_en,
      base_price_aed,
      price_unit,
      duration_minutes,
      is_express_available,
      is_featured,
      is_active,
      service_categories(name_en)
    `)
    .is('deleted_at', null)
    .order('sort_order', { ascending: true });

  const serviceList = services ?? [];

  function formatDuration(minutes: number) {
    if (minutes < 60) return `${minutes} min`;
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hrs}h ${mins}m` : `${hrs} hr${hrs > 1 ? 's' : ''}`;
  }

  function formatUnit(unit: string) {
    const map: Record<string, string> = {
      per_hour: '/hr',
      per_sqft: '/sqft',
      per_room: '/room',
      per_service: '',
    };
    return map[unit] ?? '';
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Service Catalog</h1>
          <p className="text-sm text-muted-foreground">Manage services, variants, and add-ons</p>
        </div>
        <Link href="/admin/services/new" className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-accent/90">
          <Plus className="h-4 w-4" /> Add Service
        </Link>
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
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {serviceList.length === 0 && (
              <tr>
                <td colSpan={9} className="px-4 py-8 text-center text-muted-foreground">
                  No services found
                </td>
              </tr>
            )}
            {serviceList.map((s: ServiceRow) => (
              <tr key={s.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{s.service_code}</td>
                <td className="px-4 py-3 font-medium text-foreground"><Link href={`/admin/services/${s.id}/edit`} className="text-accent hover:underline">{s.name_en}</Link></td>
                <td className="px-4 py-3"><span className="rounded-full bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">{s.service_categories?.[0]?.name_en ?? '—'}</span></td>
                <td className="px-4 py-3 text-right font-medium">{Number(s.base_price_aed)}{formatUnit(s.price_unit)}</td>
                <td className="px-4 py-3 text-muted-foreground">{formatDuration(s.duration_minutes)}</td>
                <td className="px-4 py-3 text-center">{s.is_express_available ? <span className="text-green-600">Yes</span> : <span className="text-muted-foreground">—</span>}</td>
                <td className="px-4 py-3 text-center">{s.is_featured ? <span className="text-green-600">Yes</span> : <span className="text-muted-foreground">—</span>}</td>
                <td className="px-4 py-3 text-center">
                  <div className={`mx-auto h-3 w-6 rounded-full ${s.is_active ? 'bg-green-500' : 'bg-gray-300'}`} />
                </td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/services/${s.id}/edit`} className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-accent hover:bg-muted">
                    <Pencil className="h-3 w-3" /> Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
