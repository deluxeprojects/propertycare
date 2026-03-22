'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Check } from 'lucide-react';
import { siteConfig } from '@/config/site';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

interface Category {
  id: string;
  name_en: string;
}

export default function NewServicePage() {
  const [name, setName] = useState('');
  const [serviceCode, setServiceCode] = useState('');
  const [slug, setSlug] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const [longDesc, setLongDesc] = useState('');
  const [basePriceAed, setBasePriceAed] = useState('');
  const [priceUnit, setPriceUnit] = useState('per_service');
  const [durationMinutes, setDurationMinutes] = useState('');
  const [tags, setTags] = useState('');
  const [isExpressAvailable, setIsExpressAvailable] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetch('/api/v1/public/services')
      .then(res => res.json())
      .then(json => {
        // Extract unique categories from services response
        const catMap = new Map<string, Category>();
        if (json.data && Array.isArray(json.data)) {
          for (const svc of json.data) {
            if (svc.service_categories) {
              const cat = svc.service_categories;
              if (cat.id && !catMap.has(cat.id)) {
                catMap.set(cat.id, { id: cat.id, name_en: cat.name_en });
              }
            }
          }
        }
        setCategories(Array.from(catMap.values()).sort((a, b) => a.name_en.localeCompare(b.name_en)));
      })
      .catch(() => {
        // Fallback categories
        setCategories([
          { id: 'cat-cleaning', name_en: 'Cleaning' },
          { id: 'cat-ac', name_en: 'AC Services' },
          { id: 'cat-pest', name_en: 'Pest Control' },
          { id: 'cat-plumbing', name_en: 'Plumbing' },
          { id: 'cat-painting', name_en: 'Painting' },
          { id: 'cat-electrical', name_en: 'Electrical' },
          { id: 'cat-handyman', name_en: 'Handyman' },
        ]);
      });
  }, []);

  const handleNameChange = (value: string) => {
    setName(value);
    setSlug(slugify(value));
    clearError('name');
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'Service name is required';
    if (!serviceCode.trim()) e.serviceCode = 'Service code is required';
    if (!slug.trim()) e.slug = 'Slug is required';
    if (!categoryId) e.categoryId = 'Category is required';
    if (!basePriceAed) {
      e.basePriceAed = 'Base price is required';
    } else if (parseFloat(basePriceAed) <= 0) {
      e.basePriceAed = 'Price must be greater than 0';
    }
    if (!priceUnit) e.priceUnit = 'Price unit is required';
    if (!durationMinutes) {
      e.durationMinutes = 'Duration is required';
    } else if (parseInt(durationMinutes) <= 0) {
      e.durationMinutes = 'Duration must be greater than 0';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) return;
    setSaving(true);
    // TODO: call server action or API
    await new Promise(r => setTimeout(r, 500));
    setSaving(false);
    setSaved(true);
  };

  const clearError = (field: string) => {
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const fieldClass = (field: string) =>
    `w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none ${errors[field] ? 'border-destructive focus:border-destructive' : 'border-input focus:border-accent'}`;

  if (saved) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/services" className="rounded-lg p-2 text-muted-foreground hover:bg-muted">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold text-foreground">New Service</h1>
        </div>
        <div className="rounded-xl border border-green-300 bg-green-50 p-6 dark:border-green-800 dark:bg-green-950">
          <div className="flex items-center gap-3">
            <Check className="h-5 w-5 text-green-600" />
            <p className="font-medium text-green-800 dark:text-green-200">Service created successfully</p>
          </div>
          <Link href="/admin/services" className="mt-4 inline-block text-sm font-medium text-accent hover:underline">
            Back to services
          </Link>
        </div>
      </div>
    );
  }

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

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="mb-4 font-semibold text-foreground">Basic Information</h3>
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">
                      Service Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => handleNameChange(e.target.value)}
                      placeholder="e.g. Deep Cleaning - Studio"
                      className={fieldClass('name')}
                    />
                    {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name}</p>}
                    <p className="mt-1 text-xs text-muted-foreground">Slug will be auto-generated from the name</p>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">
                      Service Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={serviceCode}
                      onChange={(e) => { setServiceCode(e.target.value); clearError('serviceCode'); }}
                      placeholder="e.g. CLN-004"
                      className={`${fieldClass('serviceCode')} font-mono`}
                    />
                    {errors.serviceCode && <p className="mt-1 text-xs text-destructive">{errors.serviceCode}</p>}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">
                      Slug <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={slug}
                      onChange={(e) => { setSlug(e.target.value); clearError('slug'); }}
                      placeholder="deep-cleaning-studio"
                      className={`${fieldClass('slug')} font-mono`}
                    />
                    {errors.slug && <p className="mt-1 text-xs text-destructive">{errors.slug}</p>}
                    <p className="mt-1 text-xs text-muted-foreground">URL-safe identifier (lowercase, hyphens only)</p>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={categoryId}
                      onChange={(e) => { setCategoryId(e.target.value); clearError('categoryId'); }}
                      className={fieldClass('categoryId')}
                    >
                      <option value="" disabled>Select a category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name_en}</option>
                      ))}
                    </select>
                    {errors.categoryId && <p className="mt-1 text-xs text-destructive">{errors.categoryId}</p>}
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">
                    Short Description
                  </label>
                  <input
                    type="text"
                    value={shortDesc}
                    onChange={(e) => setShortDesc(e.target.value)}
                    maxLength={80}
                    placeholder="Brief one-liner shown in cards and listings"
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-accent focus:outline-none"
                  />
                  <p className="mt-1 text-xs text-muted-foreground">Max 80 characters</p>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">
                    Long Description
                  </label>
                  <textarea
                    value={longDesc}
                    onChange={(e) => setLongDesc(e.target.value)}
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
                  <label className="mb-1.5 block text-sm font-medium text-foreground">
                    Base Price ({siteConfig.currency}) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={basePriceAed}
                    onChange={(e) => { setBasePriceAed(e.target.value); clearError('basePriceAed'); }}
                    min={0}
                    step="0.01"
                    placeholder="0.00"
                    className={fieldClass('basePriceAed')}
                  />
                  {errors.basePriceAed && <p className="mt-1 text-xs text-destructive">{errors.basePriceAed}</p>}
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">
                    Price Unit <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={priceUnit}
                    onChange={(e) => { setPriceUnit(e.target.value); clearError('priceUnit'); }}
                    className={fieldClass('priceUnit')}
                  >
                    <option value="per_service">Per Service</option>
                    <option value="per_hour">Per Hour</option>
                    <option value="per_sqft">Per Sqft</option>
                    <option value="per_room">Per Room</option>
                  </select>
                  {errors.priceUnit && <p className="mt-1 text-xs text-destructive">{errors.priceUnit}</p>}
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">
                    Duration (minutes) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={durationMinutes}
                    onChange={(e) => { setDurationMinutes(e.target.value); clearError('durationMinutes'); }}
                    min={1}
                    placeholder="60"
                    className={fieldClass('durationMinutes')}
                  />
                  {errors.durationMinutes && <p className="mt-1 text-xs text-destructive">{errors.durationMinutes}</p>}
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="mb-4 font-semibold text-foreground">Tags</h3>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Tags</label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
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
                    checked={isExpressAvailable}
                    onChange={(e) => setIsExpressAvailable(e.target.checked)}
                    className="h-4 w-4 rounded border-input text-accent focus:ring-accent"
                  />
                </label>
                <label className="flex items-center justify-between">
                  <span className="text-sm text-foreground">Featured</span>
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="h-4 w-4 rounded border-input text-accent focus:ring-accent"
                  />
                </label>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-lg bg-accent py-2.5 text-sm font-semibold text-accent-foreground hover:bg-accent/90 disabled:opacity-50"
              >
                {saving ? 'Creating...' : 'Create Service'}
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
