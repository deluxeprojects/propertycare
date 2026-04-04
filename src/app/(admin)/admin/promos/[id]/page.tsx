'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowLeft, Tag, Calendar, Users, TrendingUp, Shield, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface Promotion {
  code: string;
  name: string;
  description_en: string | null;
  discount_type: string;
  discount_value: number;
  min_order_aed: number;
  max_discount_aed: number | null;
  usage_limit_per_user: number;
  usage_limit_total: number | null;
  usage_count: number | null;
  valid_from: string | null;
  valid_until: string | null;
  is_active: boolean;
  is_public: boolean;
  is_first_order_only: boolean;
  created_at: string | null;
}

interface Props {
  params: Promise<{ id: string }>;
}

export default function PromoDetailPage({ params }: Props) {
  const router = useRouter();
  const [id, setId] = useState<string>('');
  const [promo, setPromo] = useState<Promotion | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const supabase = createClient();

  useEffect(() => {
    params.then(({ id }) => setId(id));
  }, [params]);

  useEffect(() => {
    if (!id) return;
    (async () => {
      const { data, error } = await supabase
        .from('promotions')
        .select('*')
        .eq('id', id)
        .single();
      if (error || !data) {
        setPromo(null);
      } else {
        setPromo(data);
      }
      setLoading(false);
    })();
  }, [id]);

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    const fd = new FormData(e.currentTarget);

    const updates: Record<string, unknown> = {
      code: fd.get('code'),
      name: fd.get('name'),
      description_en: fd.get('description_en'),
      discount_type: fd.get('discount_type'),
      discount_value: Number(fd.get('discount_value')),
      min_order_aed: Number(fd.get('min_order_aed')) || 0,
      max_discount_aed: fd.get('max_discount_aed') ? Number(fd.get('max_discount_aed')) : null,
      usage_limit_per_user: Number(fd.get('usage_limit_per_user')) || 1,
      usage_limit_total: fd.get('usage_limit_total') ? Number(fd.get('usage_limit_total')) : null,
      valid_from: fd.get('valid_from') || null,
      valid_until: fd.get('valid_until') || null,
      is_active: fd.get('is_active') === 'on',
      is_public: fd.get('is_public') === 'on',
      is_first_order_only: fd.get('is_first_order_only') === 'on',
    };

    const { error } = await supabase.from('promotions').update(updates).eq('id', id);
    if (error) {
      setMessage({ type: 'error', text: `Failed to save: ${error.message}` });
    } else {
      setMessage({ type: 'success', text: 'Changes saved successfully.' });
      // Refresh promo data
      const { data } = await supabase.from('promotions').select('*').eq('id', id).single();
      if (data) setPromo(data);
    }
    setSaving(false);
  }

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this promotion? This cannot be undone.')) return;
    setDeleting(true);
    const { error } = await supabase.from('promotions').update({ is_active: false, deleted_at: new Date().toISOString() }).eq('id', id);
    if (error) {
      setMessage({ type: 'error', text: `Failed to delete: ${error.message}` });
      setDeleting(false);
    } else {
      router.push('/admin/promos');
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!promo) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/promos" className="rounded-lg p-2 text-muted-foreground hover:bg-muted">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Promo Not Found</h1>
        </div>
        <div className="rounded-xl border border-border bg-card p-8 text-center">
          <p className="text-muted-foreground">The promotion with ID &quot;{id}&quot; could not be found.</p>
          <Link href="/admin/promos" className="mt-4 inline-block rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-accent/90">
            Back to Promotions
          </Link>
        </div>
      </div>
    );
  }

  const now = new Date();
  const validUntil = promo.valid_until ? new Date(promo.valid_until) : null;
  const validFrom = promo.valid_from ? new Date(promo.valid_from) : null;
  const isExpired = validUntil ? validUntil < now : false;
  const isUpcoming = validFrom ? validFrom > now : false;
  const statusLabel = !promo.is_active ? 'Inactive' : isExpired ? 'Expired' : isUpcoming ? 'Scheduled' : 'Active';
  const statusColor = !promo.is_active
    ? 'bg-gray-100 text-gray-800'
    : isExpired
      ? 'bg-red-100 text-red-800'
      : isUpcoming
        ? 'bg-yellow-100 text-yellow-800'
        : 'bg-green-100 text-green-800';

  const usagePercent = promo.usage_limit_total
    ? Math.round(((promo.usage_count ?? 0) / promo.usage_limit_total) * 100)
    : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/promos" className="rounded-lg p-2 text-muted-foreground hover:bg-muted">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-foreground">{promo.name}</h1>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor}`}>{statusLabel}</span>
            </div>
            <div className="mt-0.5 flex items-center gap-2">
              <span className="rounded bg-muted px-2 py-0.5 font-mono text-xs font-bold text-foreground">{promo.code}</span>
              {promo.is_first_order_only && <span className="rounded-full bg-blue-100 px-1.5 py-0.5 text-[10px] text-blue-800">1st order only</span>}
              {promo.is_public && <span className="rounded-full bg-purple-100 px-1.5 py-0.5 text-[10px] text-purple-800">Public</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className={`rounded-lg px-4 py-3 text-sm font-medium ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
          {message.text}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Tag className="h-4 w-4" />
            <span className="text-xs font-medium">Times Used</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-foreground">
            {promo.usage_count ?? 0}
            {promo.usage_limit_total && <span className="text-sm font-normal text-muted-foreground"> / {promo.usage_limit_total}</span>}
          </p>
          {usagePercent !== null && (
            <div className="mt-2">
              <div className="h-1.5 w-full rounded-full bg-muted">
                <div className="h-1.5 rounded-full bg-accent" style={{ width: `${Math.min(usagePercent, 100)}%` }} />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{usagePercent}% used</p>
            </div>
          )}
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="h-4 w-4" />
            <span className="text-xs font-medium">Per-User Limit</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-foreground">{promo.usage_limit_per_user ?? 1}</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <TrendingUp className="h-4 w-4" />
            <span className="text-xs font-medium">Discount Value</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-foreground">
            {promo.discount_type === 'percentage' ? `${Number(promo.discount_value)}%` : `AED ${Number(promo.discount_value)}`}
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span className="text-xs font-medium">Validity</span>
          </div>
          <p className="mt-2 text-sm font-medium text-foreground">{promo.valid_from ? new Date(promo.valid_from).toISOString().slice(0, 10) : '—'}</p>
          <p className="text-sm text-muted-foreground">to {promo.valid_until ? new Date(promo.valid_until).toISOString().slice(0, 10) : '—'}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Edit Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="mb-4 font-semibold text-foreground">Promo Configuration</h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="code" className="mb-1.5 block text-sm font-medium text-foreground">Promo Code</label>
                  <input
                    id="code"
                    name="code"
                    type="text"
                    defaultValue={promo.code ?? ''}
                    minLength={3}
                    maxLength={20}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm font-mono uppercase focus:border-accent focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-foreground">Display Name</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    defaultValue={promo.name ?? ''}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-accent focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="description_en" className="mb-1.5 block text-sm font-medium text-foreground">Description</label>
                <textarea
                  id="description_en"
                  name="description_en"
                  rows={3}
                  defaultValue={promo.description_en ?? ''}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-accent focus:outline-none"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="discount_type" className="mb-1.5 block text-sm font-medium text-foreground">Discount Type</label>
                  <select
                    id="discount_type"
                    name="discount_type"
                    defaultValue={promo.discount_type ?? 'percentage'}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-accent focus:outline-none"
                  >
                    <option value="percentage">Percentage</option>
                    <option value="fixed_amount">Fixed Amount</option>
                    <option value="free_addon">Free Add-on</option>
                    <option value="free_service">Free Service</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="discount_value" className="mb-1.5 block text-sm font-medium text-foreground">Discount Value</label>
                  <input
                    id="discount_value"
                    name="discount_value"
                    type="number"
                    defaultValue={Number(promo.discount_value) || 0}
                    min={0}
                    step="0.01"
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-accent focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label htmlFor="min_order_aed" className="mb-1.5 block text-sm font-medium text-foreground">Min Order (AED)</label>
                  <input
                    id="min_order_aed"
                    name="min_order_aed"
                    type="number"
                    defaultValue={Number(promo.min_order_aed) || 0}
                    min={0}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-accent focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="max_discount_aed" className="mb-1.5 block text-sm font-medium text-foreground">Max Discount (AED)</label>
                  <input
                    id="max_discount_aed"
                    name="max_discount_aed"
                    type="number"
                    defaultValue={promo.max_discount_aed != null ? Number(promo.max_discount_aed) : ''}
                    min={0}
                    placeholder="No limit"
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-accent focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="usage_limit_per_user" className="mb-1.5 block text-sm font-medium text-foreground">Per-User Limit</label>
                  <input
                    id="usage_limit_per_user"
                    name="usage_limit_per_user"
                    type="number"
                    defaultValue={promo.usage_limit_per_user ?? 1}
                    min={1}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-accent focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label htmlFor="usage_limit_total" className="mb-1.5 block text-sm font-medium text-foreground">Total Usage Limit</label>
                  <input
                    id="usage_limit_total"
                    name="usage_limit_total"
                    type="number"
                    defaultValue={promo.usage_limit_total ?? ''}
                    min={1}
                    placeholder="Unlimited"
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-accent focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="valid_from" className="mb-1.5 block text-sm font-medium text-foreground">Valid From</label>
                  <input
                    id="valid_from"
                    name="valid_from"
                    type="date"
                    defaultValue={promo.valid_from ? new Date(promo.valid_from).toISOString().slice(0, 10) : ''}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-accent focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="valid_until" className="mb-1.5 block text-sm font-medium text-foreground">Valid Until</label>
                  <input
                    id="valid_until"
                    name="valid_until"
                    type="date"
                    defaultValue={promo.valid_until ? new Date(promo.valid_until).toISOString().slice(0, 10) : ''}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-accent focus:outline-none"
                  />
                </div>
              </div>

              {/* Toggle checkboxes */}
              <div className="flex flex-wrap gap-6 pt-2">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" name="is_active" defaultChecked={promo.is_active} className="h-4 w-4 rounded border-input" />
                  <span className="text-foreground">Active</span>
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" name="is_public" defaultChecked={promo.is_public} className="h-4 w-4 rounded border-input" />
                  <span className="text-foreground">Public</span>
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" name="is_first_order_only" defaultChecked={promo.is_first_order_only} className="h-4 w-4 rounded border-input" />
                  <span className="text-foreground">First Order Only</span>
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-2.5 text-sm font-semibold text-accent-foreground hover:bg-accent/90 disabled:opacity-50"
                >
                  {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                  Save Changes
                </button>
                <Link
                  href="/admin/promos"
                  className="rounded-lg border border-border px-6 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted"
                >
                  Cancel
                </Link>
              </div>
            </form>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Info */}
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="mb-3 font-semibold text-foreground">Info</h3>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Created</dt>
                <dd className="text-foreground">{promo.created_at ? new Date(promo.created_at).toISOString().slice(0, 10) : '—'}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">ID</dt>
                <dd className="font-mono text-xs text-muted-foreground">{id}</dd>
              </div>
            </dl>
          </div>

          {/* Danger Zone */}
          <div className="rounded-xl border border-red-200 bg-red-50/50 p-5">
            <h3 className="mb-3 flex items-center gap-2 font-semibold text-red-800">
              <Shield className="h-4 w-4" /> Danger Zone
            </h3>
            <p className="mb-3 text-xs text-red-700">Permanently delete this promotion. This action cannot be undone.</p>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-50"
            >
              {deleting && <Loader2 className="h-4 w-4 animate-spin" />}
              Delete Promotion
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
