import { createAdminClient } from '@/lib/supabase/admin';
import { apiSuccess, apiError } from '@/lib/api/response';

export async function GET() {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('amc_plans')
      .select(`
        id, name_en, tier, description_en, included_services,
        response_time_hours, priority_level, discount_on_extras_pct,
        amc_plan_pricing(id, unit_type, annual_price_aed, monthly_price_aed, quarterly_price_aed)
      `)
      .eq('is_active', true)
      .order('priority_level');

    if (error) return apiError(error.message, 'DB_ERROR', 500);
    return apiSuccess(data);
  } catch (e) {
    return apiError('Internal server error', 'INTERNAL_ERROR', 500);
  }
}
