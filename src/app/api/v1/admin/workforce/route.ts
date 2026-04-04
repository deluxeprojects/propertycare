import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { apiSuccess, apiError } from '@/lib/api/response';

export async function GET(_request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return apiError('Unauthorized', 'UNAUTHORIZED', 401);

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (!profile || !['super_admin', 'admin', 'manager'].includes(profile.role)) {
      return apiError('Forbidden', 'FORBIDDEN', 403);
    }

    const { data, error } = await supabase
      .from('technicians')
      .select('*, profiles!technicians_profile_id_fkey(full_name, email, phone)')
      .order('employee_code');

    if (error) return apiError(error.message, 'DB_ERROR', 500);
    return apiSuccess(data);
  } catch {
    return apiError('Internal server error', 'INTERNAL_ERROR', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return apiError('Unauthorized', 'UNAUTHORIZED', 401);

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (!profile || !['super_admin', 'admin', 'manager'].includes(profile.role)) {
      return apiError('Forbidden', 'FORBIDDEN', 403);
    }

    const body = await request.json();
    const { employeeCode, profileEmail, specializations, workAreas, employmentType, hourlyRate, dailyCapacity, vehicleType } = body;

    if (!employeeCode || !profileEmail) {
      return apiError('Missing required fields', 'VALIDATION_ERROR', 400);
    }

    // Find the profile by email
    const admin = createAdminClient();
    const { data: techProfile } = await admin
      .from('profiles')
      .select('id')
      .eq('email', profileEmail)
      .single();

    if (!techProfile) {
      return apiError('No user found with that email', 'NOT_FOUND', 404);
    }

    const { data, error } = await admin
      .from('technicians')
      .insert({
        profile_id: techProfile.id,
        employee_code: employeeCode,
        specializations: specializations || [],
        work_areas: workAreas || [],
        employment_type: employmentType || 'full_time',
        hourly_rate: hourlyRate ? parseFloat(hourlyRate) : null,
        daily_capacity_hours: dailyCapacity ? parseInt(dailyCapacity) : null,
        vehicle_type: vehicleType || null,
        is_active: true,
        is_available: true,
      })
      .select()
      .single();

    if (error) return apiError(error.message, 'DB_ERROR', 500);
    return apiSuccess(data, 201);
  } catch {
    return apiError('Internal server error', 'INTERNAL_ERROR', 500);
  }
}
