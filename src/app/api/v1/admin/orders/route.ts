import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { apiError, apiPaginated } from '@/lib/api/response';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return apiError('Unauthorized', 'UNAUTHORIZED', 401);

    // Check admin role
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (!profile || !['super_admin', 'admin', 'manager', 'operator'].includes(profile.role)) {
      return apiError('Forbidden', 'FORBIDDEN', 403);
    }

    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') ?? '1');
    const perPage = parseInt(url.searchParams.get('per_page') ?? '25');
    const status = url.searchParams.get('status');
    const areaId = url.searchParams.get('area_id');

    const from = (page - 1) * perPage;
    const to = from + perPage - 1;

    let query = supabase
      .from('orders')
      .select(`
        *, services(name_en, service_code), service_variants(variant_label),
        areas(name_en), profiles!orders_customer_id_fkey(full_name, phone, email)
      `, { count: 'exact' });

    if (status) query = query.eq('status', status);
    if (areaId) query = query.eq('area_id', areaId);

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) return apiError(error.message, 'DB_ERROR', 500);
    return apiPaginated(data ?? [], count ?? 0, page, perPage);
  } catch {
    return apiError('Internal server error', 'INTERNAL_ERROR', 500);
  }
}
