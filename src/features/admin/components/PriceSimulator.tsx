'use client';

import { useState } from 'react';
import { Calculator } from 'lucide-react';

interface PriceBreakdown {
  basePrice: number;
  addonsTotal: number;
  pricingAdjustments: number;
  expressSurcharge: number;
  subtotal: number;
  discount: number;
  preVat: number;
  vat: number;
  total: number;
  appliedRules: { name: string; amount: number }[];
}

export function PriceSimulator() {
  const [serviceId, setServiceId] = useState('');
  const [isExpress, setIsExpress] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [result, setResult] = useState<PriceBreakdown | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const simulate = async () => {
    if (!serviceId) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/v1/public/pricing/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ serviceId, isExpress, promoCode: promoCode || undefined }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        setError(errData.error || 'Calculation failed');
        setResult(null);
        setLoading(false);
        return;
      }
      const data = await res.json();
      setResult(data);
    } catch {
      setError('Network error. Please try again.');
      setResult(null);
    }
    setLoading(false);
  };

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h3 className="mb-4 flex items-center gap-2 font-semibold text-foreground">
        <Calculator className="h-4 w-4 text-accent" /> Price Simulator
      </h3>

      <div className="space-y-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">Service ID</label>
          <input
            type="text"
            value={serviceId}
            onChange={(e) => setServiceId(e.target.value)}
            placeholder="Paste service UUID"
            className="w-full rounded-lg border border-input bg-background px-3 py-1.5 text-sm focus:border-accent focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">Promo Code</label>
          <input
            type="text"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            placeholder="e.g. WELCOME20"
            className="w-full rounded-lg border border-input bg-background px-3 py-1.5 text-sm focus:border-accent focus:outline-none"
          />
        </div>

        <label className="flex items-center gap-2 text-sm text-foreground">
          <input type="checkbox" checked={isExpress} onChange={(e) => setIsExpress(e.target.checked)} className="rounded" />
          Express (+50%)
        </label>

        <button
          onClick={simulate}
          disabled={!serviceId || loading}
          className="w-full rounded-lg bg-accent py-2 text-sm font-semibold text-accent-foreground hover:bg-accent/90 disabled:opacity-50"
        >
          {loading ? 'Calculating...' : 'Calculate Price'}
        </button>
      </div>

      {error && (
        <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">{error}</p>
      )}

      {result && (
        <div className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
          <div className="flex justify-between"><span className="text-muted-foreground">Base</span><span>AED {result.basePrice.toFixed(2)}</span></div>
          {result.addonsTotal > 0 && <div className="flex justify-between"><span className="text-muted-foreground">Add-ons</span><span>AED {result.addonsTotal.toFixed(2)}</span></div>}
          {result.pricingAdjustments !== 0 && <div className="flex justify-between"><span className="text-muted-foreground">Adjustments</span><span>AED {result.pricingAdjustments.toFixed(2)}</span></div>}
          {result.expressSurcharge > 0 && <div className="flex justify-between"><span className="text-yellow-600">Express</span><span className="text-yellow-600">AED {result.expressSurcharge.toFixed(2)}</span></div>}
          {result.discount > 0 && <div className="flex justify-between"><span className="text-green-600">Discount</span><span className="text-green-600">-AED {result.discount.toFixed(2)}</span></div>}
          <div className="flex justify-between"><span className="text-muted-foreground">VAT (5%)</span><span>AED {result.vat.toFixed(2)}</span></div>
          <div className="flex justify-between border-t border-border pt-2 font-bold"><span>Total</span><span>AED {result.total.toFixed(2)}</span></div>

          {result.appliedRules.length > 0 && (
            <div className="mt-2 rounded-lg bg-muted p-3">
              <p className="mb-1 text-xs font-medium text-muted-foreground">Applied Rules:</p>
              {result.appliedRules.map((r, i) => (
                <p key={i} className="text-xs text-foreground">{r.name}: AED {r.amount.toFixed(2)}</p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
