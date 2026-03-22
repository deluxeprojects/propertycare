'use client';

import { useEffect, useState } from 'react';

interface ProfileData {
  full_name: string;
  email: string;
  phone: string;
  preferred_language: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData>({
    full_name: '',
    email: '',
    phone: '',
    preferred_language: 'en',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetch('/api/v1/customer/profile')
      .then(async (res) => {
        if (!res.ok) throw new Error('Failed to load profile');
        const data = await res.json();
        setProfile({
          full_name: data.full_name ?? '',
          email: data.email ?? '',
          phone: data.phone ?? '',
          preferred_language: data.preferred_language ?? 'en',
        });
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch('/api/v1/customer/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to save profile');
      }
      setSuccess('Profile saved successfully.');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save profile');
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="px-4 py-12 md:py-16">
        <div className="container mx-auto max-w-2xl">
          <h1 className="mb-6 text-2xl font-bold text-foreground">My Profile</h1>
          <div className="h-64 animate-pulse rounded-xl bg-muted" />
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-12 md:py-16">
      <div className="container mx-auto max-w-2xl">
        <h1 className="mb-6 text-2xl font-bold text-foreground">My Profile</h1>
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Full Name</label>
              <input
                type="text"
                value={profile.full_name}
                onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                placeholder="Your name"
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-accent focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Email</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                placeholder="your@email.com"
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-accent focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Phone</label>
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                placeholder="+971 50 XXX XXXX"
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-accent focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Preferred Language</label>
              <select
                value={profile.preferred_language}
                onChange={(e) => setProfile({ ...profile, preferred_language: e.target.value })}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-accent focus:outline-none"
              >
                <option value="en">English</option>
                <option value="ar">العربية</option>
                <option value="ru">Русский</option>
                <option value="zh">中文</option>
                <option value="de">Deutsch</option>
              </select>
            </div>

            {error && (
              <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">{error}</p>
            )}
            {success && (
              <p className="rounded-lg bg-green-50 px-4 py-2 text-sm text-green-700">{success}</p>
            )}

            <button
              onClick={handleSave}
              disabled={saving}
              className="rounded-lg bg-accent px-6 py-2 text-sm font-semibold text-accent-foreground hover:bg-accent/90 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
