import { NextRequest } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { apiSuccess, apiError } from '@/lib/api/response';

interface Props { params: Promise<{ id: string }> }

export async function POST(request: NextRequest, { params }: Props) {
  const { id } = await params;
  const supabase = createAdminClient();

  const { data: order } = await supabase
    .from('orders')
    .select('*, services(name_en)')
    .eq('id', id)
    .single();

  if (!order) return apiError('Order not found', 'NOT_FOUND', 404);

  const lineItems = [
    { description: (order.services as any)?.name_en ?? 'Service', qty: 1, unit_price: order.base_amount_aed, total: order.base_amount_aed },
  ];
  if (order.addons_amount_aed > 0) {
    lineItems.push({ description: 'Add-ons', qty: 1, unit_price: order.addons_amount_aed, total: order.addons_amount_aed });
  }

  const { data: invoice, error } = await supabase.from('invoices').insert({
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
}
