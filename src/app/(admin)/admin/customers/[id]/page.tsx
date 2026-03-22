import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/admin';
import { ArrowLeft, Mail, Phone, MapPin, ShoppingCart, Wallet, Shield } from 'lucide-react';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function CustomerDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = createAdminClient();

  const { data: customer } = await supabase.from('profiles').select('*').eq('id', id).single();
  if (!customer) notFound();

  const { data: orders } = await supabase
    .from('orders')
    .select('id, order_number, status, total_amount_aed, scheduled_date, services(name_en)')
    .eq('customer_id', id)
    .order('created_at', { ascending: false })
    .limit(10);

  const { data: addresses } = await supabase
    .from('customer_addresses')
    .select('*, areas(name_en)')
    .eq('customer_id', id);

  const { data: wallet } = await supabase
    .from('customer_wallets')
    .select('*')
    .eq('customer_id', id)
    .single();

  const { data: subscriptions } = await supabase
    .from('amc_subscriptions')
    .select('*, amc_plans(name_en, tier)')
    .eq('customer_id', id);

  const totalSpent = (orders ?? []).reduce((sum, o) => sum + (o.total_amount_aed ?? 0), 0);

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    assigned: 'bg-purple-100 text-purple-800',
    in_progress: 'bg-cyan-100 text-cyan-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/customers" className="rounded-lg p-2 text-muted-foreground hover:bg-muted"><ArrowLeft className="h-5 w-5" /></Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">{customer.full_name}</h1>
          <p className="text-sm text-muted-foreground">Customer since {new Date(customer.created_at).toLocaleDateString('en-GB', { year: 'numeric', month: 'short' })}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Contact */}
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="mb-3 font-semibold text-foreground">Contact Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-muted-foreground" /><span className="text-foreground">{customer.email}</span></div>
              {customer.phone && <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-muted-foreground" /><a href={`tel:${customer.phone}`} className="text-accent">{customer.phone}</a></div>}
              <p className="text-muted-foreground">Language: {customer.preferred_language?.toUpperCase() ?? 'EN'}</p>
            </div>
          </div>

          {/* Orders */}
          <div className="rounded-xl border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <h3 className="font-semibold text-foreground">Recent Orders</h3>
              <span className="text-sm text-muted-foreground">{orders?.length ?? 0} orders</span>
            </div>
            <div className="divide-y divide-border">
              {(orders ?? []).map((o) => (
                <Link key={o.id} href={`/admin/orders/${o.id}`} className="flex items-center justify-between px-5 py-3 hover:bg-muted/30">
                  <div>
                    <p className="text-sm font-medium text-accent">{o.order_number}</p>
                    <p className="text-xs text-muted-foreground">{(o.services as unknown as { name_en: string } | null)?.name_en} · {o.scheduled_date}</p>
                  </div>
                  <div className="text-right">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[o.status] ?? 'bg-gray-100'}`}>{o.status}</span>
                    <p className="mt-1 text-sm font-medium text-foreground">AED {o.total_amount_aed}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Addresses */}
          {addresses && addresses.length > 0 && (
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="mb-3 font-semibold text-foreground">Addresses</h3>
              <div className="space-y-3">
                {addresses.map((addr) => (
                  <div key={addr.id} className="flex items-start gap-2 text-sm">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-foreground">{addr.label}{addr.is_default ? ' (Default)' : ''}</p>
                      <p className="text-muted-foreground">
                        {[addr.building_name, addr.unit_number ? `Unit ${addr.unit_number}` : '', (addr.areas as unknown as { name_en: string } | null)?.name_en].filter(Boolean).join(', ')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="mb-3 font-semibold text-foreground">Summary</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Total Orders</span><span className="font-medium text-foreground">{orders?.length ?? 0}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Total Spent</span><span className="font-medium text-foreground">AED {totalSpent.toLocaleString()}</span></div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="mb-3 flex items-center gap-2 font-semibold text-foreground"><Wallet className="h-4 w-4" /> Wallet</h3>
            <p className="text-2xl font-bold text-foreground">AED {wallet?.balance_aed?.toFixed(2) ?? '0.00'}</p>
            <button className="mt-3 w-full rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted">Add Credit</button>
          </div>

          {subscriptions && subscriptions.length > 0 && (
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="mb-3 flex items-center gap-2 font-semibold text-foreground"><Shield className="h-4 w-4" /> Care Plan</h3>
              {subscriptions.map((sub) => (
                <div key={sub.id} className="text-sm">
                  <p className="font-medium text-foreground">{(sub.amc_plans as unknown as { name_en: string } | null)?.name_en}</p>
                  <p className="text-muted-foreground">{sub.status} · ends {sub.end_date}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
