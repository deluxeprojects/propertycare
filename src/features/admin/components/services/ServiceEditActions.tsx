'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

interface ServiceEditActionsProps {
  serviceId: string;
  initialData: Record<string, unknown>;
}

export function ServiceEditActions({ serviceId, initialData }: ServiceEditActionsProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  async function handleSave(updates: Record<string, unknown>) {
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch(`/api/v1/admin/services/${serviceId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (!res.ok) {
        const data = await res.json();
        setMessage({ type: 'error', text: data.error || 'Failed to save changes.' });
      } else {
        setMessage({ type: 'success', text: 'Service updated successfully.' });
        router.refresh();
      }
    } catch {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    }

    setSaving(false);
  }

  async function handleToggleActive() {
    if (!confirm(`Are you sure you want to ${initialData.is_active ? 'deactivate' : 'activate'} this service?`)) return;
    await handleSave({ is_active: !initialData.is_active });
  }

  return (
    <div className="space-y-4">
      {message && (
        <div
          className={`rounded-lg px-4 py-3 text-sm font-medium ${
            message.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <h3 className="mb-2 font-semibold text-red-800">Danger Zone</h3>
        <p className="mb-4 text-sm text-red-600">
          {initialData.is_active
            ? 'Deactivating a service will hide it from the booking flow.'
            : 'Activating a service will make it visible in the booking flow.'}
        </p>
        <button
          onClick={handleToggleActive}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
        >
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          {initialData.is_active ? 'Deactivate Service' : 'Activate Service'}
        </button>
      </div>
    </div>
  );
}
