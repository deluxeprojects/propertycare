import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { apiSuccess, apiError } from '@/lib/api/response';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return apiError('Unauthorized', 'UNAUTHORIZED', 401);

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (!profile || !['super_admin', 'admin', 'manager'].includes(profile.role)) {
      return apiError('Forbidden', 'FORBIDDEN', 403);
    }

    const admin = createAdminClient();
    const { data, error } = await admin
      .from('promo_codes')
      .select('*')
      .order('created_at', { ascending: false });

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

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (!profile || !['super_admin', 'admin', 'manager'].includes(profile.role)) {
      return apiError('Forbidden', 'FORBIDDEN', 403);
    }

    const body = await request.json();
    const { code, name, description, discountType, discountValue, minOrderAmount, maxDiscount, usageLimitTotal, usageLimitPerUser, validFrom, validUntil, isPublic, isFirstOrderOnly } = body;

    if (!code || !name || !discountValue || !validFrom || !validUntil) {
      return apiError('Missing required fields', 'VALIDATION_ERROR', 400);
    }

    const admin = createAdminClient();
    const { data, error } = await admin
      .from('promo_codes')
      .insert({
        code: code.toUpperCase(),
        name,
        description: description || null,
        discount_type: discountType || 'percentage',
        discount_value: parseFloat(discountValue),
        min_order_amount: minOrderAmount ? parseFloat(minOrderAmount) : null,
        max_discount_amount: maxDiscount ? parseFloat(maxDiscount) : null,
        usage_limit_total: usageLimitTotal ? parseInt(usageLimitTotal) : null,
        usage_limit_per_user: usageLimitPerUser ? parseInt(usageLimitPerUser) : null,
        valid_from: validFrom,
        valid_until: validUntil,
        is_public: isPublic ?? false,
        is_first_order_only: isFirstOrderOnly ?? false,
        is_active: true,
      })
      .select()
      .single();

    if (error) return apiError(error.message, 'DB_ERROR', 500);
    return apiSuccess(data, 201);
  } catch {
    return apiError('Internal server error', 'INTERNAL_ERROR', 500);
  }
}
