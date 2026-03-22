import Link from 'next/link';
import { ArrowLeft, Tag, Calendar, Users, TrendingUp, Shield } from 'lucide-react';
import { siteConfig } from '@/config/site';

interface Props {
  params: Promise<{ id: string }>;
}

const promos: Record<string, {
  code: string;
  name: string;
  descriptionEn: string;
  discountType: 'percentage' | 'fixed_amount' | 'free_addon' | 'free_service';
  discountValue: number;
  minOrderAed: number;
  maxDiscountAed: number | null;
  usageLimitTotal: number | null;
  usageLimitPerUser: number;
  usedCount: number;
  uniqueUsers: number;
  totalDiscountGiven: number;
  validFrom: string;
  validUntil: string;
  isPublic: boolean;
  isFirstOrderOnly: boolean;
  isAmcEligible: boolean;
  isActive: boolean;
  createdAt: string;
}> = {
  'promo-welcome20': {
    code: 'WELCOME20',
    name: 'Welcome Discount',
    descriptionEn: 'Get 20% off your first order with ProKeep. Applies to all services.',
    discountType: 'percentage',
    discountValue: 20,
    minOrderAed: 0,
    maxDiscountAed: 200,
    usageLimitTotal: null,
    usageLimitPerUser: 1,
    usedCount: 45,
    uniqueUsers: 45,
    totalDiscountGiven: 6750,
    validFrom: '2025-01-01',
    validUntil: '2027-12-31',
    isPublic: true,
    isFirstOrderOnly: true,
    isAmcEligible: false,
    isActive: true,
    createdAt: '2025-01-01',
  },
  'promo-summer2026': {
    code: 'SUMMER2026',
    name: 'Summer Special',
    descriptionEn: 'Summer promotion - 15% off all cleaning services during the hot season.',
    discountType: 'percentage',
    discountValue: 15,
    minOrderAed: 100,
    maxDiscountAed: 150,
    usageLimitTotal: 500,
    usageLimitPerUser: 3,
    usedCount: 12,
    uniqueUsers: 10,
    totalDiscountGiven: 1440,
    validFrom: '2026-05-01',
    validUntil: '2026-08-31',
    isPublic: true,
    isFirstOrderOnly: false,
    isAmcEligible: false,
    isActive: true,
    createdAt: '2026-04-15',
  },
  'promo-marina10': {
    code: 'MARINA10',
    name: 'Marina Area Discount',
    descriptionEn: 'Fixed AED 50 discount for customers in the Dubai Marina area.',
    discountType: 'fixed_amount',
    discountValue: 50,
    minOrderAed: 150,
    maxDiscountAed: null,
    usageLimitTotal: 100,
    usageLimitPerUser: 2,
    usedCount: 8,
    uniqueUsers: 7,
    totalDiscountGiven: 400,
    validFrom: '2026-01-01',
    validUntil: '2026-12-31',
    isPublic: false,
    isFirstOrderOnly: false,
    isAmcEligible: true,
    isActive: true,
    createdAt: '2025-12-20',
  },
  'promo-firstorder': {
    code: 'FIRSTORDER',
    name: 'Free Balcony Clean',
    descriptionEn: 'Complimentary balcony cleaning add-on with your first order.',
    discountType: 'free_addon',
    discountValue: 75,
    minOrderAed: 0,
    maxDiscountAed: null,
    usageLimitTotal: null,
    usageLimitPerUser: 1,
    usedCount: 23,
    uniqueUsers: 23,
    totalDiscountGiven: 1725,
    validFrom: '2025-01-01',
    validUntil: '2027-12-31',
    isPublic: true,
    isFirstOrderOnly: true,
    isAmcEligible: false,
    isActive: true,
    createdAt: '2025-01-01',
  },
  'promo-refer50': {
    code: 'REFER50',
    name: 'Referral Reward',
    descriptionEn: 'AED 50 off for referred customers. Shared via the referral program.',
    discountType: 'fixed_amount',
    discountValue: 50,
    minOrderAed: 0,
    maxDiscountAed: null,
    usageLimitTotal: null,
    usageLimitPerUser: 1,
    usedCount: 15,
    uniqueUsers: 15,
    totalDiscountGiven: 750,
    validFrom: '2025-06-01',
    validUntil: '2027-12-31',
    isPublic: false,
    isFirstOrderOnly: false,
    isAmcEligible: false,
    isActive: true,
    createdAt: '2025-06-01',
  },
};

