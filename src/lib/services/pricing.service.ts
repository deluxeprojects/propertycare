import type { SupabaseClient } from '@supabase/supabase-js';
import { VAT_RATE } from '@/config/constants';

interface PriceInput {
  serviceId: string;
  variantId?: string;
  addonIds?: string[];
  areaId?: string;
  buildingId?: string;
  isExpress?: boolean;
  promoCode?: string;
  scheduledDate?: string;
  scheduledTime?: string;
}

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
  promoApplied?: { code: string; discount: number };
}

export async function calculatePrice(
  supabase: SupabaseClient,
  input: PriceInput
): Promise<PriceBreakdown> {
  // 1. Get base price
  let basePrice = 0;
  if (input.variantId) {
    const { data: variant } = await supabase
      .from('service_variants')
      .select('price_aed')
      .eq('id', input.variantId)
      .single();
    basePrice = variant?.price_aed ?? 0;
  } else {
    const { data: service } = await supabase
      .from('services')
      .select('base_price_aed, express_surcharge_pct')
      .eq('id', input.serviceId)
      .single();
    basePrice = service?.base_price_aed ?? 0;
  }

  // 2. Add-ons
  let addonsTotal = 0;
  if (input.addonIds && input.addonIds.length > 0) {
    const { data: addons } = await supabase
      .from('service_addons')
      .select('price_aed')
      .in('id', input.addonIds);
    addonsTotal = (addons ?? []).reduce((sum, a) => sum + (a.price_aed ?? 0), 0);
  }

  // 3-7. Pricing rules
  const { data: rules } = await supabase
    .from('pricing_rules')
    .select('*')
    .eq('is_active', true)
    .order('priority', { ascending: false });

  let pricingAdjustments = 0;
  const appliedRules: { name: string; amount: number }[] = [];

  for (const rule of rules ?? []) {
    // Check if rule applies to this service/area/building
    if (rule.service_id && rule.service_id !== input.serviceId) continue;
    if (rule.area_id && rule.area_id !== input.areaId) continue;
    if (rule.building_id && rule.building_id !== input.buildingId) continue;

    // Check time/day conditions
    if (rule.conditions) {
      const conditions = rule.conditions as Record<string, unknown>;
      if (conditions.day_of_week && input.scheduledDate) {
        const dayOfWeek = new Date(input.scheduledDate).getDay();
        const allowedDays = conditions.day_of_week as number[];
        if (!allowedDays.includes(dayOfWeek)) continue;
      }
    }

    let adjustment = 0;
    if (rule.modifier_type === 'percentage') {
      adjustment = (basePrice + addonsTotal) * (rule.modifier_value / 100);
    } else {
      adjustment = rule.modifier_value;
    }

    if (!rule.is_stackable && appliedRules.length > 0) {
      // Non-stackable: only apply if higher than existing
      const existingTotal = appliedRules.reduce((s, r) => s + r.amount, 0);
      if (adjustment <= existingTotal) continue;
      pricingAdjustments = adjustment;
      appliedRules.length = 0;
    } else {
      pricingAdjustments += adjustment;
    }
    appliedRules.push({ name: rule.name, amount: adjustment });
  }

  // 8. Express surcharge
  // TODO-REVIEW: This re-fetches the service row that was already fetched in step 1
  // when no variantId is provided. Refactor to reuse the earlier query result.
  let expressSurcharge = 0;
  if (input.isExpress) {
    const { data: service } = await supabase
      .from('services')
      .select('express_surcharge_pct')
      .eq('id', input.serviceId)
      .single();
    const pct = service?.express_surcharge_pct ?? 50;
    expressSurcharge = (basePrice + addonsTotal) * (pct / 100);
  }

  // 9. Subtotal
  const subtotal = basePrice + addonsTotal + pricingAdjustments + expressSurcharge;

  // 10. Promo discount
  let discount = 0;
  let promoApplied: { code: string; discount: number } | undefined;
  if (input.promoCode) {
    const { data: promo } = await supabase
      .from('promotions')
      .select('*')
      .eq('code', input.promoCode.toUpperCase())
      .eq('is_active', true)
      .single();

    if (promo) {
      if (promo.discount_type === 'percentage') {
        discount = subtotal * (promo.discount_value / 100);
        if (promo.max_discount_aed && discount > promo.max_discount_aed) {
          discount = promo.max_discount_aed;
        }
      } else if (promo.discount_type === 'fixed_amount') {
        discount = promo.discount_value;
      }
      promoApplied = { code: promo.code, discount };
    }
  }

  // 11. Round to nearest 5
  const preVat = Math.round((subtotal - discount) / 5) * 5;

  // 12. VAT
  const vat = Math.round(preVat * VAT_RATE * 100) / 100;

  // 13. Final
  const total = Math.round((preVat + vat) * 100) / 100;

  return {
    basePrice,
    addonsTotal,
    pricingAdjustments,
    expressSurcharge,
    subtotal,
    discount,
    preVat,
    vat,
    total,
    appliedRules,
    promoApplied,
  };
}
