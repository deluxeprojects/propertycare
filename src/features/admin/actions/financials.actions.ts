'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';

export async function generateInvoice(orderId: string) {
  const supabase = createAdminClient();

  const { data: order } = await supabase
    .from('orders')
    .select('*, services(name_en), profiles!orders_customer_id_fkey(full_name)')
    .eq('id', orderId)
    .single();

  if (!order) throw new Error('Order not found');

  const lineItems = [
    { description: (order.services as unknown as { name_en: string })?.name_en ?? 'Service', qty: 1, unit_price: order.base_amount_aed, total: order.base_amount_aed },
  ];

  if (order.addons_amount_aed > 0) {
    lineItems.push({ description: 'Add-ons', qty: 1, unit_price: order.addons_amount_aed, total: order.addons_amount_aed });
  }

  const { error } = await supabase.from('invoices').insert({
    order_id: orderId,
    customer_id: order.customer_id,
    subtotal_aed: order.total_amount_aed - order.vat_amount_aed,
    vat_aed: order.vat_amount_aed,
    total_aed: order.total_amount_aed,
    status: 'draft',
    line_items: lineItems,
  });

  if (error) throw new Error(error.message);
  revalidatePath('/admin/financials');
}

export async function markInvoicePaid(invoiceId: string) {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from('invoices')
    .update({ status: 'paid', paid_at: new Date().toISOString() })
    .eq('id', invoiceId);

  if (error) throw new Error(error.message);
  revalidatePath('/admin/financials');
}

export async function voidInvoice(invoiceId: string) {
  const supabase = createAdminClient();
  const { error } = await supabase.from('invoices').update({ status: 'void' }).eq('id', invoiceId);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/financials');
}
