'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { serviceChecklists } from '@/config/checklists';
import { PhotoCapture } from '@/features/staff/components/PhotoCapture';
import { ArrowLeft, Phone, MapPin, Clock, CheckSquare, Square } from 'lucide-react';
import Link from 'next/link';

interface Task {
  id: string;
  order_number: string;
  scheduled_date: string;
  scheduled_time_slot: string;
  status: string;
  notes_customer: string | null;
  services: { name_en: string; service_code: string } | null;
  service_variants: { variant_label: string } | null;
  profiles: { full_name: string; phone: string } | null;
  customer_addresses: { building_name: string | null; unit_number: string | null; street_address: string | null; special_instructions: string | null } | null;
  areas: { name_en: string } | null;
  service_categories: { slug: string } | null;
}

export default function TaskDetailPage() {
  const params = useParams();
  const taskId = params.id as string;
  const [task, setTask] = useState<Task | null>(null);
  const [checklist, setChecklist] = useState<boolean[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase
        .from('orders')
        .select(`
          id, order_number, scheduled_date, scheduled_time_slot, status, notes_customer,
          services(name_en, service_code, category_id),
          service_variants(variant_label),
          profiles!orders_customer_id_fkey(full_name, phone),
          customer_addresses!orders_address_id_fkey(building_name, unit_number, street_address, special_instructions),
          areas(name_en)
        `)
        .eq('id', taskId)
        .single();

      if (data) {
        setTask(data as unknown as Task);
        // Determine checklist from service category
        const serviceData = data.services as unknown as { category_id: string } | null;
        if (serviceData?.category_id) {
          const { data: cat } = await supabase
            .from('service_categories')
            .select('slug')
            .eq('id', serviceData.category_id)
            .single();
          const items = serviceChecklists[cat?.slug ?? ''] ?? [];
          setChecklist(new Array(items.length).fill(false));
        }
      }
      setLoading(false);
    }
    load();
  }, [taskId]);

  if (loading) return <div className="p-4 text-center text-muted-foreground">Loading...</div>;
  if (!task) return <div className="p-4 text-center text-muted-foreground">Task not found</div>;

  const customer = task.profiles;
  const address = task.customer_addresses;
  const area = task.areas;
  const service = task.services;

  // Get checklist items
  const categorySlug = (task.service_categories as unknown as { slug: string } | null)?.slug ?? 'cleaning';
  const checklistItems = serviceChecklists[categorySlug] ?? serviceChecklists['cleaning'] ?? [];

  const toggleCheck = (i: number) => {
    setChecklist(prev => prev.map((v, idx) => idx === i ? !v : v));
  };

  const updateStatus = async (newStatus: string) => {
    const supabase = createClient();
    const updates: Record<string, unknown> = { status: newStatus };
    if (newStatus === 'in_transit') updates.status = 'in_transit';
    if (newStatus === 'in_progress') updates.actual_start_at = new Date().toISOString();
    if (newStatus === 'completed') updates.actual_end_at = new Date().toISOString();
    await supabase.from('orders').update(updates).eq('id', taskId);
    setTask(prev => prev ? { ...prev, status: newStatus } : null);
  };

  const statusColors: Record<string, string> = {
    assigned: 'bg-blue-100 text-blue-800',
    in_transit: 'bg-indigo-100 text-indigo-800',
    in_progress: 'bg-cyan-100 text-cyan-800',
    completed: 'bg-green-100 text-green-800',
  };

  return (
    <div className="space-y-4">
      <Link href="/staff" className="inline-flex items-center gap-1 text-sm text-accent">
        <ArrowLeft className="h-4 w-4" /> Back to Tasks
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-lg font-bold text-foreground">{service?.name_en}</h1>
          <p className="text-sm text-muted-foreground">{task.order_number}</p>
        </div>
        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusColors[task.status] ?? 'bg-gray-100 text-gray-800'}`}>
          {task.status.replace('_', ' ')}
        </span>
      </div>

      {/* Schedule */}
      <div className="flex items-center gap-2 text-sm text-foreground">
        <Clock className="h-4 w-4 text-muted-foreground" />
        {task.scheduled_date} · {task.scheduled_time_slot}
      </div>

      {/* Customer */}
      <div className="rounded-xl border border-border bg-card p-4">
        <h3 className="mb-2 text-sm font-semibold text-foreground">Customer</h3>
        <p className="font-medium text-foreground">{customer?.full_name}</p>
        {customer?.phone && (
          <a href={`tel:${customer.phone}`} className="mt-1 flex items-center gap-1 text-sm text-accent">
            <Phone className="h-3.5 w-3.5" /> {customer.phone}
          </a>
        )}
      </div>

      {/* Location */}
      <div className="rounded-xl border border-border bg-card p-4">
        <h3 className="mb-2 text-sm font-semibold text-foreground">Location</h3>
        <div className="flex items-start gap-2 text-sm text-foreground">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
          <div>
            {address?.building_name && <p>{address.building_name}{address.unit_number ? `, Unit ${address.unit_number}` : ''}</p>}
            {area && <p className="text-muted-foreground">{area.name_en}, Dubai</p>}
          </div>
        </div>
        {address?.special_instructions && (
          <p className="mt-2 rounded-lg bg-yellow-50 px-3 py-2 text-xs text-yellow-800">
            Note: {address.special_instructions}
          </p>
        )}
        {address?.building_name && (
          <a
            href={`https://www.google.com/maps/search/${encodeURIComponent(address.building_name + ' Dubai')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center text-xs font-medium text-accent"
          >
            Open in Google Maps →
          </a>
        )}
      </div>

      {/* Checklist */}
      <div className="rounded-xl border border-border bg-card p-4">
        <h3 className="mb-3 text-sm font-semibold text-foreground">
          Service Checklist ({checklist.filter(Boolean).length}/{checklistItems.length})
        </h3>
        <div className="space-y-2">
          {checklistItems.map((item, i) => (
            <button
              key={i}
              onClick={() => toggleCheck(i)}
              className="flex w-full items-center gap-3 text-left text-sm"
            >
              {checklist[i] ? (
                <CheckSquare className="h-5 w-5 shrink-0 text-green-600" />
              ) : (
                <Square className="h-5 w-5 shrink-0 text-muted-foreground" />
              )}
              <span className={checklist[i] ? 'text-muted-foreground line-through' : 'text-foreground'}>
                {item}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Photos */}
      {task.status === 'in_progress' && (
        <div className="rounded-xl border border-border bg-card p-4">
          <h3 className="mb-3 text-sm font-semibold text-foreground">Completion Photos</h3>
          <PhotoCapture orderId={taskId} />
        </div>
      )}

      {/* Status actions */}
      {task.status !== 'completed' && (
        <div className="space-y-2">
          {task.status === 'assigned' && (
            <button onClick={() => updateStatus('in_transit')} className="w-full rounded-lg bg-accent py-3 text-sm font-semibold text-accent-foreground">
              Start Route
            </button>
          )}
          {task.status === 'in_transit' && (
            <button onClick={() => updateStatus('in_progress')} className="w-full rounded-lg bg-accent py-3 text-sm font-semibold text-accent-foreground">
              Arrived — Start Job
            </button>
          )}
          {task.status === 'in_progress' && (
            <button onClick={() => updateStatus('completed')} className="w-full rounded-lg bg-green-600 py-3 text-sm font-semibold text-white">
              Complete Job
            </button>
          )}
        </div>
      )}
    </div>
  );
}
