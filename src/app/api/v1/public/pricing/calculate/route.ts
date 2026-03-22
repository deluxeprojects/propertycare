import { NextRequest } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { calculatePrice } from '@/lib/services/pricing.service';
import { apiSuccess, apiError } from '@/lib/api/response';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { serviceId, variantId, addonIds, areaId, buildingId, isExpress, promoCode, scheduledDate, scheduledTime } = body;

    if (!serviceId) return apiError('serviceId is required', 'VALIDATION_ERROR', 400);

    const supabase = createAdminClient();
    const breakdown = await calculatePrice(supabase, {
      serviceId,
      variantId,
      addonIds,
      areaId,
      buildingId,
      isExpress,
      promoCode,
      scheduledDate,
      scheduledTime,
    });

    return apiSuccess(breakdown);
  } catch (e) {
    return apiError('Price calculation failed', 'INTERNAL_ERROR', 500);
  }
}
