import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createAdminClient();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  const { data: orders } = await supabase
    .from('orders')
    .select('id, order_number, customer_id, scheduled_time_slot, profiles!orders_customer_id_fkey(full_name, phone)')
    .eq('scheduled_date', tomorrowStr)
    .in('status', ['confirmed', 'assigned']);

  // TODO: Send WhatsApp reminders via WhatsApp Business API
  // For now, just return the count
  return NextResponse.json({
    reminders_due: orders?.length ?? 0,
    date: tomorrowStr,
  });
}
