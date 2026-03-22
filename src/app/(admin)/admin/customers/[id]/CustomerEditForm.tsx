'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Loader2, Shield } from 'lucide-react';

interface CustomerEditFormProps {
  customerId: string;
  initialName: string;
  initialPhone: string;
  initialLanguage: string;
}

export function CustomerEditForm({ customerId, initialName, initialPhone, initialLanguage }: CustomerEditFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const supabase = createClient();

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    const fd = new FormData(e.currentTarget);

    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: fd.get('full_name') as string,
        phone: fd.get('phone') as string,
        preferred_language: fd.get('preferred_language') as string,
      })
      .eq('id', customerId);

    if (error) {
      setMessage({ type: 'error', text: `Failed to save: ${error.message}` });
    } else {
      setMessage({ type: 'success', text: 'Customer updated successfully.' });
      router.refresh();
    }
    setSaving(false);
  }

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this customer? This action cannot be undone.')) return;
    setDeleting(true);
    const { error } = await supabase
      .from('profiles')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', customerId);

    if (error) {
      setMessage({ type: 'error', text: `Failed to delete: ${error.message}` });
      setDeleting(false);
    } else {
      router.push('/admin/customers');
    }
  }

  return (
    <>
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="mb-4 font-semibold text-foreground">Edit Customer</h3>

        {message && (
          <div className={`mb-4 rounded-lg px-4 py-3 text-sm font-medium ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label htmlFor="full_name" className="mb-1.5 block text-sm font-medium text-foreground">Full Name</label>
            <input
              id="full_name"
              name="full_name"
              type="text"
              defaultValue={initialName}
              required
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-accent focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-foreground">Phone</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              defaultValue={initialPhone}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-accent focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="preferred_language" className="mb-1.5 block text-sm font-medium text-foreground">Preferred Language</label>
            <select
              id="preferred_language"
              name="preferred_language"
              defaultValue={initialLanguage}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-accent focus:outline-none"
            >
              <option value="en">English</option>
              <option value="ar">Arabic</option>
            </select>
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

      {/* Danger Zone */}
      <div className="rounded-xl border border-red-200 bg-red-50/50 p-5">
        <h3 className="mb-3 flex items-center gap-2 font-semibold text-red-800">
          <Shield className="h-4 w-4" /> Danger Zone
        </h3>
        <p className="mb-3 text-xs text-red-700">Permanently delete this customer. This will soft-delete the profile and cannot be easily undone.</p>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-50"
        >
          {deleting && <Loader2 className="h-4 w-4 animate-spin" />}
          Delete Customer
        </button>
      </div>
    </>
  );
}
