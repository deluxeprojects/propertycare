import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { apiSuccess, apiError, apiPaginated } from '@/lib/api/response';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return apiError('Unauthorized', 'UNAUTHORIZED', 401);

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (!profile || !['super_admin', 'admin', 'manager', 'operator'].includes(profile.role)) {
      return apiError('Forbidden', 'FORBIDDEN', 403);
    }

    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') ?? '1');
    const perPage = parseInt(url.searchParams.get('per_page') ?? '25');
    const search = url.searchParams.get('q');
    const from = (page - 1) * perPage;
    const to = from + perPage - 1;

    let query = supabase
      .from('profiles')
      .select('id, email, full_name, phone, preferred_language, stripe_customer_id, created_at, last_login_at', { count: 'exact' })
      .eq('role', 'customer')
      .eq('is_active', true);

    if (search) {
      query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`);
    }

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) return apiError(error.message, 'DB_ERROR', 500);
    return apiPaginated(data ?? [], count ?? 0, page, perPage);
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
    const { email, password, fullName, phone, language } = body;

    if (!email || !password || !fullName) {
      return apiError('Missing required fields', 'VALIDATION_ERROR', 400);
    }

    // Create auth user via admin API
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    const authRes = await fetch(`${supabaseUrl}/auth/v1/admin/users`, {
      method: 'POST',
      headers: {
        'apikey': serviceKey,
        'Authorization': `Bearer ${serviceKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        email_confirm: true,
        user_metadata: { full_name: fullName },
      }),
    });

    const authData = await authRes.json();
    if (!authRes.ok) {
      return apiError(authData.msg || 'Failed to create user', 'AUTH_ERROR', 400);
    }

    // Insert profile (trigger may have created it, upsert to be safe)
    const adminClient = createAdminClient();
    await adminClient.from('profiles').upsert({
      id: authData.id,
      email,
      full_name: fullName,
      phone: phone || null,
      preferred_language: language || 'en',
      role: 'customer',
    }, { onConflict: 'id' });

    return apiSuccess({ id: authData.id, email }, 201);
  } catch (e) {
    return apiError('Failed to create customer', 'INTERNAL_ERROR', 500);
  }
}
