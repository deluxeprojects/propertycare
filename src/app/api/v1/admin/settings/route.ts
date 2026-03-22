import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { apiSuccess, apiError } from '@/lib/api/response';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return apiError('Unauthorized', 'UNAUTHORIZED', 401);

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (!profile || !['super_admin', 'admin'].includes(profile.role)) {
      return apiError('Forbidden', 'FORBIDDEN', 403);
    }

    const { data, error } = await supabase
      .from('system_settings')
      .select('key, value, category, label, description, is_sensitive')
      .order('category');

    if (error) return apiError(error.message, 'DB_ERROR', 500);

    // Mask sensitive values for non-super_admin
    const masked = (data ?? []).map(s => ({
      ...s,
      value: s.is_sensitive && profile.role !== 'super_admin' ? '********' : s.value,
    }));

    return apiSuccess(masked);
  } catch {
    return apiError('Internal server error', 'INTERNAL_ERROR', 500);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return apiError('Unauthorized', 'UNAUTHORIZED', 401);

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (!profile || profile.role !== 'super_admin') {
      return apiError('Only super_admin can update settings', 'FORBIDDEN', 403);
    }

    const { key, value } = await request.json();
    if (!key) return apiError('key is required', 'VALIDATION_ERROR', 400);

    const { data, error } = await supabase
      .from('system_settings')
      .update({ value: JSON.stringify(value), updated_by: user.id })
      .eq('key', key)
      .select()
      .single();

    if (error) return apiError(error.message, 'DB_ERROR', 500);
    return apiSuccess(data);
  } catch {
    return apiError('Internal server error', 'INTERNAL_ERROR', 500);
  }
}
