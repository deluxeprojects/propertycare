import { Suspense } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/admin';
import { ArrowLeft } from 'lucide-react';
import { AdminTabs } from '@/features/admin/components/AdminTabs';

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
}

export default async function ServiceEditPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { tab } = await searchParams;
  const activeTab = tab ?? 'basic-info';

  const supabase = createAdminClient();

  const { data: service } = await supabase
    .from('services')
    .select(`
      *,
      service_categories(id, name_en),
      service_variants(id, variant_label, price_aed, duration_minutes, sort_order, is_active),
      service_addons(id, name_en, price_aed, duration_minutes, sort_order, is_active)
    `)
    .eq('id', id)
    .single();

  if (!service) notFound();

  const variants = (service.service_variants ?? []).sort((a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order);
  const addons = (service.service_addons ?? []).sort((a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order);

  const inputClass = 'w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-accent focus:outline-none';

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/services" className="rounded-lg p-2 text-muted-foreground hover:bg-muted"><ArrowLeft className="h-5 w-5" /></Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Edit: {service.name_en}</h1>
          <p className="text-sm text-muted-foreground">{service.service_code}</p>
        </div>
      </div>

      <Suspense>
        <AdminTabs tabs={['Basic Info', 'Pricing', 'Add-ons', 'Settings', 'Media', 'SEO', 'Status']} />
      </Suspense>

      {/* Basic Info Tab */}
      {activeTab === 'basic-info' && (
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="mb-4 font-semibold text-foreground">Basic Information</h3>
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Service Name</label>
                <input type="text" defaultValue={service.name_en} className={inputClass} />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Service Code</label>
                <input type="text" defaultValue={service.service_code} className={inputClass} />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Slug</label>
                <input type="text" defaultValue={service.slug} className={inputClass} />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Category</label>
                <input type="text" defaultValue={(service.service_categories as unknown as { name_en: string } | null)?.name_en ?? ''} disabled className="w-full rounded-lg border border-input bg-muted px-3 py-2 text-sm text-muted-foreground" />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Short Description</label>
              <input type="text" defaultValue={service.short_desc_en ?? ''} maxLength={80} className={inputClass} />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Full Description</label>
              <textarea defaultValue={service.long_desc_en ?? ''} rows={4} className={inputClass} />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Base Price (AED)</label>
                <input type="number" defaultValue={service.base_price_aed} step="0.01" className={inputClass} />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Price Unit</label>
                <select defaultValue={service.price_unit} className={inputClass}>
                  <option value="per_service">Per Service</option>
                  <option value="per_hour">Per Hour</option>
                  <option value="per_sqft">Per Sqft</option>
                  <option value="per_room">Per Room</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Duration (min)</label>
                <input type="number" defaultValue={service.duration_minutes} className={inputClass} />
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <button className="rounded-lg bg-accent px-6 py-2 text-sm font-semibold text-accent-foreground hover:bg-accent/90">Save Changes</button>
          </div>
        </div>
      )}

      {/* Pricing (Variants) Tab */}
      {activeTab === 'pricing' && (
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Size Variants ({variants.length})</h3>
            <button className="rounded-lg bg-accent px-3 py-1.5 text-xs font-medium text-accent-foreground hover:bg-accent/90">+ Add Variant</button>
          </div>
          {variants.length > 0 ? (
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border"><th className="px-3 py-2 text-left font-medium text-muted-foreground">Label</th><th className="px-3 py-2 text-right font-medium text-muted-foreground">Price</th><th className="px-3 py-2 text-right font-medium text-muted-foreground">Duration</th><th className="px-3 py-2 text-center font-medium text-muted-foreground">Active</th></tr></thead>
              <tbody>
                {variants.map((v: { id: string; variant_label: string; price_aed: number; duration_minutes: number; is_active: boolean }) => (
                  <tr key={v.id} className="border-b border-border last:border-0">
                    <td className="px-3 py-2 text-foreground">{v.variant_label}</td>
                    <td className="px-3 py-2 text-right text-foreground">AED {v.price_aed}</td>
                    <td className="px-3 py-2 text-right text-muted-foreground">{v.duration_minutes} min</td>
                    <td className="px-3 py-2 text-center"><div className={`mx-auto h-3 w-6 rounded-full ${v.is_active ? 'bg-green-500' : 'bg-gray-300'}`} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : <p className="text-sm text-muted-foreground">No variants. Service uses base price.</p>}
        </div>
      )}

      {/* Add-ons Tab */}
      {activeTab === 'add-ons' && (
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Add-ons ({addons.length})</h3>
            <button className="rounded-lg bg-accent px-3 py-1.5 text-xs font-medium text-accent-foreground hover:bg-accent/90">+ Add Add-on</button>
          </div>
          {addons.length > 0 ? (
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border"><th className="px-3 py-2 text-left font-medium text-muted-foreground">Name</th><th className="px-3 py-2 text-right font-medium text-muted-foreground">Price</th><th className="px-3 py-2 text-right font-medium text-muted-foreground">Duration</th><th className="px-3 py-2 text-center font-medium text-muted-foreground">Active</th></tr></thead>
              <tbody>
                {addons.map((a: { id: string; name_en: string; price_aed: number; duration_minutes: number; is_active: boolean }) => (
                  <tr key={a.id} className="border-b border-border last:border-0">
                    <td className="px-3 py-2 text-foreground">{a.name_en}</td>
                    <td className="px-3 py-2 text-right text-foreground">AED {a.price_aed}</td>
                    <td className="px-3 py-2 text-right text-muted-foreground">{a.duration_minutes} min</td>
                    <td className="px-3 py-2 text-center"><div className={`mx-auto h-3 w-6 rounded-full ${a.is_active ? 'bg-green-500' : 'bg-gray-300'}`} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : <p className="text-sm text-muted-foreground">No add-ons configured.</p>}
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="mb-3 font-semibold text-foreground">Service Settings</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between"><span className="text-sm text-foreground">Active</span><div className={`h-5 w-9 rounded-full p-0.5 ${service.is_active ? 'bg-green-500' : 'bg-gray-300'}`}><div className={`h-4 w-4 rounded-full bg-white ${service.is_active ? 'translate-x-4' : ''}`} /></div></div>
              <div className="flex items-center justify-between"><span className="text-sm text-foreground">Featured</span><div className={`h-5 w-9 rounded-full p-0.5 ${service.is_featured ? 'bg-green-500' : 'bg-gray-300'}`}><div className={`h-4 w-4 rounded-full bg-white ${service.is_featured ? 'translate-x-4' : ''}`} /></div></div>
              <div className="flex items-center justify-between"><span className="text-sm text-foreground">Express Available</span><div className={`h-5 w-9 rounded-full p-0.5 ${service.is_express_available ? 'bg-green-500' : 'bg-gray-300'}`}><div className={`h-4 w-4 rounded-full bg-white ${service.is_express_available ? 'translate-x-4' : ''}`} /></div></div>
              <div className="flex items-center justify-between"><span className="text-sm text-foreground">Hidden</span><div className={`h-5 w-9 rounded-full p-0.5 ${service.is_hidden ? 'bg-green-500' : 'bg-gray-300'}`}><div className={`h-4 w-4 rounded-full bg-white ${service.is_hidden ? 'translate-x-4' : ''}`} /></div></div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="mb-3 font-semibold text-foreground">Booking Rules</h3>
            <div className="space-y-3 text-sm">
              <div><label className="mb-1 block text-muted-foreground">Min Advance (hours)</label><input type="number" defaultValue={service.min_booking_hours ?? 24} className="w-full rounded-lg border border-input bg-background px-3 py-1.5 text-sm" /></div>
              <div><label className="mb-1 block text-muted-foreground">Max Reschedules</label><input type="number" defaultValue={service.max_reschedules ?? 2} className="w-full rounded-lg border border-input bg-background px-3 py-1.5 text-sm" /></div>
              <div><label className="mb-1 block text-muted-foreground">Express Surcharge %</label><input type="number" defaultValue={service.express_surcharge_pct ?? 50} className="w-full rounded-lg border border-input bg-background px-3 py-1.5 text-sm" /></div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="mb-3 font-semibold text-foreground">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {(service.tags ?? []).map((tag: string) => (
                <span key={tag} className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">{tag}</span>
              ))}
              {(service.tags ?? []).length === 0 && <p className="text-sm text-muted-foreground">No tags</p>}
            </div>
          </div>

          <div className="flex justify-end">
            <button className="rounded-lg bg-accent px-6 py-2 text-sm font-semibold text-accent-foreground hover:bg-accent/90">Save Changes</button>
          </div>
        </div>
      )}

      {/* Media Tab */}
      {activeTab === 'media' && (
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="mb-4 font-semibold text-foreground">Media Gallery</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {service.hero_image_url && (
              <div className="rounded-lg border border-border p-3">
                <p className="mb-2 text-xs font-medium text-muted-foreground">Hero Image</p>
                <div className="aspect-video overflow-hidden rounded bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={service.hero_image_url} alt="Hero" className="h-full w-full object-cover" />
                </div>
              </div>
            )}
            {service.icon_url && (
              <div className="rounded-lg border border-border p-3">
                <p className="mb-2 text-xs font-medium text-muted-foreground">Icon</p>
                <div className="flex h-20 items-center justify-center rounded bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={service.icon_url} alt="Icon" className="h-12 w-12 object-contain" />
                </div>
              </div>
            )}
          </div>
          {!service.hero_image_url && !service.icon_url && (
            <div className="rounded-lg border border-dashed border-border p-8 text-center">
              <p className="text-sm text-muted-foreground">No media uploaded yet</p>
            </div>
          )}
          <div className="mt-4">
            <button className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted">
              Upload Image
            </button>
          </div>
        </div>
      )}

      {/* SEO Tab */}
      {activeTab === 'seo' && (
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="mb-4 font-semibold text-foreground">SEO Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Meta Title</label>
              <input type="text" defaultValue={service.meta_title ?? service.name_en} className={inputClass} />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Meta Description</label>
              <textarea defaultValue={service.meta_description ?? service.short_desc_en ?? ''} rows={3} className={inputClass} />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Canonical URL</label>
              <input type="text" defaultValue={service.canonical_url ?? ''} placeholder="https://..." className={inputClass} />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">OG Image URL</label>
              <input type="text" defaultValue={service.og_image_url ?? ''} placeholder="https://..." className={inputClass} />
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <button className="rounded-lg bg-accent px-6 py-2 text-sm font-semibold text-accent-foreground hover:bg-accent/90">Save Changes</button>
          </div>
        </div>
      )}

      {/* Status Tab */}
      {activeTab === 'status' && (
        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="mb-4 font-semibold text-foreground">Service Status</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-border p-4">
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="mt-1 text-lg font-bold text-foreground">{service.is_active ? 'Active' : 'Inactive'}</p>
              </div>
              <div className="rounded-lg border border-border p-4">
                <p className="text-sm text-muted-foreground">Visibility</p>
                <p className="mt-1 text-lg font-bold text-foreground">{service.is_hidden ? 'Hidden' : 'Visible'}</p>
              </div>
              <div className="rounded-lg border border-border p-4">
                <p className="text-sm text-muted-foreground">Created</p>
                <p className="mt-1 text-sm font-medium text-foreground">{service.created_at ? new Date(service.created_at).toLocaleDateString() : '—'}</p>
              </div>
              <div className="rounded-lg border border-border p-4">
                <p className="text-sm text-muted-foreground">Last Updated</p>
                <p className="mt-1 text-sm font-medium text-foreground">{service.updated_at ? new Date(service.updated_at).toLocaleDateString() : '—'}</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-red-200 bg-red-50 p-6">
            <h3 className="mb-2 font-semibold text-red-800">Danger Zone</h3>
            <p className="mb-4 text-sm text-red-600">Deactivating a service will hide it from the booking flow.</p>
            <button className="rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50">
              {service.is_active ? 'Deactivate Service' : 'Activate Service'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
