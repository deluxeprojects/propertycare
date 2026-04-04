import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('promotions')
      .update({ is_active: false })
      .lt('valid_until', new Date().toISOString())
      .eq('is_active', true)
      .select('id, code');

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({
      deactivated: data?.length ?? 0,
      codes: data?.map((p) => p.code) ?? [],
    });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
