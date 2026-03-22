'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { ProKeepLogo } from '@/components/shared/ProKeepLogo';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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
        setError('Login failed');
        setLoading(false);
        return;
      }

      // Check role
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();

      if (!profile || profile.role === 'customer' || profile.role === 'technician') {
        setError('Access denied. Admin accounts only.');
        await supabase.auth.signOut();
        setLoading(false);
        return;
      }

      router.push('/admin');
      router.refresh();
    } catch {
      setError('Something went wrong');
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-primary px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center text-primary-foreground">
          <div className="mb-2">
            <ProKeepLogo size="md" dark />
          </div>
          <h1 className="text-lg font-medium text-primary-foreground/60">Admin Panel</h1>
        </div>

        <form onSubmit={handleLogin} className="rounded-xl border border-primary-foreground/10 bg-primary-foreground/5 p-6 backdrop-blur">
          <div className="space-y-4">
            {error && (
              <div className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300">
                {error}
              </div>
            )}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-primary-foreground">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@prokeep.ae"
                required
                className="w-full rounded-lg border border-primary-foreground/20 bg-primary-foreground/10 px-3 py-2 text-sm text-primary-foreground placeholder:text-primary-foreground/40 focus:border-accent focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-primary-foreground">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full rounded-lg border border-primary-foreground/20 bg-primary-foreground/10 px-3 py-2 text-sm text-primary-foreground placeholder:text-primary-foreground/40 focus:border-accent focus:outline-none"
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
