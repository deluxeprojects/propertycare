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
    const twoHoursAgo = new Date();
    twoHoursAgo.setHours(twoHoursAgo.getHours() - 2);

    const { data: completed } = await supabase
      .from('orders')
      .select('id, order_number, customer_id, profiles!orders_customer_id_fkey(full_name, phone)')
      .eq('status', 'completed')
      .is('rating', null)
      .lte('actual_end_at', twoHoursAgo.toISOString())
      .gte('actual_end_at', new Date(twoHoursAgo.getTime() - 60 * 60 * 1000).toISOString());

    let sent = 0;
    for (const order of completed ?? []) {
      const profile = order.profiles as unknown as { full_name: string; phone: string } | null;
      if (!profile?.phone) continue;

      const message = `Hi ${profile.full_name}, thank you for choosing us! We'd love to hear about your experience with order #${order.order_number}. Please take a moment to leave a review — your feedback helps us improve.`;
      const ok = await sendWhatsApp(profile.phone, message);
      if (ok) sent++;
      else console.error(`[ReviewRequest] Failed to send review request for order ${order.id}`);
    }

    return NextResponse.json({
      review_requests_due: completed?.length ?? 0,
      review_requests_sent: sent,
    });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
