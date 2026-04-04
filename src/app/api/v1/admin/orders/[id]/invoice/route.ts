import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { apiSuccess, apiError } from '@/lib/api/response';

interface Props { params: Promise<{ id: string }> }

export async function POST(request: NextRequest, { params }: Props) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return apiError('Unauthorized', 'UNAUTHORIZED', 401);

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (!profile || !['super_admin', 'admin', 'manager'].includes(profile.role)) {
      return apiError('Forbidden', 'FORBIDDEN', 403);
    }

    const { id } = await params;
    const admin = createAdminClient();

    const { data: order } = await admin
      .from('orders')
      .select('*, services(name_en)')
      .eq('id', id)
      .single();

    if (!order) return apiError('Order not found', 'NOT_FOUND', 404);

    const lineItems = [
      { description: (order.services as { name_en: string }[] | null)?.[0]?.name_en ?? 'Service', qty: 1, unit_price: order.base_amount_aed, total: order.base_amount_aed },
    ];
    if (order.addons_amount_aed > 0) {
      lineItems.push({ description: 'Add-ons', qty: 1, unit_price: order.addons_amount_aed, total: order.addons_amount_aed });
    }

    const { data: invoice, error } = await admin.from('invoices').insert({
      order_id: id,
      customer_id: order.customer_id,
      subtotal_aed: order.total_amount_aed - order.vat_amount_aed,
      vat_aed: order.vat_amount_aed,
      total_aed: order.total_amount_aed,
      status: 'draft',
      line_items: lineItems,
    }).select().single();

    if (error) return apiError(error.message, 'DB_ERROR', 500);
    return apiSuccess(invoice, 201);
  } catch {
    return apiError('Internal server error', 'INTERNAL_ERROR', 500);
  }
}
