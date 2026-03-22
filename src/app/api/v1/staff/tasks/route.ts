import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { apiSuccess, apiError } from '@/lib/api/response';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return apiError('Unauthorized', 'UNAUTHORIZED', 401);

    const url = new URL(request.url);
    const date = url.searchParams.get('date') ?? new Date().toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('orders')
      .select(`
        id, order_number, scheduled_date, scheduled_time_slot, status,
        notes_customer, actual_start_at, actual_end_at,
        services(name_en, service_code, duration_minutes),
        service_variants(variant_label),
        profiles!orders_customer_id_fkey(full_name, phone),
        customer_addresses!orders_address_id_fkey(building_name, unit_number, floor, street_address, special_instructions),
        areas(name_en)
      `)
      .eq('assigned_technician_id', user.id)
      .eq('scheduled_date', date)
      .not('status', 'in', '("cancelled","refunded")')
      .order('scheduled_time_slot');

    if (error) return apiError(error.message, 'DB_ERROR', 500);
    return apiSuccess(data);
  } catch {
    return apiError('Internal server error', 'INTERNAL_ERROR', 500);
  }
}
