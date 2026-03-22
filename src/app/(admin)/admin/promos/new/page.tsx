'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Check } from 'lucide-react';

export default function NewPromoPage() {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [discountType, setDiscountType] = useState('percentage');
  const [discountValue, setDiscountValue] = useState('');
  const [minOrderAmount, setMinOrderAmount] = useState('');
  const [maxDiscount, setMaxDiscount] = useState('');
  const [usageLimitTotal, setUsageLimitTotal] = useState('');
  const [usageLimitPerUser, setUsageLimitPerUser] = useState('');
  const [validFrom, setValidFrom] = useState('');
  const [validUntil, setValidUntil] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [isFirstOrderOnly, setIsFirstOrderOnly] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [apiError, setApiError] = useState('');

  const validate = () => {
    const e: Record<string, string> = {};
    if (!code.trim()) {
      e.code = 'Promo code is required';
    } else if (code.trim().length < 3) {
      e.code = 'Promo code must be at least 3 characters';
    }
    if (!name.trim()) e.name = 'Name is required';
    if (!discountType) e.discountType = 'Discount type is required';
    if (!discountValue) {
      e.discountValue = 'Discount value is required';
    } else if (parseFloat(discountValue) <= 0) {
      e.discountValue = 'Discount value must be greater than 0';
    }
    if (!validFrom) e.validFrom = 'Valid from date is required';
    if (!validUntil) e.validUntil = 'Valid until date is required';
    if (validFrom && validUntil && new Date(validUntil) <= new Date(validFrom)) {
      e.validUntil = 'Valid until must be after valid from';
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
      const res = await fetch('/api/v1/admin/promos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          name,
          description,
          discountType,
          discountValue,
          minOrderAmount,
          maxDiscount,
          usageLimitTotal,
          usageLimitPerUser,
          validFrom,
          validUntil,
          isPublic,
          isFirstOrderOnly,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setApiError(data.error || 'Failed to create promo');
        setSaving(false);
        return;
      }
      setSaved(true);
      setSaving(false);
      setTimeout(() => { window.location.href = '/admin/promos'; }, 1000);
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
          <Link href="/admin/promos" className="rounded-lg p-2 text-muted-foreground hover:bg-muted">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold text-foreground">New Promo Code</h1>
        </div>
        <div className="rounded-xl border border-green-300 bg-green-50 p-6 dark:border-green-800 dark:bg-green-950">
          <div className="flex items-center gap-3">
            <Check className="h-5 w-5 text-green-600" />
            <p className="font-medium text-green-800 dark:text-green-200">Promo code created successfully</p>
          </div>
          <Link href="/admin/promos" className="mt-4 inline-block text-sm font-medium text-accent hover:underline">
            Back to promos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/promos" className="rounded-lg p-2 text-muted-foreground hover:bg-muted">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">New Promo Code</h1>
          <p className="text-sm text-muted-foreground">Create a new promotional offer</p>
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
                <label className="mb-1.5 block text-sm font-medium text-foreground">Promo Code *</label>
                <input
                  type="text"
                  placeholder="e.g. SUMMER25"
                  value={code}
                  onChange={(e) => { setCode(e.target.value.toUpperCase()); clearError('code'); }}
                  className={`${fieldClass('code')} uppercase`}
                />
                {errors.code && <p className="mt-1 text-xs text-destructive">{errors.code}</p>}
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Name *</label>
                <input
                  type="text"
                  placeholder="Summer 2026 Discount"
                  value={name}
                  onChange={(e) => { setName(e.target.value); clearError('name'); }}
                  className={fieldClass('name')}
                />
                {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name}</p>}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Description</label>
              <textarea
                rows={3}
                placeholder="Describe this promotion..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Discount Type *</label>
                <select
                  value={discountType}
                  onChange={(e) => { setDiscountType(e.target.value); clearError('discountType'); }}
                  className={fieldClass('discountType')}
                >
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed Amount</option>
                  <option value="free_addon">Free Add-on</option>
                  <option value="free_service">Free Service</option>
                </select>
                {errors.discountType && <p className="mt-1 text-xs text-destructive">{errors.discountType}</p>}
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Discount Value *</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="e.g. 25"
                  value={discountValue}
                  onChange={(e) => { setDiscountValue(e.target.value); clearError('discountValue'); }}
                  className={fieldClass('discountValue')}
                />
                {errors.discountValue && <p className="mt-1 text-xs text-destructive">{errors.discountValue}</p>}
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Min Order Amount (AED)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0"
                  value={minOrderAmount}
                  onChange={(e) => setMinOrderAmount(e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Max Discount (AED)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="No limit"
                  value={maxDiscount}
                  onChange={(e) => setMaxDiscount(e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Usage Limit (Total)</label>
                <input
                  type="number"
                  placeholder="Unlimited"
                  value={usageLimitTotal}
                  onChange={(e) => setUsageLimitTotal(e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Usage Limit (Per User)</label>
                <input
                  type="number"
                  placeholder="Unlimited"
                  value={usageLimitPerUser}
                  onChange={(e) => setUsageLimitPerUser(e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Valid From *</label>
                <input
                  type="date"
                  value={validFrom}
                  onChange={(e) => { setValidFrom(e.target.value); clearError('validFrom'); }}
                  className={fieldClass('validFrom')}
                />
                {errors.validFrom && <p className="mt-1 text-xs text-destructive">{errors.validFrom}</p>}
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Valid Until *</label>
                <input
                  type="date"
                  value={validUntil}
                  onChange={(e) => { setValidUntil(e.target.value); clearError('validUntil'); }}
                  className={fieldClass('validUntil')}
                />
                {errors.validUntil && <p className="mt-1 text-xs text-destructive">{errors.validUntil}</p>}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="is_public"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="h-4 w-4 rounded border-input text-accent focus:ring-accent"
                />
                <label htmlFor="is_public" className="text-sm font-medium text-foreground">Public promo (visible to all users)</label>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="is_first_order_only"
                  checked={isFirstOrderOnly}
                  onChange={(e) => setIsFirstOrderOnly(e.target.checked)}
                  className="h-4 w-4 rounded border-input text-accent focus:ring-accent"
                />
                <label htmlFor="is_first_order_only" className="text-sm font-medium text-foreground">First order only</label>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Link href="/admin/promos" className="rounded-lg border border-border px-6 py-2 text-sm font-medium text-foreground hover:bg-muted">
                Cancel
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-accent px-6 py-2 text-sm font-semibold text-accent-foreground hover:bg-accent/90 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Promo'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
