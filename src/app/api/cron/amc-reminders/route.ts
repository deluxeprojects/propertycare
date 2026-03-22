import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createAdminClient();
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

  const { data: expiring } = await supabase
    .from('amc_subscriptions')
    .select('id, customer_id, plan_id, end_date, profiles!amc_subscriptions_customer_id_fkey(full_name, phone, email)')
    .eq('status', 'active')
    .lte('end_date', thirtyDaysFromNow.toISOString().split('T')[0])
    .gte('end_date', new Date().toISOString().split('T')[0]);

  // TODO: Send renewal reminders
  return NextResponse.json({
    expiring_subscriptions: expiring?.length ?? 0,
  });
}
