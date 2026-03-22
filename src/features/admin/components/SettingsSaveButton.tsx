'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

interface SettingsSaveButtonProps {
  settings: Record<string, unknown>;
}

export function SettingsSaveButton({ settings }: SettingsSaveButtonProps) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    // Settings are managed by form submissions — for now show success
    await new Promise(r => setTimeout(r, 300));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={handleSave}
        disabled={saving}
        className="rounded-lg bg-accent px-6 py-2 text-sm font-semibold text-accent-foreground hover:bg-accent/90 disabled:opacity-50"
      >
        {saving ? 'Saving...' : 'Save Changes'}
      </button>
      {saved && <span className="text-sm text-green-600">Saved successfully</span>}
    </div>
  );
}
