import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { createAdminClient } from '@/lib/supabase/admin';

export default async function NewTechnicianPage() {
  const supabase = createAdminClient();

  // Fetch categories for specializations
  const { data: categories } = await supabase
    .from('service_categories')
    .select('id, name_en')
    .is('deleted_at', null)
    .order('name_en', { ascending: true });

  // Fetch areas for work areas
  const { data: areas } = await supabase
    .from('areas')
    .select('id, name_en')
    .eq('is_active', true)
    .is('deleted_at', null)
    .order('name_en', { ascending: true });

  const categoryList = categories ?? [];
  const areaList = areas ?? [];

  const inputClass = 'w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent';

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/workforce" className="rounded-lg p-2 text-muted-foreground hover:bg-muted">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Add Technician</h1>
          <p className="text-sm text-muted-foreground">Register a new technician</p>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Employee Code</label>
              <input type="text" placeholder="e.g. TECH-001" className={inputClass} />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Profile (Email)</label>
              <input type="email" placeholder="technician@email.com" className={inputClass} />
              <p className="mt-1 text-xs text-muted-foreground">Must match an existing user profile</p>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">Specializations</label>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {categoryList.map((cat: any) => (
                <div key={cat.id} className="flex items-center gap-2">
                  <input type="checkbox" id={`cat-${cat.id}`} className="h-4 w-4 rounded border-input text-accent focus:ring-accent" />
                  <label htmlFor={`cat-${cat.id}`} className="text-sm text-foreground">{cat.name_en}</label>
                </div>
              ))}
              {categoryList.length === 0 && <p className="text-sm text-muted-foreground">No categories found</p>}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">Work Areas</label>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {areaList.map((area: any) => (
                <div key={area.id} className="flex items-center gap-2">
                  <input type="checkbox" id={`area-${area.id}`} className="h-4 w-4 rounded border-input text-accent focus:ring-accent" />
                  <label htmlFor={`area-${area.id}`} className="text-sm text-foreground">{area.name_en}</label>
                </div>
              ))}
              {areaList.length === 0 && <p className="text-sm text-muted-foreground">No areas found</p>}
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Employment Type</label>
              <select className={inputClass}>
                <option value="full_time">Full-Time</option>
                <option value="part_time">Part-Time</option>
                <option value="contract">Contract</option>
                <option value="freelance">Freelance</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Hourly Rate (AED)</label>
              <input type="number" step="0.01" placeholder="e.g. 45.00" className={inputClass} />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Daily Capacity (hours)</label>
              <input type="number" placeholder="e.g. 8" className={inputClass} />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Vehicle Type</label>
              <input type="text" placeholder="e.g. Van, Sedan, Motorcycle" className={inputClass} />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Link href="/admin/workforce" className="rounded-lg border border-border px-6 py-2 text-sm font-medium text-foreground hover:bg-muted">
              Cancel
            </Link>
            <button className="rounded-lg bg-accent px-6 py-2 text-sm font-semibold text-accent-foreground hover:bg-accent/90">
              Save Technician
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
