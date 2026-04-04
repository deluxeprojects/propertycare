'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { ProKeepLogo } from '@/components/shared/ProKeepLogo';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const supabase = createClient();

      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }

      if (!data.user) {
        setError('Login failed. Please try again.');
        setLoading(false);
        return;
      }

      // Check role — use the session that was just created
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();

      if (profileError || !profile) {
        // Profile might not exist yet or RLS blocking — check via user metadata
        setError('Could not verify admin access. Please contact support.');
        setLoading(false);
        return;
      }

      if (profile.role === 'customer' || profile.role === 'technician') {
        setError('Access denied. This login is for admin accounts only.');
        await supabase.auth.signOut();
        setLoading(false);
        return;
      }

      // Success — redirect to admin dashboard
      window.location.href = '/admin';
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#1A1A1A] px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mb-2 flex justify-center">
            <ProKeepLogo size="md" dark />
          </div>
          <h1 className="text-lg font-medium text-white/60">Admin Panel</h1>
        </div>

        <form onSubmit={handleLogin} className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur">
          <div className="space-y-4">
            {error && (
              <div className="rounded-lg bg-red-500/20 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-white">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@prokeep.ae"
                required
                autoComplete="email"
                className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2.5 text-sm text-white placeholder:text-white/40 focus:border-[#4ECDC4] focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-white">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2.5 text-sm text-white placeholder:text-white/40 focus:border-[#4ECDC4] focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-[#4ECDC4] py-2.5 text-sm font-semibold text-[#1A1A1A] hover:bg-[#3BA99E] disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
