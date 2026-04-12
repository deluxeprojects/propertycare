import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { calculatePrice } from '@/lib/services/pricing.service';
import { apiSuccess, apiError, apiPaginated } from '@/lib/api/response';
import { rateLimit } from '@/lib/api/rate-limit';

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown';
    const rl = rateLimit(ip, { limit: 10, windowMs: 60_000 });
    if (!rl.success) return apiError('Too many requests', 'RATE_LIMITED', 429);
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return apiError('Unauthorized', 'UNAUTHORIZED', 401);

    const body = await request.json();
    const { serviceId, variantId, addonIds, scheduledDate, scheduledTimeSlot,
            areaId, buildingId, isExpress, notesCustomer, promoCode,
            customerName, customerPhone, customerEmail } = body;

    if (!serviceId || !scheduledDate || !scheduledTimeSlot) {
      return apiError('serviceId, scheduledDate, and scheduledTimeSlot are required', 'VALIDATION_ERROR', 400);
    }

    // Input validation
    const uuidRe = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const dateRe = /^\d{4}-\d{2}-\d{2}$/;
    const timeSlotRe = /^\d{2}:\d{2}-\d{2}:\d{2}$/;

    if (!uuidRe.test(serviceId)) return apiError('Invalid serviceId format', 'VALIDATION_ERROR', 400);
    if (variantId && !uuidRe.test(variantId)) return apiError('Invalid variantId format', 'VALIDATION_ERROR', 400);
    if (areaId && !uuidRe.test(areaId)) return apiError('Invalid areaId format', 'VALIDATION_ERROR', 400);
    if (buildingId && !uuidRe.test(buildingId)) return apiError('Invalid buildingId format', 'VALIDATION_ERROR', 400);
    if (!dateRe.test(scheduledDate) || isNaN(Date.parse(scheduledDate))) return apiError('Invalid scheduledDate format (YYYY-MM-DD)', 'VALIDATION_ERROR', 400);
    if (!timeSlotRe.test(scheduledTimeSlot)) return apiError('Invalid scheduledTimeSlot format (HH:MM-HH:MM)', 'VALIDATION_ERROR', 400);
    if (addonIds && (!Array.isArray(addonIds) || addonIds.some((id: unknown) => typeof id !== 'string' || !uuidRe.test(id as string)))) {
      return apiError('addonIds must be an array of valid UUIDs', 'VALIDATION_ERROR', 400);
    }
    if (notesCustomer && typeof notesCustomer !== 'string') return apiError('notesCustomer must be a string', 'VALIDATION_ERROR', 400);
    if (promoCode && typeof promoCode !== 'string') return apiError('promoCode must be a string', 'VALIDATION_ERROR', 400);

    // Server-side price calculation to prevent client-side price tampering
    const adminSupabase = createAdminClient();
    const pricing = await calculatePrice(adminSupabase, {
      serviceId,
      variantId,
      addonIds,
      areaId,
      buildingId,
      isExpress,
      promoCode,
      scheduledDate,
    });

    // Create order
    const { data: order, error } = await supabase
      .from('orders')
      .insert({
        customer_id: user.id,
        service_id: serviceId,
        variant_id: variantId || null,
        scheduled_date: scheduledDate,
        scheduled_time_slot: scheduledTimeSlot,
        area_id: areaId || null,
        building_id: buildingId || null,
        is_express: isExpress || false,
        notes_customer: notesCustomer || null,
        source: 'website',
        base_amount_aed: pricing.basePrice,
        addons_amount_aed: pricing.addonsTotal,
        pricing_adjustments_aed: pricing.pricingAdjustments,
        express_surcharge_aed: pricing.expressSurcharge,
        discount_amount_aed: pricing.discount,
        vat_amount_aed: pricing.vat,
        total_amount_aed: pricing.total,
        metadata: {
          customerName: customerName || null,
          customerPhone: customerPhone || null,
          customerEmail: customerEmail || null,
        },
        status: 'pending',
        payment_status: 'pending',
      })
      .select()
      .single();

    if (error) return apiError(error.message, 'DB_ERROR', 500);

    // Insert addons
    if (addonIds && addonIds.length > 0 && order) {
      const adminClient = createAdminClient();
      const { data: addons } = await adminClient
        .from('service_addons')
        .select('id, price_aed')
        .in('id', addonIds);

      if (addons && addons.length > 0) {
        await supabase.from('order_addons').insert(
          addons.map((a) => ({
            order_id: order.id,
            addon_id: a.id,
            quantity: 1,
            unit_price_aed: a.price_aed,
            total_price_aed: a.price_aed,
          }))
        );
      }
    }

    return apiSuccess(order, 201);
  } catch (e) {
    return apiError('Failed to create order', 'INTERNAL_ERROR', 500);
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return apiError('Unauthorized', 'UNAUTHORIZED', 401);

    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') ?? '1');
    const perPage = parseInt(url.searchParams.get('per_page') ?? '20');
    const status = url.searchParams.get('status');

    const from = (page - 1) * perPage;
    const to = from + perPage - 1;

    let query = supabase
      .from('orders')
      .select(`
        id, order_number, status, service_id, variant_id, scheduled_date, scheduled_time_slot,
        area_id, is_express, notes_customer, base_amount_aed, addons_amount_aed,
        express_surcharge_aed, discount_amount_aed, vat_amount_aed, total_amount_aed,
        payment_status, rating, review_text, source, created_at,
        services(name_en, service_code), service_variants(variant_label), areas(name_en)
      `, { count: 'exact' })
      .eq('customer_id', user.id)
      .order('created_at', { ascending: false });

    if (status) query = query.eq('status', status);

    const { data, error, count } = await query.range(from, to);

    if (error) return apiError(error.message, 'DB_ERROR', 500);
    return apiPaginated(data ?? [], count ?? 0, page, perPage);
  } catch {
    return apiError('Internal server error', 'INTERNAL_ERROR', 500);
  }
}
