import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { apiSuccess, apiError } from '@/lib/api/response';

interface Props { params: Promise<{ id: string }> }

// Allowed fields for order updates — prevents arbitrary column writes
const ALLOWED_UPDATE_FIELDS = new Set([
  'status',
  'payment_status',
  'assigned_technician_id',
  'scheduled_date',
  'scheduled_time_slot',
  'notes_admin',
  'notes_customer',
  'actual_start_at',
  'actual_end_at',
]);

export async function PATCH(request: NextRequest, { params }: Props) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return apiError('Unauthorized', 'UNAUTHORIZED', 401);

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (!profile || !['super_admin', 'admin', 'manager', 'operator'].includes(profile.role)) {
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
    const { data, error } = await admin
      .from('orders')
      .update(sanitized)
      .eq('id', id)
      .select()
      .single();

    if (error) return apiError(error.message, 'DB_ERROR', 500);
    return apiSuccess(data);
  } catch {
    return apiError('Internal server error', 'INTERNAL_ERROR', 500);
  }
}

export async function GET(request: NextRequest, { params }: Props) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return apiError('Unauthorized', 'UNAUTHORIZED', 401);

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (!profile || !['super_admin', 'admin', 'manager', 'operator'].includes(profile.role)) {
      return apiError('Forbidden', 'FORBIDDEN', 403);
    }

    const { id } = await params;
    const admin = createAdminClient();

    const { data, error } = await admin
      .from('orders')
      .select('*, services(name_en, service_code), profiles!orders_customer_id_fkey(full_name, phone, email), areas(name_en)')
      .eq('id', id)
      .single();

    if (error) return apiError(error.message, 'DB_ERROR', 500);
    return apiSuccess(data);
  } catch {
    return apiError('Internal server error', 'INTERNAL_ERROR', 500);
  }
}
