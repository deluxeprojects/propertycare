import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { apiSuccess, apiError } from '@/lib/api/response';

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
    const period = url.searchParams.get('period') ?? '30d';

    let daysAgo = 30;
    if (period === '7d') daysAgo = 7;
    if (period === '90d') daysAgo = 90;
    if (period === '1y') daysAgo = 365;

    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - daysAgo);

    const { data: orders } = await supabase
      .from('orders')
      .select('total_amount_aed, created_at, status, service_id')
      .gte('created_at', fromDate.toISOString())
      .not('status', 'in', '("cancelled","refunded")');

    const totalRevenue = (orders ?? []).reduce((sum, o) => sum + (o.total_amount_aed ?? 0), 0);
    const orderCount = orders?.length ?? 0;
    const avgOrderValue = orderCount > 0 ? totalRevenue / orderCount : 0;

    return apiSuccess({
      period,
      totalRevenue,
      orderCount,
      avgOrderValue,
      fromDate: fromDate.toISOString().split('T')[0],
    });
  } catch {
    return apiError('Internal server error', 'INTERNAL_ERROR', 500);
  }
}
