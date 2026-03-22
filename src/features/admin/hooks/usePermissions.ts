'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

interface UserProfile {
  id: string;
  role: string;
  permissions: Record<string, Record<string, boolean>>;
}

export function usePermissions() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }
      setUser(user);

      const { data: profile } = await supabase
        .from('profiles')
        .select('id, role, permissions')
        .eq('id', user.id)
        .single();

      setProfile(profile);
      setLoading(false);
    }

    loadProfile();
  }, []);

  const hasRole = (minRole: string): boolean => {
    if (!profile) return false;
    const hierarchy = ['super_admin', 'admin', 'manager', 'operator', 'technician', 'customer'];
    const userIndex = hierarchy.indexOf(profile.role);
    const requiredIndex = hierarchy.indexOf(minRole);
    return userIndex >= 0 && userIndex <= requiredIndex;
  };

  const can = (entity: string, action: string): boolean => {
    if (!profile) return false;
    if (profile.role === 'super_admin') return true;

    // Check granular permissions override
    const entityPerms = profile.permissions?.[entity];
    if (entityPerms && typeof entityPerms[action] === 'boolean') {
      return entityPerms[action];
    }

    // Default role-based permissions
    const roleDefaults: Record<string, string[]> = {
      admin: ['read', 'write', 'create', 'delete'],
      manager: ['read', 'write', 'create'],
      operator: ['read', 'write'],
      technician: ['read'],
      customer: [],
    };

    return (roleDefaults[profile.role] ?? []).includes(action);
  };

  return { user, profile, loading, hasRole, can };
}
