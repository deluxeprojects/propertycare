import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

interface Props {
  params: Promise<{ entity: string }>;
}

export async function GET(request: NextRequest, { params }: Props) {
  const { entity } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (!profile || !['super_admin', 'admin', 'manager'].includes(profile.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  let data: Record<string, unknown>[] = [];
  let filename = `${entity}-export.csv`;

  switch (entity) {
    case 'orders': {
      const { data: orders } = await supabase
        .from('orders')
        .select('order_number, status, scheduled_date, scheduled_time_slot, total_amount_aed, payment_status, created_at')
        .order('created_at', { ascending: false })
        .limit(10000);
      data = orders ?? [];
      filename = `orders-${new Date().toISOString().split('T')[0]}.csv`;
      break;
    }
    case 'customers': {
      const { data: customers } = await supabase
        .from('profiles')
        .select('email, full_name, phone, preferred_language, created_at')
        .eq('role', 'customer')
        .order('created_at', { ascending: false })
        .limit(10000);
      data = customers ?? [];
      filename = `customers-${new Date().toISOString().split('T')[0]}.csv`;
      break;
    }
    default:
      return NextResponse.json({ error: 'Unknown entity' }, { status: 400 });
  }

  if (data.length === 0) {
    return NextResponse.json({ error: 'No data' }, { status: 404 });
  }

  const headers = Object.keys(data[0] ?? {});
  const csv = [
    headers.join(','),
    ...data.map((row) => headers.map((h) => `"${String(row[h] ?? '').replace(/"/g, '""')}"`).join(',')),
  ].join('\n');

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
}
