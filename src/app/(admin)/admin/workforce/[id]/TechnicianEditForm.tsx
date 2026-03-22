'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Loader2 } from 'lucide-react';

interface TechnicianEditFormProps {
  technicianId: string;
  initialSpecializations: string[];
  initialWorkAreas: string[];
  initialDailyCapacity: number;
  initialHourlyRate: number;
  initialIsAvailable: boolean;
  allCategories: { id: string; name: string }[];
  allAreas: { id: string; name: string }[];
}

export function TechnicianEditForm({
  technicianId,
  initialSpecializations,
  initialWorkAreas,
  initialDailyCapacity,
  initialHourlyRate,
  initialIsAvailable,
  allCategories,
  allAreas,
}: TechnicianEditFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [specializations, setSpecializations] = useState<string[]>(initialSpecializations);
  const [workAreas, setWorkAreas] = useState<string[]>(initialWorkAreas);
  const [isAvailable, setIsAvailable] = useState(initialIsAvailable);

  const supabase = createClient();

  function toggleSpec(id: string) {
    setSpecializations(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  }

  function toggleArea(id: string) {
    setWorkAreas(prev => prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]);
  }

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    const fd = new FormData(e.currentTarget);

    const { error } = await supabase
      .from('technicians')
      .update({
        specializations,
        work_areas: workAreas,
        daily_capacity: Number(fd.get('daily_capacity')) || 6,
        hourly_rate_aed: Number(fd.get('hourly_rate_aed')) || 0,
        is_available: isAvailable,
      })
      .eq('id', technicianId);

    if (error) {
      setMessage({ type: 'error', text: `Failed to save: ${error.message}` });
    } else {
      setMessage({ type: 'success', text: 'Technician updated successfully.' });
      router.refresh();
    }
    setSaving(false);
  }

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h3 className="mb-4 font-semibold text-foreground">Edit Technician</h3>

      {message && (
        <div className={`mb-4 rounded-lg px-4 py-3 text-sm font-medium ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-4">
        {/* Specializations */}
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">Specializations</label>
          <div className="flex flex-wrap gap-2">
            {allCategories.map(c => (
              <button
                key={c.id}
                type="button"
                onClick={() => toggleSpec(c.id)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  specializations.includes(c.id)
                    ? 'bg-accent text-accent-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        {/* Work Areas */}
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">Work Areas</label>
          <div className="flex flex-wrap gap-2">
            {allAreas.map(a => (
              <button
                key={a.id}
                type="button"
                onClick={() => toggleArea(a.id)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  workAreas.includes(a.id)
                    ? 'bg-accent text-accent-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {a.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="daily_capacity" className="mb-1.5 block text-sm font-medium text-foreground">Daily Capacity</label>
            <input
              id="daily_capacity"
              name="daily_capacity"
              type="number"
              defaultValue={initialDailyCapacity}
              min={1}
              max={20}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-accent focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="hourly_rate_aed" className="mb-1.5 block text-sm font-medium text-foreground">Hourly Rate (AED)</label>
            <input
              id="hourly_rate_aed"
              name="hourly_rate_aed"
              type="number"
              defaultValue={initialHourlyRate}
              min={0}
              step="0.01"
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-accent focus:outline-none"
            />
          </div>
        </div>

        {/* Availability Toggle */}
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-foreground">Available</label>
          <button
            type="button"
            onClick={() => setIsAvailable(!isAvailable)}
            className={`relative h-6 w-11 rounded-full transition-colors ${isAvailable ? 'bg-green-500' : 'bg-gray-300'}`}
          >
            <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform ${isAvailable ? 'translate-x-5' : ''}`} />
          </button>
          <span className="text-sm text-muted-foreground">{isAvailable ? 'Active' : 'Unavailable'}</span>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-2.5 text-sm font-semibold text-accent-foreground hover:bg-accent/90 disabled:opacity-50"
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
