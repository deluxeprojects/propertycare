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
      .from('pricing_rules')
      .select('*')
      .order('priority', { ascending: false });

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
    const { name, ruleType, serviceId, categoryId, areaId, modifierType, modifierValue, priority, validFrom, validUntil, isStackable } = body;

    if (!name || !modifierValue) {
      return apiError('Missing required fields', 'VALIDATION_ERROR', 400);
    }

    const admin = createAdminClient();
    const { data, error } = await admin
      .from('pricing_rules')
      .insert({
        name,
        rule_type: ruleType || 'surcharge',
        service_id: serviceId || null,
        category_id: categoryId || null,
        area_id: areaId || null,
        modifier_type: modifierType || 'percentage',
        modifier_value: parseFloat(modifierValue),
        priority: priority ? parseInt(priority) : 0,
        valid_from: validFrom || null,
        valid_until: validUntil || null,
        is_stackable: isStackable ?? false,
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
