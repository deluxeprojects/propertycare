'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { ProKeepLogo } from '@/components/shared/ProKeepLogo';

export default function StaffLoginPage() {
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

      // Verify the user has a technician or admin role
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();

      if (profileError || !profile) {
        setError('Could not verify staff access. Please contact support.');
        setLoading(false);
        return;
      }

      if (profile.role === 'customer') {
        setError('Access denied. This login is for staff accounts only.');
        await supabase.auth.signOut();
        setLoading(false);
        return;
      }

      // Success -- redirect to staff dashboard
      window.location.href = '/staff';
    } catch {
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mb-2 flex justify-center">
            <ProKeepLogo size="md" />
          </div>
          <h1 className="text-sm font-medium text-muted-foreground">Staff Portal</h1>
          <p className="text-sm text-muted-foreground">Sign in to view your tasks</p>
        </div>
        <form onSubmit={handleLogin} className="rounded-xl border border-border bg-card p-6">
          <div className="space-y-4">
            {error && (
              <div className="rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}
            <div>
              <label htmlFor="staff-email" className="mb-1.5 block text-sm font-medium text-foreground">Email</label>
              <input
                id="staff-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tech@prokeep.ae"
                required
                autoComplete="email"
                className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
            <div>
              <label htmlFor="staff-password" className="mb-1.5 block text-sm font-medium text-foreground">Password</label>
              <input
                id="staff-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-accent py-2.5 text-sm font-semibold text-accent-foreground hover:bg-accent/90 disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
