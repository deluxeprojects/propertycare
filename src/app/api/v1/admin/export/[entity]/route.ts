import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

interface Props {
  params: Promise<{ entity: string }>;
}

export async function GET(request: NextRequest, { params }: Props) {
  try {
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
      case 'payroll': {
        const url = new URL(request.url);
        const period = url.searchParams.get('period') ?? new Date().toISOString().slice(0, 7); // YYYY-MM
        const startDate = `${period}-01`;
        const endOfMonth = new Date(parseInt(period.split('-')[0]!), parseInt(period.split('-')[1]!), 0);
        const endDate = endOfMonth.toISOString().split('T')[0];

        const { data: techs } = await supabase
          .from('technicians')
          .select('employee_code, hourly_rate_aed, commission_pct, profiles!technicians_profile_id_fkey(full_name)');

        const { data: orders } = await supabase
          .from('orders')
          .select('assigned_technician_id, total_amount_aed, actual_start_at, actual_end_at')
          .eq('status', 'completed')
          .gte('scheduled_date', startDate)
          .lte('scheduled_date', endDate!);

        data = (techs ?? []).map((t) => {
          const techOrders = (orders ?? []).filter(o => o.assigned_technician_id === (t as unknown as { profile_id: string }).profile_id);
          const jobs = techOrders.length;
          const revenue = techOrders.reduce((sum, o) => sum + (o.total_amount_aed ?? 0), 0);
          const commission = revenue * ((t.commission_pct ?? 0) / 100);
          const profileName = (t.profiles as unknown as { full_name: string } | null)?.full_name ?? '';
          return {
            employee_code: t.employee_code,
            name: profileName,
            jobs_completed: jobs,
            revenue_generated: revenue,
            hourly_rate: t.hourly_rate_aed ?? 0,
            commission_pct: t.commission_pct ?? 0,
            commission_earned: commission,
            period,
          };
        });
        filename = `payroll-${period}.csv`;
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
  } catch {
    return NextResponse.json({ error: 'Export failed' }, { status: 500 });
  }
}
