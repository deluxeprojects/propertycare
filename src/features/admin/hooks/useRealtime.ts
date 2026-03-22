'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { RealtimeChannel } from '@supabase/supabase-js';

export function useRealtimeOrders() {
  const [newOrderCount, setNewOrderCount] = useState(0);

  useEffect(() => {
    const supabase = createClient();
    let channel: RealtimeChannel;

    channel = supabase
      .channel('new-orders')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'orders' },
        () => {
          setNewOrderCount((prev) => prev + 1);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const resetCount = useCallback(() => setNewOrderCount(0), []);

  return { newOrderCount, resetCount };
}

export function useRealtimeOrderUpdates(orderId: string) {
  const [order, setOrder] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    const supabase = createClient();
    let channel: RealtimeChannel;

    channel = supabase
      .channel(`order-${orderId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${orderId}`,
        },
        (payload) => {
          setOrder(payload.new as Record<string, unknown>);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderId]);

  return { order };
}
