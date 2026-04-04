import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { apiSuccess, apiError } from '@/lib/api/response';

interface Props { params: Promise<{ id: string }> }

const ALLOWED_UPDATE_FIELDS = new Set([
  'category_id',
  'slug',
  'service_code',
  'name_en',
  'name_ar',
  'short_desc_en',
  'short_desc_ar',
  'long_desc_en',
  'long_desc_ar',
  'base_price_aed',
  'price_unit',
  'duration_minutes',
  'is_active',
  'is_featured',
  'is_hidden',
  'tags',
  'hero_image',
  'gallery_images',
  'sort_order',
]);

export async function PATCH(request: NextRequest, { params }: Props) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return apiError('Unauthorized', 'UNAUTHORIZED', 401);

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (!profile || !['super_admin', 'admin', 'manager'].includes(profile.role)) {
      return apiError('Forbidden', 'FORBIDDEN', 403);
    }

    const { id } = await params;
    const body = await request.json();

    // Whitelist fields to prevent mass-assignment
    const sanitized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(body)) {
      if (ALLOWED_UPDATE_FIELDS.has(key)) {
        sanitized[key] = value;
      }
    }

    if (Object.keys(sanitized).length === 0) {
      return apiError('No valid fields to update', 'VALIDATION_ERROR', 400);
    }

    const admin = createAdminClient();
    const { data, error } = await admin.from('services').update(sanitized).eq('id', id).select().single();
    if (error) return apiError(error.message, 'DB_ERROR', 500);
    return apiSuccess(data);
  } catch {
    return apiError('Internal server error', 'INTERNAL_ERROR', 500);
  }
}
