import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { apiError, apiPaginated } from '@/lib/api/response';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return apiError('Unauthorized', 'UNAUTHORIZED', 401);

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (!profile || !['super_admin', 'admin', 'manager'].includes(profile.role)) {
      return apiError('Forbidden', 'FORBIDDEN', 403);
    }

    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') ?? '1');
    const perPage = parseInt(url.searchParams.get('per_page') ?? '25');
    const status = url.searchParams.get('status');
    const from = (page - 1) * perPage;
    const to = from + perPage - 1;

    let query = supabase
      .from('invoices')
      .select('*, profiles!invoices_customer_id_fkey(full_name, email)', { count: 'exact' });

    if (status) query = query.eq('status', status);

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) return apiError(error.message, 'DB_ERROR', 500);
    return apiPaginated(data ?? [], count ?? 0, page, perPage);
  } catch {
    return apiError('Internal server error', 'INTERNAL_ERROR', 500);
  }
}
