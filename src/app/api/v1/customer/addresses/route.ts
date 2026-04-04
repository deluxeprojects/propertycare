import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { apiSuccess, apiError } from '@/lib/api/response';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return apiError('Unauthorized', 'UNAUTHORIZED', 401);

    const { data, error } = await supabase
      .from('customer_addresses')
      .select('*, areas(name_en), buildings(name_en)')
      .eq('customer_id', user.id)
      .order('is_default', { ascending: false });

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
    // Whitelist allowed address fields to prevent mass-assignment
    const allowedFields = [
      'label', 'area_id', 'building_id', 'building_name', 'unit_number',
      'floor', 'street_address', 'lat', 'lng', 'google_place_id',
      'special_instructions', 'is_default',
    ];
    const sanitized: Record<string, unknown> = { customer_id: user.id };
    for (const key of allowedFields) {
      if (key in body) sanitized[key] = body[key];
    }

    const { data, error } = await supabase
      .from('customer_addresses')
      .insert(sanitized)
      .select()
      .single();

    if (error) return apiError(error.message, 'DB_ERROR', 500);
    return apiSuccess(data, 201);
  } catch {
    return apiError('Internal server error', 'INTERNAL_ERROR', 500);
  }
}
