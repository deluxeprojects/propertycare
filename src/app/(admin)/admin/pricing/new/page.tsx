'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Check } from 'lucide-react';

interface Service {
  id: string;
  name_en: string;
}

interface Category {
  id: string;
  name_en: string;
}

interface Area {
  id: string;
  name_en: string;
}

export default function NewPricingRulePage() {
  const [name, setName] = useState('');
  const [ruleType, setRuleType] = useState('surcharge');
  const [serviceId, setServiceId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [areaId, setAreaId] = useState('');
  const [modifierType, setModifierType] = useState('percentage');
  const [modifierValue, setModifierValue] = useState('');
  const [priority, setPriority] = useState('');
  const [validFrom, setValidFrom] = useState('');
  const [validUntil, setValidUntil] = useState('');
  const [isStackable, setIsStackable] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [apiError, setApiError] = useState('');
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);

  useEffect(() => {
    // Fetch services and extract categories
    fetch('/api/v1/public/services')
      .then(res => res.json())
      .then(json => {
        if (json.data && Array.isArray(json.data)) {
          setServices(json.data.map((s: { id: string; name_en: string }) => ({ id: s.id, name_en: s.name_en })));
          const catMap = new Map<string, Category>();
          for (const svc of json.data) {
            if (svc.service_categories) {
              const cat = svc.service_categories;
              if (cat.id && !catMap.has(cat.id)) {
                catMap.set(cat.id, { id: cat.id, name_en: cat.name_en });
              }
            }
          }
          setCategories(Array.from(catMap.values()).sort((a, b) => a.name_en.localeCompare(b.name_en)));
        }
      })
      .catch(() => {
        setServices([]);
        setCategories([]);
      });

    // Fetch areas
    fetch('/api/v1/public/areas')
      .then(res => res.json())
      .then(json => {
        if (json.data && Array.isArray(json.data)) {
          setAreas(json.data.map((a: { id: string; name_en: string }) => ({ id: a.id, name_en: a.name_en })));
        }
      })
      .catch(() => setAreas([]));
  }, []);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'Rule name is required';
    if (!ruleType) e.ruleType = 'Rule type is required';
    if (!modifierType) e.modifierType = 'Modifier type is required';
    if (!modifierValue) {
      e.modifierValue = 'Modifier value is required';
    } else if (parseFloat(modifierValue) <= 0) {
      e.modifierValue = 'Modifier value must be greater than 0';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) return;
    setSaving(true);
    setApiError('');
    try {
      const res = await fetch('/api/v1/admin/pricing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          ruleType,
          serviceId,
          categoryId,
          areaId,
          modifierType,
          modifierValue,
          priority,
          validFrom,
          validUntil,
          isStackable,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setApiError(data.error || 'Failed to create pricing rule');
        setSaving(false);
        return;
      }
      setSaved(true);
      setSaving(false);
      setTimeout(() => { window.location.href = '/admin/pricing'; }, 1000);
    } catch {
      setApiError('Network error. Please try again.');
      setSaving(false);
    }
  };

  const clearError = (field: string) => {
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const fieldClass = (field: string) =>
    `w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 ${errors[field] ? 'border-destructive focus:border-destructive focus:ring-destructive' : 'border-input focus:border-accent focus:ring-accent'}`;

  if (saved) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/pricing" className="rounded-lg p-2 text-muted-foreground hover:bg-muted">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold text-foreground">New Pricing Rule</h1>
        </div>
        <div className="rounded-xl border border-green-300 bg-green-50 p-6 dark:border-green-800 dark:bg-green-950">
          <div className="flex items-center gap-3">
            <Check className="h-5 w-5 text-green-600" />
            <p className="font-medium text-green-800 dark:text-green-200">Pricing rule created successfully</p>
          </div>
          <Link href="/admin/pricing" className="mt-4 inline-block text-sm font-medium text-accent hover:underline">
            Back to pricing rules
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/pricing" className="rounded-lg p-2 text-muted-foreground hover:bg-muted">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">New Pricing Rule</h1>
          <p className="text-sm text-muted-foreground">Create a custom pricing modifier</p>
        </div>
      </div>

      {apiError && (
        <div className="rounded-xl border border-red-300 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950">
          <p className="text-sm font-medium text-red-800 dark:text-red-200">{apiError}</p>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Rule Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Peak Season Surcharge"
                  value={name}
                  onChange={(e) => { setName(e.target.value); clearError('name'); }}
                  className={fieldClass('name')}
                />
                {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name}</p>}
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Rule Type *</label>
                <select
                  value={ruleType}
                  onChange={(e) => { setRuleType(e.target.value); clearError('ruleType'); }}
                  className={fieldClass('ruleType')}
                >
                  <option value="surcharge">Surcharge</option>
                  <option value="discount">Discount</option>
                  <option value="override">Override</option>
                  <option value="minimum">Minimum Price</option>
                </select>
                {errors.ruleType && <p className="mt-1 text-xs text-destructive">{errors.ruleType}</p>}
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Service (optional)</label>
                <select
                  value={serviceId}
                  onChange={(e) => setServiceId(e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                >
                  <option value="">All Services</option>
                  {services.map((s) => (
                    <option key={s.id} value={s.id}>{s.name_en}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Category (optional)</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                >
                  <option value="">All Categories</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name_en}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Area (optional)</label>
                <select
                  value={areaId}
                  onChange={(e) => setAreaId(e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                >
                  <option value="">All Areas</option>
                  {areas.map((a) => (
                    <option key={a.id} value={a.id}>{a.name_en}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Modifier Type *</label>
                <select
                  value={modifierType}
                  onChange={(e) => { setModifierType(e.target.value); clearError('modifierType'); }}
                  className={fieldClass('modifierType')}
                >
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed Amount (AED)</option>
                </select>
                {errors.modifierType && <p className="mt-1 text-xs text-destructive">{errors.modifierType}</p>}
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Modifier Value *</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="e.g. 10"
                  value={modifierValue}
                  onChange={(e) => { setModifierValue(e.target.value); clearError('modifierValue'); }}
                  className={fieldClass('modifierValue')}
                />
                {errors.modifierValue && <p className="mt-1 text-xs text-destructive">{errors.modifierValue}</p>}
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Priority</label>
                <input
                  type="number"
                  placeholder="e.g. 10"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                />
                <p className="mt-1 text-xs text-muted-foreground">Higher = applied first</p>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Valid From</label>
                <input
                  type="date"
                  value={validFrom}
                  onChange={(e) => setValidFrom(e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Valid Until</label>
                <input
                  type="date"
                  value={validUntil}
                  onChange={(e) => setValidUntil(e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="is_stackable"
                checked={isStackable}
                onChange={(e) => setIsStackable(e.target.checked)}
                className="h-4 w-4 rounded border-input text-accent focus:ring-accent"
              />
              <label htmlFor="is_stackable" className="text-sm font-medium text-foreground">Stackable (can combine with other rules)</label>
            </div>

            <div className="flex justify-end gap-3">
              <Link href="/admin/pricing" className="rounded-lg border border-border px-6 py-2 text-sm font-medium text-foreground hover:bg-muted">
                Cancel
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-accent px-6 py-2 text-sm font-semibold text-accent-foreground hover:bg-accent/90 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Pricing Rule'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
