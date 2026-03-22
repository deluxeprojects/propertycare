import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { apiSuccess, apiError } from '@/lib/api/response';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return apiError('Unauthorized', 'UNAUTHORIZED', 401);

    const { data, error } = await supabase
      .from('services')
      .select(`
        *,
        service_categories(id, slug, name_en),
        service_variants(id, variant_label, price_aed, duration_minutes, sort_order, is_active),
        service_addons(id, name_en, price_aed, duration_minutes, sort_order, is_active)
      `)
      .order('sort_order');

    if (error) return apiError(error.message, 'DB_ERROR', 500);
    return apiSuccess(data);
  } catch {
    return apiError('Internal server error', 'INTERNAL_ERROR', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return apiError('Unauthorized', 'UNAUTHORIZED', 401);

    const body = await request.json();
    const { data, error } = await supabase
      .from('services')
      .insert({
        category_id: body.categoryId,
        slug: body.slug,
        service_code: body.serviceCode,
        name_en: body.nameEn,
        short_desc_en: body.shortDescEn,
        long_desc_en: body.longDescEn,
        base_price_aed: body.basePriceAed,
        price_unit: body.priceUnit,
        duration_minutes: body.durationMinutes,
        is_active: body.isActive ?? true,
        is_featured: body.isFeatured ?? false,
        tags: body.tags ?? [],
      })
      .select()
      .single();

    if (error) return apiError(error.message, 'DB_ERROR', 500);
    return apiSuccess(data, 201);
  } catch {
    return apiError('Internal server error', 'INTERNAL_ERROR', 500);
  }
}
