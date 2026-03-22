import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/admin';
import { ArrowLeft, Phone, MapPin, Clock, User, CreditCard } from 'lucide-react';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = createAdminClient();

  const { data: order } = await supabase
    .from('orders')
    .select(`
      *,
      services(name_en, service_code, duration_minutes),
      service_variants(variant_label),
      areas(name_en),
      profiles!orders_customer_id_fkey(full_name, phone, email),
      customer_addresses!orders_address_id_fkey(building_name, unit_number, floor, street_address, special_instructions)
    `)
    .eq('id', id)
    .single();

  if (!order) {
    // Try by order_number
    const { data: orderByNum } = await supabase
      .from('orders')
      .select(`
        *,
        services(name_en, service_code, duration_minutes),
        service_variants(variant_label),
        areas(name_en),
        profiles!orders_customer_id_fkey(full_name, phone, email),
        customer_addresses!orders_address_id_fkey(building_name, unit_number, floor, street_address, special_instructions)
      `)
      .eq('order_number', id)
      .single();

    if (!orderByNum) notFound();
    // Use orderByNum below
  }

  const o = order!;
  const customer = o.profiles as unknown as { full_name: string; phone: string; email: string } | null;
  const service = o.services as unknown as { name_en: string; service_code: string; duration_minutes: number } | null;
  const variant = o.service_variants as unknown as { variant_label: string } | null;
  const area = o.areas as unknown as { name_en: string } | null;
  const address = o.customer_addresses as unknown as { building_name: string | null; unit_number: string | null; floor: string | null; street_address: string | null; special_instructions: string | null } | null;

  const { data: history } = await supabase
    .from('order_status_history')
    .select('*, profiles!order_status_history_changed_by_fkey(full_name)')
    .eq('order_id', o.id)
    .order('created_at', { ascending: false });

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    assigned: 'bg-purple-100 text-purple-800',
    in_transit: 'bg-indigo-100 text-indigo-800',
    in_progress: 'bg-cyan-100 text-cyan-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    refunded: 'bg-red-100 text-red-800',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/orders" className="rounded-lg p-2 text-muted-foreground hover:bg-muted">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">{o.order_number}</h1>
          <p className="text-sm text-muted-foreground">
            Created {new Date(o.created_at).toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
        <span className={`ml-auto rounded-full px-3 py-1 text-sm font-medium ${statusColors[o.status] ?? 'bg-gray-100 text-gray-800'}`}>
          {o.status.replace('_', ' ')}
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer */}
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="mb-3 flex items-center gap-2 font-semibold text-foreground"><User className="h-4 w-4" /> Customer</h3>
            <div className="space-y-1 text-sm">
              <p className="font-medium text-foreground">{customer?.full_name}</p>
              <p className="text-muted-foreground">{customer?.email}</p>
              <a href={`tel:${customer?.phone}`} className="flex items-center gap-1 text-accent"><Phone className="h-3 w-3" />{customer?.phone}</a>
            </div>
          </div>

          {/* Service */}
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="mb-3 font-semibold text-foreground">Service Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Service</span><span className="font-medium text-foreground">{service?.name_en}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Code</span><span className="font-mono text-xs text-muted-foreground">{service?.service_code}</span></div>
              {variant && <div className="flex justify-between"><span className="text-muted-foreground">Size</span><span className="text-foreground">{variant.variant_label}</span></div>}
              <div className="flex justify-between"><span className="text-muted-foreground">Duration</span><span className="text-foreground">{service?.duration_minutes} min</span></div>
            </div>
          </div>

          {/* Location */}
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="mb-3 flex items-center gap-2 font-semibold text-foreground"><MapPin className="h-4 w-4" /> Location</h3>
            <div className="space-y-1 text-sm">
              {address?.building_name && <p className="font-medium text-foreground">{address.building_name}</p>}
              {address?.unit_number && <p className="text-muted-foreground">Unit {address.unit_number}{address.floor ? `, Floor ${address.floor}` : ''}</p>}
              {area && <p className="text-muted-foreground">{area.name_en}, Dubai</p>}
              {address?.special_instructions && (
                <p className="mt-2 rounded-lg bg-yellow-50 px-3 py-2 text-xs text-yellow-800">Note: {address.special_instructions}</p>
              )}
            </div>
          </div>

          {/* Timeline */}
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="mb-3 flex items-center gap-2 font-semibold text-foreground"><Clock className="h-4 w-4" /> Timeline</h3>
            <div className="space-y-3">
              {(history ?? []).map((h) => {
                const changedBy = (h.profiles as unknown as { full_name: string } | null)?.full_name ?? 'System';
                return (
                  <div key={h.id} className="flex items-start gap-3 text-sm">
                    <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-accent" />
                    <div>
                      <p className="text-foreground">
                        {h.from_status ? `${h.from_status} → ` : ''}<span className="font-medium">{h.to_status}</span>
                      </p>
                      <p className="text-xs text-muted-foreground">{changedBy} · {new Date(h.created_at).toLocaleString('en-GB')}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Internal notes */}
          {o.notes_internal && (
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="mb-3 font-semibold text-foreground">Internal Notes</h3>
              <pre className="whitespace-pre-wrap text-sm text-muted-foreground">{o.notes_internal}</pre>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Schedule */}
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="mb-3 flex items-center gap-2 font-semibold text-foreground"><Clock className="h-4 w-4" /> Schedule</h3>
            <p className="text-sm font-medium text-foreground">{o.scheduled_date}</p>
            <p className="text-sm text-muted-foreground">{o.scheduled_time_slot}</p>
            {o.is_express && <p className="mt-1 text-xs font-medium text-yellow-600">Express Service</p>}
          </div>

          {/* Pricing */}
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="mb-3 flex items-center gap-2 font-semibold text-foreground"><CreditCard className="h-4 w-4" /> Pricing</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Base</span><span>AED {o.base_amount_aed}</span></div>
              {o.addons_amount_aed > 0 && <div className="flex justify-between"><span className="text-muted-foreground">Add-ons</span><span>AED {o.addons_amount_aed}</span></div>}
              {o.pricing_adjustments_aed !== 0 && <div className="flex justify-between"><span className="text-muted-foreground">Adjustments</span><span>AED {o.pricing_adjustments_aed}</span></div>}
              {o.express_surcharge_aed > 0 && <div className="flex justify-between"><span className="text-yellow-600">Express</span><span className="text-yellow-600">AED {o.express_surcharge_aed}</span></div>}
              {o.discount_amount_aed > 0 && <div className="flex justify-between"><span className="text-green-600">Discount</span><span className="text-green-600">-AED {o.discount_amount_aed}</span></div>}
              <div className="flex justify-between"><span className="text-muted-foreground">VAT (5%)</span><span>AED {o.vat_amount_aed}</span></div>
              <div className="flex justify-between border-t border-border pt-2 font-bold"><span>Total</span><span>AED {o.total_amount_aed}</span></div>
            </div>
          </div>

          {/* Payment */}
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="mb-3 font-semibold text-foreground">Payment</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Method</span><span className="text-foreground">{o.payment_method ?? 'Not set'}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Status</span>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                  o.payment_status === 'captured' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>{o.payment_status}</span>
              </div>
              {o.payment_intent_id && <p className="font-mono text-xs text-muted-foreground">{o.payment_intent_id}</p>}
            </div>
          </div>

          {/* Actions */}
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="mb-3 font-semibold text-foreground">Actions</h3>
            <div className="space-y-2">
              <button className="w-full rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted">Assign Technician</button>
              <button className="w-full rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted">Reschedule</button>
              <button className="w-full rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted">Generate Invoice</button>
              <button className="w-full rounded-lg border border-destructive px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/10">Cancel Order</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
