'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

interface OrderActionsProps {
  orderId: string;
  currentStatus: string;
  paymentIntentId?: string | null;
}

export function OrderActions({ orderId, currentStatus, paymentIntentId }: OrderActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Status change
  const changeStatus = async (newStatus: string) => {
    setLoading(newStatus);
    setError('');
    const supabase = createClient();
    const { error: err } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId);

    if (err) {
      setError(err.message);
    } else {
      setSuccess(`Status changed to ${newStatus}`);
      router.refresh();
    }
    setLoading('');
  };

  // Cancel
  const cancelOrder = async () => {
    if (!confirm('Are you sure you want to cancel this order?')) return;
    setLoading('cancel');
    const supabase = createClient();
    const { error: err } = await supabase
      .from('orders')
      .update({ status: 'cancelled', cancelled_by: 'admin' })
      .eq('id', orderId);

    if (err) setError(err.message);
    else { setSuccess('Order cancelled'); router.refresh(); }
    setLoading('');
  };

  // Generate invoice
  const generateInvoice = async () => {
    setLoading('invoice');
    try {
      const res = await fetch('/api/v1/admin/orders/' + orderId + '/invoice', { method: 'POST' });
      if (res.ok) setSuccess('Invoice generated');
      else setError('Failed to generate invoice');
    } catch { setError('Failed'); }
    setLoading('');
  };

  const statuses = ['pending', 'confirmed', 'assigned', 'in_transit', 'in_progress', 'completed'];
  const currentIdx = statuses.indexOf(currentStatus);
  const nextStatus = currentIdx >= 0 && currentIdx < statuses.length - 1 ? statuses[currentIdx + 1] : null;

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h3 className="mb-3 font-semibold text-foreground">Actions</h3>

      {error && <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">{error}</p>}
      {success && <p className="mb-3 rounded-lg bg-green-50 px-3 py-2 text-xs text-green-700">{success}</p>}

      <div className="space-y-2">
        {nextStatus && currentStatus !== 'completed' && currentStatus !== 'cancelled' && (
          <button
            onClick={() => changeStatus(nextStatus)}
            disabled={loading !== ''}
            className="w-full rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground hover:bg-accent/90 disabled:opacity-50"
          >
            {loading === nextStatus ? 'Updating...' : `Move to ${nextStatus.replace('_', ' ')}`}
          </button>
        )}

        {currentStatus !== 'completed' && currentStatus !== 'cancelled' && (
          <>
            <select
              onChange={(e) => { if (e.target.value) changeStatus(e.target.value); e.target.value = ''; }}
              className="w-full rounded-lg border border-border px-4 py-2 text-sm text-foreground"
              defaultValue=""
            >
              <option value="" disabled>Change status to...</option>
              {statuses.filter(s => s !== currentStatus).map(s => (
                <option key={s} value={s}>{s.replace('_', ' ')}</option>
              ))}
            </select>

            <button
              onClick={generateInvoice}
              disabled={loading !== ''}
              className="w-full rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted disabled:opacity-50"
            >
              {loading === 'invoice' ? 'Generating...' : 'Generate Invoice'}
            </button>

            <button
              onClick={cancelOrder}
              disabled={loading !== ''}
              className="w-full rounded-lg border border-destructive px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 disabled:opacity-50"
            >
              {loading === 'cancel' ? 'Cancelling...' : 'Cancel Order'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
