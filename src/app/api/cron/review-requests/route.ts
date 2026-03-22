import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

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

  // TODO: Send review request via WhatsApp
  return NextResponse.json({
    review_requests_due: completed?.length ?? 0,
  });
}
