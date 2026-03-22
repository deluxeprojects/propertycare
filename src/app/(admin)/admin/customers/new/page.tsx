'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Check } from 'lucide-react';

export default function NewCustomerPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [language, setLanguage] = useState('en');
  const [area, setArea] = useState('');
  const [building, setBuilding] = useState('');
  const [unit, setUnit] = useState('');
  const [floor, setFloor] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [apiError, setApiError] = useState('');

  const validate = () => {
    const e: Record<string, string> = {};
    if (!fullName.trim()) e.fullName = 'Full name is required';
    if (!email.trim()) {
      e.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      e.email = 'Enter a valid email address';
    }
    if (!password) {
      e.password = 'Password is required';
    } else if (password.length < 6) {
      e.password = 'Password must be at least 6 characters';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) return;
    setSaving(true);
    setApiError('');
    try {
      const res = await fetch('/api/v1/admin/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, fullName, phone, language }),
      });
      const data = await res.json();
      if (!res.ok) {
        setApiError(data.error || 'Failed to create customer');
        setSaving(false);
        return;
      }
      setSaved(true);
      setSaving(false);
      setTimeout(() => { window.location.href = '/admin/customers'; }, 1000);
    } catch {
      setApiError('Network error. Please try again.');
      setSaving(false);
    }
  };

  const clearError = (field: string) => {
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const fieldClass = (field: string) =>
    `w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none ${errors[field] ? 'border-destructive focus:border-destructive' : 'border-input focus:border-accent'}`;

  if (saved) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/customers" className="rounded-lg p-2 text-muted-foreground hover:bg-muted"><ArrowLeft className="h-5 w-5" /></Link>
          <h1 className="text-2xl font-bold text-foreground">Add Customer</h1>
        </div>
        <div className="rounded-xl border border-green-300 bg-green-50 p-6 dark:border-green-800 dark:bg-green-950">
          <div className="flex items-center gap-3">
            <Check className="h-5 w-5 text-green-600" />
            <p className="font-medium text-green-800 dark:text-green-200">Customer created successfully</p>
          </div>
          <Link href="/admin/customers" className="mt-4 inline-block text-sm font-medium text-accent hover:underline">
            Back to customers
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/customers" className="rounded-lg p-2 text-muted-foreground hover:bg-muted"><ArrowLeft className="h-5 w-5" /></Link>
        <h1 className="text-2xl font-bold text-foreground">Add Customer</h1>
      </div>
      {apiError && (
        <div className="rounded-xl border border-red-300 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950">
          <p className="text-sm font-medium text-red-800 dark:text-red-200">{apiError}</p>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="mb-4 font-semibold text-foreground">Customer Details</h3>
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Full Name *</label>
                <input
                  type="text"
                  placeholder="Customer name"
                  value={fullName}
                  onChange={(e) => { setFullName(e.target.value); clearError('fullName'); }}
                  className={fieldClass('fullName')}
                />
                {errors.fullName && <p className="mt-1 text-xs text-destructive">{errors.fullName}</p>}
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Email *</label>
                <input
                  type="email"
                  placeholder="customer@email.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); clearError('email'); }}
                  className={fieldClass('email')}
                />
                {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Phone</label>
                <input
                  type="tel"
                  placeholder="+971 50 XXX XXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-accent focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Password *</label>
                <input
                  type="password"
                  placeholder="Min 6 characters"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); clearError('password'); }}
                  className={fieldClass('password')}
                />
                {errors.password && <p className="mt-1 text-xs text-destructive">{errors.password}</p>}
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Preferred Language</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="en">English</option>
                  <option value="ar">Arabic</option>
                  <option value="ru">Russian</option>
                  <option value="zh">Chinese</option>
                  <option value="de">German</option>
                </select>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="mb-4 font-semibold text-foreground">Address (Optional)</h3>
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Area</label>
                <select
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">Select area</option>
                  <option>Dubai Marina</option>
                  <option>Downtown Dubai</option>
                  <option>JBR</option>
                  <option>Palm Jumeirah</option>
                  <option>Business Bay</option>
                  <option>JLT</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Building Name</label>
                <input
                  type="text"
                  placeholder="Building name"
                  value={building}
                  onChange={(e) => setBuilding(e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-accent focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">Unit</label>
                  <input
                    type="text"
                    placeholder="Apt #"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-accent focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">Floor</label>
                  <input
                    type="text"
                    placeholder="Floor"
                    value={floor}
                    onChange={(e) => setFloor(e.target.value)}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-accent focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Link href="/admin/customers" className="rounded-lg border border-border px-6 py-2 text-sm font-medium text-foreground hover:bg-muted">Cancel</Link>
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-accent px-6 py-2 text-sm font-semibold text-accent-foreground hover:bg-accent/90 disabled:opacity-50"
          >
            {saving ? 'Creating...' : 'Create Customer'}
          </button>
        </div>
      </form>
    </div>
  );
}
