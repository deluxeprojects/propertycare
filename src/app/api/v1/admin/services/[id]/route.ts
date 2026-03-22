import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { apiSuccess, apiError } from '@/lib/api/response';

interface Props { params: Promise<{ id: string }> }

export async function PATCH(request: NextRequest, { params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return apiError('Unauthorized', 'UNAUTHORIZED', 401);

  const body = await request.json();
  const admin = createAdminClient();
  const { data, error } = await admin.from('services').update(body).eq('id', id).select().single();
  if (error) return apiError(error.message, 'DB_ERROR', 500);
  return apiSuccess(data);
}
