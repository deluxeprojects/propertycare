import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { siteConfig } from '@/config/site';

const categories = [
  { id: 'cat-cleaning', name: 'Cleaning' },
  { id: 'cat-ac', name: 'AC Services' },
  { id: 'cat-pest', name: 'Pest Control' },
  { id: 'cat-plumbing', name: 'Plumbing' },
  { id: 'cat-painting', name: 'Painting' },
  { id: 'cat-electrical', name: 'Electrical' },
  { id: 'cat-handyman', name: 'Handyman' },
];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export default function NewServicePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/services" className="rounded-lg p-2 text-muted-foreground hover:bg-muted">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">New Service</h1>
          <p className="text-sm text-muted-foreground">Add a new service to the {siteConfig.name} catalog</p>
        </div>
      </div>

      <form action="/api/admin/services" method="POST">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="mb-4 font-semibold text-foreground">Basic Information</h3>
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="nameEn" className="mb-1.5 block text-sm font-medium text-foreground">
                      Service Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="nameEn"
                      name="nameEn"
                      type="text"
                      required
                      minLength={2}
                      maxLength={200}
                      placeholder="e.g. Deep Cleaning - Studio"
                      className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-accent focus:outline-none"
                    />
                    <p className="mt-1 text-xs text-muted-foreground">Slug will be auto-generated from the name</p>
                  </div>
                  <div>
                    <label htmlFor="serviceCode" className="mb-1.5 block text-sm font-medium text-foreground">
                      Service Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="serviceCode"
                      name="serviceCode"
                      type="text"
                      required
                      minLength={3}
                      maxLength={20}
                      placeholder="e.g. CLN-004"
                      className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm font-mono focus:border-accent focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="slug" className="mb-1.5 block text-sm font-medium text-foreground">
                      Slug <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="slug"
                      name="slug"
                      type="text"
                      required
                      minLength={2}
                      maxLength={100}
                      pattern="^[a-z0-9-]+$"
                      placeholder="deep-cleaning-studio"
                      className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm font-mono focus:border-accent focus:outline-none"
                    />
                    <p className="mt-1 text-xs text-muted-foreground">URL-safe identifier (lowercase, hyphens only)</p>
                  </div>
                  <div>
                    <label htmlFor="categoryId" className="mb-1.5 block text-sm font-medium text-foreground">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="categoryId"
                      name="categoryId"
                      required
                      defaultValue=""
                      className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-accent focus:outline-none"
                    >
                      <option value="" disabled>Select a category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="shortDescEn" className="mb-1.5 block text-sm font-medium text-foreground">
                    Short Description
                  </label>
                  <input
                    id="shortDescEn"
                    name="shortDescEn"
                    type="text"
                    maxLength={80}
                    placeholder="Brief one-liner shown in cards and listings"
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-accent focus:outline-none"
                  />
                  <p className="mt-1 text-xs text-muted-foreground">Max 80 characters</p>
                </div>

                <div>
                  <label htmlFor="longDescEn" className="mb-1.5 block text-sm font-medium text-foreground">
                    Long Description
                  </label>
                  <textarea
                    id="longDescEn"
                    name="longDescEn"
                    rows={5}
                    placeholder="Detailed description of the service, what's included, process, etc."
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-accent focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Pricing & Duration */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="mb-4 font-semibold text-foreground">Pricing &amp; Duration</h3>
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label htmlFor="basePriceAed" className="mb-1.5 block text-sm font-medium text-foreground">
                    Base Price ({siteConfig.currency}) <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="basePriceAed"
                    name="basePriceAed"
                    type="number"
                    required
                    min={0}
                    step="0.01"
                    placeholder="0.00"
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-accent focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="priceUnit" className="mb-1.5 block text-sm font-medium text-foreground">
                    Price Unit <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="priceUnit"
                    name="priceUnit"
                    required
                    defaultValue="per_service"
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-accent focus:outline-none"
                  >
                    <option value="per_service">Per Service</option>
                    <option value="per_hour">Per Hour</option>
                    <option value="per_sqft">Per Sqft</option>
                    <option value="per_room">Per Room</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="durationMinutes" className="mb-1.5 block text-sm font-medium text-foreground">
                    Duration (minutes) <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="durationMinutes"
                    name="durationMinutes"
                    type="number"
                    required
                    min={1}
                    placeholder="60"
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-accent focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="mb-4 font-semibold text-foreground">Tags</h3>
              <div>
                <label htmlFor="tags" className="mb-1.5 block text-sm font-medium text-foreground">
                  Tags
                </label>
                <input
                  id="tags"
                  name="tags"
                  type="text"
                  placeholder="cleaning, residential, villa (comma-separated)"
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-accent focus:outline-none"
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  Enter tags separated by commas. Used for filtering and search.
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Toggles */}
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="mb-3 font-semibold text-foreground">Options</h3>
              <div className="space-y-4">
                <label className="flex items-center justify-between">
                  <span className="text-sm text-foreground">Express Available</span>
                  <input
                    type="checkbox"
                    name="isExpressAvailable"
                    value="true"
                    className="h-4 w-4 rounded border-input text-accent focus:ring-accent"
                  />
                </label>
                <label className="flex items-center justify-between">
                  <span className="text-sm text-foreground">Featured</span>
                  <input
                    type="checkbox"
                    name="isFeatured"
                    value="true"
                    className="h-4 w-4 rounded border-input text-accent focus:ring-accent"
                  />
                </label>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button
                type="submit"
                className="w-full rounded-lg bg-accent py-2.5 text-sm font-semibold text-accent-foreground hover:bg-accent/90"
              >
                Create Service
              </button>
              <Link
                href="/admin/services"
                className="block w-full rounded-lg border border-border py-2.5 text-center text-sm font-medium text-muted-foreground hover:bg-muted"
              >
                Cancel
              </Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
