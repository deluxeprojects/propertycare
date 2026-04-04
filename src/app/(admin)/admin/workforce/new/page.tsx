'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Check } from 'lucide-react';

interface Category {
  id: string;
  name_en: string;
}

interface Area {
  id: string;
  name_en: string;
}

export default function NewTechnicianPage() {
  const [employeeCode, setEmployeeCode] = useState('');
  const [profileEmail, setProfileEmail] = useState('');
  const [specializations, setSpecializations] = useState<string[]>([]);
  const [workAreas, setWorkAreas] = useState<string[]>([]);
  const [employmentType, setEmploymentType] = useState('full_time');
  const [hourlyRate, setHourlyRate] = useState('');
  const [dailyCapacity, setDailyCapacity] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [apiError, setApiError] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);

  useEffect(() => {
    // Fetch categories from services endpoint
    fetch('/api/v1/public/services')
      .then(res => res.json())
      .then(json => {
        const catMap = new Map<string, Category>();
        if (json.data && Array.isArray(json.data)) {
          for (const svc of json.data) {
            if (svc.service_categories) {
              const cat = svc.service_categories;
              if (cat.id && !catMap.has(cat.id)) {
                catMap.set(cat.id, { id: cat.id, name_en: cat.name_en });
              }
            }
          }
        }
        setCategories(Array.from(catMap.values()).sort((a, b) => a.name_en.localeCompare(b.name_en)));
      })
      .catch(() => setCategories([]));

    // Fetch areas
    fetch('/api/v1/public/areas')
      .then(res => res.json())
      .then(json => {
        if (json.data && Array.isArray(json.data)) {
          setAreas(json.data.map((a: { id: string; name_en: string }) => ({ id: a.id, name_en: a.name_en })));
        }
      })
      .catch(() => setAreas([]));
  }, []);

  const toggleSpecialization = (id: string) => {
    setSpecializations(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
    clearError('specializations');
  };

  const toggleWorkArea = (id: string) => {
    setWorkAreas(prev =>
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
    clearError('workAreas');
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!employeeCode.trim()) {
      e.employeeCode = 'Employee code is required';
    } else if (!/^TECH-\d{3}$/.test(employeeCode.trim())) {
      e.employeeCode = 'Employee code must follow format TECH-XXX (e.g. TECH-001)';
    }
    if (!profileEmail.trim()) {
      e.profileEmail = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileEmail)) {
      e.profileEmail = 'Enter a valid email address';
    }
    if (specializations.length === 0) {
      e.specializations = 'At least 1 specialization is required';
    }
    if (workAreas.length === 0) {
      e.workAreas = 'At least 1 work area is required';
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
      const res = await fetch('/api/v1/admin/workforce', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employeeCode,
          profileEmail,
          specializations,
          workAreas,
          employmentType,
          hourlyRate,
          dailyCapacity,
          vehicleType,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setApiError(data.error || 'Failed to create technician');
        setSaving(false);
        return;
      }
      setSaved(true);
      setSaving(false);
      setTimeout(() => { window.location.href = '/admin/workforce'; }, 1000);
    } catch {
      setApiError('Network error. Please try again.');
      setSaving(false);
    }
  };

  const clearError = (field: string) => {
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const fieldClass = (field: string) =>
    `w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 ${errors[field] ? 'border-destructive focus:border-destructive focus:ring-destructive' : 'border-input focus:border-accent focus:ring-accent'}`;

  if (saved) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/workforce" className="rounded-lg p-2 text-muted-foreground hover:bg-muted">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Add Technician</h1>
        </div>
        <div className="rounded-xl border border-green-300 bg-green-50 p-6 dark:border-green-800 dark:bg-green-950">
          <div className="flex items-center gap-3">
            <Check className="h-5 w-5 text-green-600" />
            <p className="font-medium text-green-800 dark:text-green-200">Technician created successfully</p>
          </div>
          <Link href="/admin/workforce" className="mt-4 inline-block text-sm font-medium text-accent hover:underline">
            Back to workforce
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/workforce" className="rounded-lg p-2 text-muted-foreground hover:bg-muted">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Add Technician</h1>
          <p className="text-sm text-muted-foreground">Register a new technician</p>
        </div>
      </div>

      {apiError && (
        <div className="rounded-xl border border-red-300 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950">
          <p className="text-sm font-medium text-red-800 dark:text-red-200">{apiError}</p>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Employee Code *</label>
                <input
                  type="text"
                  placeholder="e.g. TECH-001"
                  value={employeeCode}
                  onChange={(e) => { setEmployeeCode(e.target.value); clearError('employeeCode'); }}
                  className={fieldClass('employeeCode')}
                />
                {errors.employeeCode && <p className="mt-1 text-xs text-destructive">{errors.employeeCode}</p>}
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Profile (Email) *</label>
                <input
                  type="email"
                  placeholder="technician@email.com"
                  value={profileEmail}
                  onChange={(e) => { setProfileEmail(e.target.value); clearError('profileEmail'); }}
                  className={fieldClass('profileEmail')}
                />
                {errors.profileEmail && <p className="mt-1 text-xs text-destructive">{errors.profileEmail}</p>}
                <p className="mt-1 text-xs text-muted-foreground">Must match an existing user profile</p>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Specializations *</label>
              <div className={`grid gap-2 sm:grid-cols-2 lg:grid-cols-3 rounded-lg p-3 ${errors.specializations ? 'border border-destructive' : ''}`}>
                {categories.map((cat) => (
                  <div key={cat.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`cat-${cat.id}`}
                      checked={specializations.includes(cat.id)}
                      onChange={() => toggleSpecialization(cat.id)}
                      className="h-4 w-4 rounded border-input text-accent focus:ring-accent"
                    />
                    <label htmlFor={`cat-${cat.id}`} className="text-sm text-foreground">{cat.name_en}</label>
                  </div>
                ))}
                {categories.length === 0 && <p className="text-sm text-muted-foreground">Loading categories...</p>}
              </div>
              {errors.specializations && <p className="mt-1 text-xs text-destructive">{errors.specializations}</p>}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Work Areas *</label>
              <div className={`grid gap-2 sm:grid-cols-2 lg:grid-cols-3 rounded-lg p-3 ${errors.workAreas ? 'border border-destructive' : ''}`}>
                {areas.map((area) => (
                  <div key={area.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`area-${area.id}`}
                      checked={workAreas.includes(area.id)}
                      onChange={() => toggleWorkArea(area.id)}
                      className="h-4 w-4 rounded border-input text-accent focus:ring-accent"
                    />
                    <label htmlFor={`area-${area.id}`} className="text-sm text-foreground">{area.name_en}</label>
                  </div>
                ))}
                {areas.length === 0 && <p className="text-sm text-muted-foreground">Loading areas...</p>}
              </div>
              {errors.workAreas && <p className="mt-1 text-xs text-destructive">{errors.workAreas}</p>}
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Employment Type</label>
                <select
                  value={employmentType}
                  onChange={(e) => setEmploymentType(e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                >
                  <option value="full_time">Full-Time</option>
                  <option value="part_time">Part-Time</option>
                  <option value="contract">Contract</option>
                  <option value="freelance">Freelance</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Hourly Rate (AED)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="e.g. 45.00"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Daily Capacity (hours)</label>
                <input
                  type="number"
                  placeholder="e.g. 8"
                  value={dailyCapacity}
                  onChange={(e) => setDailyCapacity(e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Vehicle Type</label>
                <input
                  type="text"
                  placeholder="e.g. Van, Sedan, Motorcycle"
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Link href="/admin/workforce" className="rounded-lg border border-border px-6 py-2 text-sm font-medium text-foreground hover:bg-muted">
                Cancel
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-accent px-6 py-2 text-sm font-semibold text-accent-foreground hover:bg-accent/90 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Technician'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
