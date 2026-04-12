import { createClient } from '@/lib/supabase/server';

const ADMIN_ROLES = ['super_admin', 'admin', 'manager', 'operator'];

/**
 * Verify the current user is authenticated and has an admin role.
 * Throws if not authenticated or not an admin — use in server actions.
 */
export async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!profile || !ADMIN_ROLES.includes(profile.role)) {
    throw new Error('Forbidden: admin access required');
  }

  return { user, role: profile.role };
}
