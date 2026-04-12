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
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    const { data: expiring } = await supabase
      .from('amc_subscriptions')
      .select('id, customer_id, plan_id, end_date, profiles!amc_subscriptions_customer_id_fkey(full_name, phone, email)')
      .eq('status', 'active')
      .lte('end_date', thirtyDaysFromNow.toISOString().split('T')[0])
      .gte('end_date', new Date().toISOString().split('T')[0]);

    let sent = 0;
    for (const sub of expiring ?? []) {
      const profile = sub.profiles as unknown as { full_name: string; phone: string; email: string } | null;
      if (!profile?.phone) continue;

      const message = `Hi ${profile.full_name}, your AMC plan is expiring on ${sub.end_date}. Renew now to continue enjoying uninterrupted maintenance coverage. Contact us to renew today!`;
      const ok = await sendWhatsApp(profile.phone, message);
      if (ok) sent++;
      else console.error(`[AMCReminder] Failed to send renewal reminder for subscription ${sub.id}`);
    }

    return NextResponse.json({
      expiring_subscriptions: expiring?.length ?? 0,
      reminders_sent: sent,
    });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
