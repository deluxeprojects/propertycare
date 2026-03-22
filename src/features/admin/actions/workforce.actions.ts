'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';

export async function createTechnician(data: {
  profileId: string;
  employeeCode: string;
  specializations: string[];
  workAreas: string[];
  employmentType: string;
  hourlyRateAed?: number;
  dailyCapacity?: number;
}) {
  const supabase = createAdminClient();

  // Update profile role
  await supabase.from('profiles').update({ role: 'technician' }).eq('id', data.profileId);

  const { error } = await supabase.from('technicians').insert({
    profile_id: data.profileId,
    employee_code: data.employeeCode,
    specializations: data.specializations,
    work_areas: data.workAreas,
    employment_type: data.employmentType,
    hourly_rate_aed: data.hourlyRateAed,
    daily_capacity: data.dailyCapacity ?? 6,
  });

  if (error) throw new Error(error.message);
  revalidatePath('/admin/workforce');
}

export async function updateTechnicianAvailability(technicianId: string, isAvailable: boolean) {
  const supabase = createAdminClient();
  const { error } = await supabase.from('technicians').update({ is_available: isAvailable }).eq('id', technicianId);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/workforce');
}

export async function createDayOff(technicianId: string, date: string, reason: string) {
  const supabase = createAdminClient();
  const { error } = await supabase.from('technician_schedules').upsert({
    technician_id: technicianId,
    date,
    available_from: '08:00',
    available_until: '22:00',
    is_day_off: true,
    day_off_reason: reason,
  }, { onConflict: 'technician_id,date' });

  if (error) throw new Error(error.message);
  revalidatePath('/admin/workforce');
}
