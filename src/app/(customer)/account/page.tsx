'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Order {
  id: string;
  order_number: string;
  service_name: string;
  scheduled_date: string;
  scheduled_time_slot: string;
  status: string;
  total_amount: number;
}

export default function AccountPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/v1/customer/orders')
      .then(async (res) => {
        if (!res.ok) throw new Error('Failed to load orders');
        const data = await res.json();
        setOrders(data.orders ?? data ?? []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const statusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="px-4 py-12 md:py-16">
      <div className="container mx-auto max-w-4xl">
        <h1 className="mb-6 text-2xl font-bold text-foreground">My Orders</h1>

        {loading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 animate-pulse rounded-xl border border-border bg-muted" />
            ))}
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
            <p className="text-sm text-red-700">{error}</p>
            <button onClick={() => window.location.reload()} className="mt-3 text-sm font-medium text-red-700 underline">
              Try again
            </button>
          </div>
        )}

        {!loading && !error && orders.length === 0 && (
          <div className="rounded-xl border border-border bg-card p-8 text-center">
            <p className="mb-4 text-muted-foreground">You have no orders yet.</p>
            <Link href="/book" className="rounded-lg bg-accent px-6 py-2.5 text-sm font-semibold text-accent-foreground hover:bg-accent/90">
              Book a Service
            </Link>
          </div>
        )}

        {!loading && !error && orders.length > 0 && (
          <div className="space-y-4">
            {orders.map((o) => (
              <div key={o.id} className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-foreground">{o.service_name}</p>
                    <p className="text-sm text-muted-foreground">{o.scheduled_date} · {o.scheduled_time_slot}</p>
                    <p className="text-sm text-muted-foreground">Order #{o.order_number || o.id}</p>
                  </div>
                  <div className="text-right">
                    <span className={`rounded-full px-2 py-1 text-xs font-medium ${statusColor(o.status)}`}>
                      {o.status}
                    </span>
                    <p className="mt-1 font-semibold text-foreground">AED {o.total_amount}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