function formatDiscountType(type: string): string {
  return type.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatDiscountValue(type: string, value: number): string {
  switch (type) {
    case 'percentage': return `${value}%`;
    case 'fixed_amount': return `${siteConfig.currency} ${value}`;
    case 'free_addon': return `${siteConfig.currency} ${value} (addon value)`;
    case 'free_service': return `${siteConfig.currency} ${value} (service value)`;
    default: return String(value);
  }
}

export default async function PromoDetailPage({ params }: Props) {
  const { id } = await params;
  const promo = promos[id];

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

  const usagePercent = promo.usageLimitTotal
    ? Math.round((promo.usedCount / promo.usageLimitTotal) * 100)
    : null;

  const now = new Date();
  const validUntil = new Date(promo.validUntil);
  const validFrom = new Date(promo.validFrom);
  const isExpired = validUntil < now;
  const isUpcoming = validFrom > now;
  const statusLabel = !promo.isActive ? 'Inactive' : isExpired ? 'Expired' : isUpcoming ? 'Scheduled' : 'Active';
  const statusColor = !promo.isActive
    ? 'bg-gray-100 text-gray-800'
    : isExpired
      ? 'bg-red-100 text-red-800'
      : isUpcoming
        ? 'bg-yellow-100 text-yellow-800'
        : 'bg-green-100 text-green-800';

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
              {promo.isFirstOrderOnly && <span className="rounded-full bg-blue-100 px-1.5 py-0.5 text-[10px] text-blue-800">1st order only</span>}
              {promo.isPublic && <span className="rounded-full bg-purple-100 px-1.5 py-0.5 text-[10px] text-purple-800">Public</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Tag className="h-4 w-4" />
            <span className="text-xs font-medium">Times Used</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-foreground">
            {promo.usedCount}
            {promo.usageLimitTotal && <span className="text-sm font-normal text-muted-foreground"> / {promo.usageLimitTotal}</span>}
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
            <span className="text-xs font-medium">Unique Users</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-foreground">{promo.uniqueUsers}</p>
          <p className="mt-1 text-xs text-muted-foreground">Limit: {promo.usageLimitPerUser} per user</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <TrendingUp className="h-4 w-4" />
            <span className="text-xs font-medium">Total Discounted</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-foreground">{siteConfig.currency} {promo.totalDiscountGiven.toLocaleString()}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Avg: {siteConfig.currency} {promo.usedCount > 0 ? Math.round(promo.totalDiscountGiven / promo.usedCount) : 0} per use
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span className="text-xs font-medium">Validity</span>
          </div>
          <p className="mt-2 text-sm font-medium text-foreground">{promo.validFrom}</p>
          <p className="text-sm text-muted-foreground">to {promo.validUntil}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Edit Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="mb-4 font-semibold text-foreground">Promo Configuration</h3>
            <form className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="code" className="mb-1.5 block text-sm font-medium text-foreground">Promo Code</label>
                  <input
                    id="code"
                    name="code"
                    type="text"
                    defaultValue={promo.code}
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
                    defaultValue={promo.name}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-accent focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="descriptionEn" className="mb-1.5 block text-sm font-medium text-foreground">Description</label>
                <textarea
                  id="descriptionEn"
                  name="descriptionEn"
                  rows={3}
                  defaultValue={promo.descriptionEn}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-accent focus:outline-none"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="discountType" className="mb-1.5 block text-sm font-medium text-foreground">Discount Type</label>
                  <select
                    id="discountType"
                    name="discountType"
                    defaultValue={promo.discountType}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-accent focus:outline-none"
                  >
                    <option value="percentage">Percentage</option>
                    <option value="fixed_amount">Fixed Amount</option>
                    <option value="free_addon">Free Add-on</option>
                    <option value="free_service">Free Service</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="discountValue" className="mb-1.5 block text-sm font-medium text-foreground">Discount Value</label>
                  <input
                    id="discountValue"
                    name="discountValue"
                    type="number"
                    defaultValue={promo.discountValue}
                    min={0}
                    step="0.01"
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-accent focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label htmlFor="minOrderAed" className="mb-1.5 block text-sm font-medium text-foreground">Min Order ({siteConfig.currency})</label>
                  <input
                    id="minOrderAed"
                    name="minOrderAed"
                    type="number"
                    defaultValue={promo.minOrderAed}
                    min={0}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-accent focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="maxDiscountAed" className="mb-1.5 block text-sm font-medium text-foreground">Max Discount ({siteConfig.currency})</label>
                  <input
                    id="maxDiscountAed"
                    name="maxDiscountAed"
                    type="number"
                    defaultValue={promo.maxDiscountAed ?? ''}
                    min={0}
                    placeholder="No limit"
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-accent focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="usageLimitPerUser" className="mb-1.5 block text-sm font-medium text-foreground">Per-User Limit</label>
                  <input
                    id="usageLimitPerUser"
                    name="usageLimitPerUser"
                    type="number"
                    defaultValue={promo.usageLimitPerUser}
                    min={1}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-accent focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label htmlFor="usageLimitTotal" className="mb-1.5 block text-sm font-medium text-foreground">Total Usage Limit</label>
                  <input
                    id="usageLimitTotal"
                    name="usageLimitTotal"
                    type="number"
                    defaultValue={promo.usageLimitTotal ?? ''}
                    min={1}
                    placeholder="Unlimited"
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-accent focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="validFrom" className="mb-1.5 block text-sm font-medium text-foreground">Valid From</label>
                  <input
                    id="validFrom"
                    name="validFrom"
                    type="date"
                    defaultValue={promo.validFrom}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-accent focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="validUntil" className="mb-1.5 block text-sm font-medium text-foreground">Valid Until</label>
                  <input
                    id="validUntil"
                    name="validUntil"
                    type="date"
                    defaultValue={promo.validUntil}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-accent focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="rounded-lg bg-accent px-6 py-2.5 text-sm font-semibold text-accent-foreground hover:bg-accent/90"
                >
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
          {/* Status & Flags */}
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="mb-3 font-semibold text-foreground">Settings</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground">Active</span>
                <div className={`h-5 w-9 rounded-full p-0.5 ${promo.isActive ? 'bg-green-500' : 'bg-gray-300'}`}>
                  <div className={`h-4 w-4 rounded-full bg-white transition-transform ${promo.isActive ? 'translate-x-4' : ''}`} />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground">Public</span>
                <div className={`h-5 w-9 rounded-full p-0.5 ${promo.isPublic ? 'bg-green-500' : 'bg-gray-300'}`}>
                  <div className={`h-4 w-4 rounded-full bg-white transition-transform ${promo.isPublic ? 'translate-x-4' : ''}`} />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground">First Order Only</span>
                <div className={`h-5 w-9 rounded-full p-0.5 ${promo.isFirstOrderOnly ? 'bg-green-500' : 'bg-gray-300'}`}>
                  <div className={`h-4 w-4 rounded-full bg-white transition-transform ${promo.isFirstOrderOnly ? 'translate-x-4' : ''}`} />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground">Care Plan Eligible</span>
                <div className={`h-5 w-9 rounded-full p-0.5 ${promo.isAmcEligible ? 'bg-green-500' : 'bg-gray-300'}`}>
                  <div className={`h-4 w-4 rounded-full bg-white transition-transform ${promo.isAmcEligible ? 'translate-x-4' : ''}`} />
                </div>
              </div>
            </div>
          </div>

          {/* Discount Summary */}
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="mb-3 font-semibold text-foreground">Discount Summary</h3>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Type</dt>
                <dd className="font-medium text-foreground">{formatDiscountType(promo.discountType)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Value</dt>
                <dd className="font-medium text-foreground">{formatDiscountValue(promo.discountType, promo.discountValue)}</dd>
              </div>
              {promo.maxDiscountAed && (
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Max Discount</dt>
                  <dd className="font-medium text-foreground">{siteConfig.currency} {promo.maxDiscountAed}</dd>
                </div>
              )}
              {promo.minOrderAed > 0 && (
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Min Order</dt>
                  <dd className="font-medium text-foreground">{siteConfig.currency} {promo.minOrderAed}</dd>
                </div>
              )}
            </dl>
          </div>

          {/* Meta */}
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="mb-3 font-semibold text-foreground">Info</h3>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Created</dt>
                <dd className="text-foreground">{promo.createdAt}</dd>
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
            <p className="mb-3 text-xs text-red-700">Deactivating a promo code will prevent it from being used in any future orders.</p>
            <button className="w-full rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50">
              {promo.isActive ? 'Deactivate Promo' : 'Reactivate Promo'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
