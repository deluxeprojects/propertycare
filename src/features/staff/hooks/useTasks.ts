'use client';

import { useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';

interface Task {
  id: string;
  order_number: string;
  scheduled_date: string;
  scheduled_time_slot: string;
  status: string;
  notes_customer: string | null;
  services: { name_en: string; service_code: string; duration_minutes: number } | null;
  profiles: { full_name: string; phone: string } | null;
  customer_addresses: {
    building_name: string | null;
    unit_number: string | null;
    street_address: string | null;
    special_instructions: string | null;
  } | null;
  areas: { name_en: string } | null;
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTasks = useCallback(async (date?: string) => {
    setLoading(true);
    const supabase = createClient();
    const targetDate = date ?? new Date().toISOString().split('T')[0];

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }

    const { data } = await supabase
      .from('orders')
      .select(`
        id, order_number, scheduled_date, scheduled_time_slot, status, notes_customer,
        services(name_en, service_code, duration_minutes),
        profiles!orders_customer_id_fkey(full_name, phone),
        customer_addresses!orders_address_id_fkey(building_name, unit_number, street_address, special_instructions),
        areas(name_en)
      `)
      .eq('assigned_technician_id', user.id)
      .eq('scheduled_date', targetDate)
      .not('status', 'in', '("cancelled","refunded")')
      .order('scheduled_time_slot');

    setTasks((data as unknown as Task[]) ?? []);
    setLoading(false);
  }, []);

  const updateStatus = useCallback(async (taskId: string, status: string) => {
    const supabase = createClient();
    const updates: Record<string, unknown> = { status };
    if (status === 'in_progress') updates.actual_start_at = new Date().toISOString();
    if (status === 'completed') updates.actual_end_at = new Date().toISOString();

    await supabase.from('orders').update(updates).eq('id', taskId);
    // Refresh tasks
    await fetchTasks();
  }, [fetchTasks]);

  return { tasks, loading, fetchTasks, updateStatus };
}
