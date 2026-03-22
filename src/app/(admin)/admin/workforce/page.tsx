import Link from 'next/link';
import { Plus, Pencil } from 'lucide-react';
import { createAdminClient } from '@/lib/supabase/admin';

export default async function WorkforcePage() {
  const supabase = createAdminClient();

  const { data: technicians } = await supabase
    .from('technicians')
    .select(`
      id,
      employee_code,
      specializations,
      work_areas,
      avg_rating,
      total_jobs,
      daily_capacity,
      is_available,
      profiles!technicians_profile_id_fkey(full_name)
    `)
    .order('employee_code', { ascending: true });

  // Resolve specialization UUIDs to category names
  const allSpecIds = new Set<string>();
  for (const t of technicians ?? []) {
    for (const sid of t.specializations ?? []) {
      allSpecIds.add(sid);
    }
  }
  let specMap: Record<string, string> = {};
  if (allSpecIds.size > 0) {
    const { data: cats } = await supabase
      .from('service_categories')
      .select('id, name_en')
      .in('id', Array.from(allSpecIds));
    for (const c of cats ?? []) {
      specMap[c.id] = c.name_en;
    }
  }

  // Resolve work_area UUIDs to area names
  const allAreaIds = new Set<string>();
  for (const t of technicians ?? []) {
    for (const aid of t.work_areas ?? []) {
      allAreaIds.add(aid);
    }
  }
  let areaMap: Record<string, string> = {};
  if (allAreaIds.size > 0) {
    const { data: areas } = await supabase
      .from('areas')
      .select('id, name_en')
      .in('id', Array.from(allAreaIds));
    for (const a of areas ?? []) {
      areaMap[a.id] = a.name_en;
    }
  }

  // Count today's orders per technician (by assigned_technician_id which references profiles)
  const today = new Date().toISOString().slice(0, 10);
  const techProfileIds = (technicians ?? []).map((t: any) => t.profiles?.id).filter(Boolean);
  // We need to map technician profile_id. The orders table references profiles via assigned_technician_id.
  // We need to get profile_ids from the technicians join.
  // Actually, let's re-fetch technician profile_ids.
  const { data: techWithProfiles } = await supabase
    .from('technicians')
    .select('id, profile_id');

  const techIdToProfileId: Record<string, string> = {};
  const profileIdToTechId: Record<string, string> = {};
  for (const t of techWithProfiles ?? []) {
    techIdToProfileId[t.id] = t.profile_id;
    profileIdToTechId[t.profile_id] = t.id;
  }

  let todayOrderCounts: Record<string, number> = {};
  const profileIds = Object.values(techIdToProfileId);
  if (profileIds.length > 0) {
    const { data: todayOrders } = await supabase
      .from('orders')
      .select('assigned_technician_id')
      .eq('scheduled_date', today)
      .in('assigned_technician_id', profileIds)
      .is('deleted_at', null);

    for (const o of todayOrders ?? []) {
      const techId = profileIdToTechId[o.assigned_technician_id];
      if (techId) {
        todayOrderCounts[techId] = (todayOrderCounts[techId] ?? 0) + 1;
      }
    }
  }

  // Check day off status from technician_schedules
  let dayOffSet = new Set<string>();
  {
    const techIds = (technicians ?? []).map((t: any) => t.id);
    if (techIds.length > 0) {
      const { data: schedules } = await supabase
        .from('technician_schedules')
        .select('technician_id, is_day_off')
        .eq('date', today)
        .eq('is_day_off', true)
        .in('technician_id', techIds);
      for (const s of schedules ?? []) {
        dayOffSet.add(s.technician_id);
      }
    }
  }

  const techList = technicians ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Workforce</h1>
          <p className="text-sm text-muted-foreground">{techList.length} technicians</p>
        </div>
        <Link href="/admin/workforce/new" className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-accent/90">
          <Plus className="h-4 w-4" /> Add Technician
        </Link>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Code</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Name</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Specializations</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Areas</th>
              <th className="px-4 py-3 text-center font-medium text-muted-foreground">Rating</th>
              <th className="px-4 py-3 text-center font-medium text-muted-foreground">Today</th>
              <th className="px-4 py-3 text-center font-medium text-muted-foreground">Status</th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {techList.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                  No technicians found
                </td>
              </tr>
            )}
            {techList.map((t: any) => {
              const specs = (t.specializations ?? []).map((sid: string) => specMap[sid] ?? sid).filter(Boolean);
              const areas = (t.work_areas ?? []).map((aid: string) => areaMap[aid] ?? aid).filter(Boolean);
              const todayJobs = todayOrderCounts[t.id] ?? 0;
              const capacity = t.daily_capacity ?? 6;
              const isDayOff = dayOffSet.has(t.id);
              const status = isDayOff ? 'day_off' : (t.is_available ? 'active' : 'day_off');

              return (
                <tr key={t.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{t.employee_code}</td>
                  <td className="px-4 py-3 font-medium text-foreground"><Link href={`/admin/workforce/${t.id}`} className="text-accent hover:underline">{t.profiles?.full_name ?? '—'}</Link></td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {specs.length > 0 ? specs.map((s: string) => (
                        <span key={s} className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">{s}</span>
                      )) : <span className="text-muted-foreground">—</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{areas.length > 0 ? areas.join(', ') : '—'}</td>
                  <td className="px-4 py-3 text-center font-medium text-foreground">{Number(t.avg_rating).toFixed(1)}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={todayJobs >= capacity ? 'text-red-600 font-medium' : 'text-foreground'}>
                      {todayJobs}/{capacity}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                      status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {status === 'active' ? 'Active' : 'Day Off'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/admin/workforce/${t.id}`} className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-accent hover:bg-muted">
                      <Pencil className="h-3 w-3" /> Edit
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
