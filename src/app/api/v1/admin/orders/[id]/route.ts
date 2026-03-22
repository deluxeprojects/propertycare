import { NextRequest } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { apiSuccess, apiError } from '@/lib/api/response';

interface Props { params: Promise<{ id: string }> }

export async function PATCH(request: NextRequest, { params }: Props) {
  const { id } = await params;
  const body = await request.json();
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('orders')
    .update(body)
    .eq('id', id)
    .select()
    .single();

  if (error) return apiError(error.message, 'DB_ERROR', 500);
  return apiSuccess(data);
}

export async function GET(request: NextRequest, { params }: Props) {
  const { id } = await params;
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('orders')
    .select('*, services(name_en, service_code), profiles!orders_customer_id_fkey(full_name, phone, email), areas(name_en)')
    .eq('id', id)
    .single();

  if (error) return apiError(error.message, 'DB_ERROR', 500);
  return apiSuccess(data);
}
