import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('promotions')
    .update({ is_active: false })
    .lt('valid_until', new Date().toISOString())
    .eq('is_active', true)
    .select('id, code');

  return NextResponse.json({
    deactivated: data?.length ?? 0,
    codes: data?.map((p) => p.code) ?? [],
  });
}
