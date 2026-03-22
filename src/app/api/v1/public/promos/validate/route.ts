import { NextRequest } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { apiSuccess, apiError } from '@/lib/api/response';

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();
    if (!code) return apiError('Promo code is required', 'VALIDATION_ERROR', 400);

    const supabase = createAdminClient();
    const { data: promo, error } = await supabase
      .from('promotions')
      .select('id, code, name, discount_type, discount_value, min_order_aed, max_discount_aed, is_first_order_only, valid_from, valid_until')
      .eq('code', code.toUpperCase())
      .eq('is_active', true)
      .single();

    if (error || !promo) return apiError('Invalid promo code', 'PROMO_INVALID', 404);

    const now = new Date();
    if (new Date(promo.valid_from) > now) return apiError('Promo not yet active', 'PROMO_INVALID', 400);
    if (new Date(promo.valid_until) < now) return apiError('Promo has expired', 'PROMO_EXPIRED', 400);

    return apiSuccess({
      valid: true,
      code: promo.code,
      discountType: promo.discount_type,
      discountValue: promo.discount_value,
      minOrder: promo.min_order_aed,
      maxDiscount: promo.max_discount_aed,
      firstOrderOnly: promo.is_first_order_only,
    });
  } catch (e) {
    return apiError('Validation failed', 'INTERNAL_ERROR', 500);
  }
}
