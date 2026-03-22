import { createAdminClient } from '@/lib/supabase/admin';
import { apiSuccess, apiError } from '@/lib/api/response';

export async function GET() {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('areas')
      .select('id, slug, name_en, zone_group, description_en, latitude, longitude, image_url, approximate_units, property_types, meta_title_en, meta_desc_en')
      .eq('is_active', true)
      .order('name_en');

    if (error) return apiError(error.message, 'DB_ERROR', 500);
    return apiSuccess(data);
  } catch (e) {
    return apiError('Internal server error', 'INTERNAL_ERROR', 500);
  }
}
