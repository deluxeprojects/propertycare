import { createAdminClient } from '@/lib/supabase/admin';
import { apiSuccess, apiError } from '@/lib/api/response';

export async function GET() {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('services')
      .select(`
        id, slug, service_code, name_en, short_desc_en, base_price_aed, price_unit,
        duration_minutes, is_express_available, is_featured, image_url, tags,
        service_categories(id, slug, name_en),
        service_variants(id, variant_label, price_aed, duration_minutes, sort_order),
        service_addons(id, name_en, price_aed, duration_minutes, sort_order)
      `)
      .eq('is_active', true)
      .eq('is_hidden', false)
      .order('sort_order');

    if (error) return apiError(error.message, 'DB_ERROR', 500);
    return apiSuccess(data);
  } catch (e) {
    return apiError('Internal server error', 'INTERNAL_ERROR', 500);
  }
}
