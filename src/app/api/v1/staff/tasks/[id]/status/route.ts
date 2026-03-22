import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { apiSuccess, apiError } from '@/lib/api/response';

interface Props {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: NextRequest, { params }: Props) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return apiError('Unauthorized', 'UNAUTHORIZED', 401);

    const { status } = await request.json();
    const validStatuses = ['in_transit', 'in_progress', 'completed'];
    if (!validStatuses.includes(status)) {
      return apiError('Invalid status', 'VALIDATION_ERROR', 400);
    }

    const updates: Record<string, unknown> = { status };
    if (status === 'in_progress') updates.actual_start_at = new Date().toISOString();
    if (status === 'completed') updates.actual_end_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('orders')
      .update(updates)
      .eq('id', id)
      .eq('assigned_technician_id', user.id)
      .select()
      .single();

    if (error) return apiError(error.message, 'DB_ERROR', 500);
    return apiSuccess(data);
  } catch {
    return apiError('Internal server error', 'INTERNAL_ERROR', 500);
  }
}
