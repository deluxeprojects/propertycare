import type { SupabaseClient } from '@supabase/supabase-js';

interface CreateOrderInput {
  customerId: string;
  serviceId: string;
  variantId?: string;
  addonIds?: string[];
  scheduledDate: string;
  scheduledTimeSlot: string;
  addressId: string;
  areaId?: string;
  buildingId?: string;
  isExpress?: boolean;
  promoCode?: string;
  notesCustomer?: string;
  source?: string;
  baseAmount: number;
  addonsAmount: number;
  pricingAdjustments: number;
  expressSurcharge: number;
  discountAmount: number;
  vatAmount: number;
  totalAmount: number;
  promotionId?: string;
}

export async function createOrder(
  supabase: SupabaseClient,
  input: CreateOrderInput
) {
  const { data: order, error } = await supabase
    .from('orders')
    .insert({
      customer_id: input.customerId,
      service_id: input.serviceId,
      variant_id: input.variantId,
      scheduled_date: input.scheduledDate,
      scheduled_time_slot: input.scheduledTimeSlot,
      address_id: input.addressId,
      area_id: input.areaId,
      building_id: input.buildingId,
      is_express: input.isExpress ?? false,
      notes_customer: input.notesCustomer,
      source: input.source ?? 'website',
      base_amount_aed: input.baseAmount,
      addons_amount_aed: input.addonsAmount,
      pricing_adjustments_aed: input.pricingAdjustments,
      express_surcharge_aed: input.expressSurcharge,
      discount_amount_aed: input.discountAmount,
      vat_amount_aed: input.vatAmount,
      total_amount_aed: input.totalAmount,
      promotion_id: input.promotionId,
    })
    .select()
    .single();

  if (error) throw error;

  // Insert add-ons
  if (input.addonIds && input.addonIds.length > 0 && order) {
    const { data: addons } = await supabase
      .from('service_addons')
      .select('id, price_aed')
      .in('id', input.addonIds);

    if (addons) {
      await supabase.from('order_addons').insert(
        addons.map((addon) => ({
          order_id: order.id,
          addon_id: addon.id,
          quantity: 1,
          unit_price_aed: addon.price_aed,
          total_price_aed: addon.price_aed,
        }))
      );
    }
  }

  return order;
}

export async function updateOrderStatus(
  supabase: SupabaseClient,
  orderId: string,
  status: string,
  _notes?: string
) {
  const { data, error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function assignTechnician(
  supabase: SupabaseClient,
  orderId: string,
  technicianProfileId: string
) {
  const { data, error } = await supabase
    .from('orders')
    .update({
      assigned_technician_id: technicianProfileId,
      status: 'assigned',
    })
    .eq('id', orderId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getOrdersByCustomer(
  supabase: SupabaseClient,
  customerId: string,
  page = 1,
  perPage = 20
) {
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  const { data, error, count } = await supabase
    .from('orders')
    .select('*, services(name_en, service_code), service_variants(variant_label), areas(name_en)', { count: 'exact' })
    .eq('customer_id', customerId)
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) throw error;
  return { data, total: count ?? 0 };
}

export async function getOrdersForAdmin(
  supabase: SupabaseClient,
  filters: {
    status?: string;
    areaId?: string;
    serviceId?: string;
    technicianId?: string;
    dateFrom?: string;
    dateTo?: string;
    search?: string;
    page?: number;
    perPage?: number;
  }
) {
  const page = filters.page ?? 1;
  const perPage = filters.perPage ?? 25;
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  let query = supabase
    .from('orders')
    .select('*, services(name_en, service_code), service_variants(variant_label), areas(name_en), profiles!orders_customer_id_fkey(full_name, phone, email)', { count: 'exact' });

  if (filters.status) query = query.eq('status', filters.status);
  if (filters.areaId) query = query.eq('area_id', filters.areaId);
  if (filters.technicianId) query = query.eq('assigned_technician_id', filters.technicianId);
  if (filters.dateFrom) query = query.gte('scheduled_date', filters.dateFrom);
  if (filters.dateTo) query = query.lte('scheduled_date', filters.dateTo);

  const { data, error, count } = await query
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) throw error;
  return { data, total: count ?? 0 };
}
