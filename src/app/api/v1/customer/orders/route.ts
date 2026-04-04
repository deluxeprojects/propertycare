import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { apiSuccess, apiError, apiPaginated } from '@/lib/api/response';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return apiError('Unauthorized', 'UNAUTHORIZED', 401);

    const body = await request.json();
    const { serviceId, variantId, addonIds, scheduledDate, scheduledTimeSlot,
            areaId, buildingId, isExpress, notesCustomer,
            baseAmount, addonsAmount, expressSurcharge, discount, vat, total } = body;

    if (!serviceId || !scheduledDate || !scheduledTimeSlot) {
      return apiError('serviceId, scheduledDate, and scheduledTimeSlot are required', 'VALIDATION_ERROR', 400);
    }

    // TODO-REVIEW: Pricing is currently supplied by the client. For production,
    // re-calculate server-side via calculatePrice() to prevent price tampering.
    // The client values are used here to avoid blocking the booking flow until
    // the pricing service integration is fully wired in.

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
        base_amount_aed: baseAmount || 0,
        addons_amount_aed: addonsAmount || 0,
        express_surcharge_aed: expressSurcharge || 0,
        discount_amount_aed: discount || 0,
        vat_amount_aed: vat || 0,
        total_amount_aed: total || 0,
        status: 'pending',
        payment_status: 'pending',
      })
      .select()
      .single();

    if (error) return apiError(error.message, 'DB_ERROR', 500);

    // Insert addons
    if (addonIds && addonIds.length > 0 && order) {
      const adminClient = (await import('@/lib/supabase/admin')).createAdminClient();
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
      .select('*, services(name_en, service_code), service_variants(variant_label), areas(name_en)', { count: 'exact' })
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
