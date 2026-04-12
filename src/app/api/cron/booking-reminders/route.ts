import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { sendWhatsApp } from '@/lib/twilio/whatsapp';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabase = createAdminClient();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    const { data: orders } = await supabase
      .from('orders')
      .select('id, order_number, customer_id, scheduled_time_slot, profiles!orders_customer_id_fkey(full_name, phone)')
      .eq('scheduled_date', tomorrowStr)
      .in('status', ['confirmed', 'assigned']);

    let sent = 0;
    for (const order of orders ?? []) {
      const profile = order.profiles as unknown as { full_name: string; phone: string } | null;
      if (!profile?.phone) continue;

      const message = `Hi ${profile.full_name}, this is a reminder that your booking #${order.order_number} is scheduled for tomorrow (${tomorrowStr}) at ${order.scheduled_time_slot}. We look forward to serving you!`;
      const ok = await sendWhatsApp(profile.phone, message);
      if (ok) sent++;
      else console.error(`[BookingReminder] Failed to send reminder for order ${order.id}`);
    }

    return NextResponse.json({
      reminders_due: orders?.length ?? 0,
      reminders_sent: sent,
      date: tomorrowStr,
    });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
