import type { SupabaseClient } from '@supabase/supabase-js';

export async function autoAssignTechnician(
  supabase: SupabaseClient,
  params: {
    serviceCategoryId: string;
    areaId: string;
    scheduledDate: string;
    scheduledTimeSlot: string;
  }
) {
  // 1. Get all technicians with matching specialization
  const { data: technicians } = await supabase
    .from('technicians')
    .select('*, profiles(full_name)')
    .eq('is_available', true)
    .contains('specializations', [params.serviceCategoryId]);

  if (!technicians || technicians.length === 0) return [];

  // 2. Filter by area coverage
  const areaFiltered = technicians.filter(
    (t) => t.work_areas && (t.work_areas as string[]).includes(params.areaId)
  );

  // 3. Filter by schedule — not day off
  const { data: schedules } = await supabase
    .from('technician_schedules')
    .select('technician_id, is_day_off')
    .eq('date', params.scheduledDate)
    .eq('is_day_off', true);

  const dayOffIds = new Set((schedules ?? []).map((s) => s.technician_id));
  const available = areaFiltered.filter((t) => !dayOffIds.has(t.id));

  // 4. Check capacity — count today's orders
  const { data: todayOrders } = await supabase
    .from('orders')
    .select('assigned_technician_id')
    .eq('scheduled_date', params.scheduledDate)
    .not('status', 'in', '("cancelled","refunded")');

  const orderCounts = new Map<string, number>();
  for (const order of todayOrders ?? []) {
    if (order.assigned_technician_id) {
      orderCounts.set(
        order.assigned_technician_id,
        (orderCounts.get(order.assigned_technician_id) ?? 0) + 1
      );
    }
  }

  const withinCapacity = available.filter((t) => {
    const count = orderCounts.get(t.profile_id) ?? 0;
    return count < t.daily_capacity;
  });

  // 5. Sort by load balance → rating
  withinCapacity.sort((a, b) => {
    const aLoad = orderCounts.get(a.profile_id) ?? 0;
    const bLoad = orderCounts.get(b.profile_id) ?? 0;
    if (aLoad !== bLoad) return aLoad - bLoad;
    return (b.avg_rating ?? 0) - (a.avg_rating ?? 0);
  });

  // 6. Return top 3
  return withinCapacity.slice(0, 3);
}
