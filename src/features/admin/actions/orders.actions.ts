'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';

export async function updateOrderStatus(orderId: string, status: string, _notes?: string) {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId);

  if (error) throw new Error(error.message);
  revalidatePath('/admin/orders');
}

export async function assignTechnician(orderId: string, technicianProfileId: string) {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from('orders')
    .update({ assigned_technician_id: technicianProfileId, status: 'assigned' })
    .eq('id', orderId);

  if (error) throw new Error(error.message);
  revalidatePath('/admin/orders');
}

export async function cancelOrder(orderId: string, reason: string) {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from('orders')
    .update({ status: 'cancelled', cancellation_reason: reason, cancelled_by: 'admin' })
    .eq('id', orderId);

  if (error) throw new Error(error.message);
  revalidatePath('/admin/orders');
}

export async function rescheduleOrder(orderId: string, date: string, timeSlot: string) {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from('orders')
    .update({ scheduled_date: date, scheduled_time_slot: timeSlot })
    .eq('id', orderId);

  if (error) throw new Error(error.message);
  revalidatePath('/admin/orders');
}

export async function addInternalNote(orderId: string, note: string) {
  const supabase = createAdminClient();
  const { data: order } = await supabase
    .from('orders')
    .select('notes_internal')
    .eq('id', orderId)
    .single();

  const existingNotes = order?.notes_internal ?? '';
  const timestamp = new Date().toISOString();
  const updatedNotes = existingNotes
    ? `${existingNotes}\n\n[${timestamp}] ${note}`
    : `[${timestamp}] ${note}`;

  const { error } = await supabase
    .from('orders')
    .update({ notes_internal: updatedNotes })
    .eq('id', orderId);

  if (error) throw new Error(error.message);
  revalidatePath(`/admin/orders/${orderId}`);
}
