import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/admin';
import { ArrowLeft, Star, Briefcase, MapPin, Phone, Mail, Calendar } from 'lucide-react';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function TechnicianDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = createAdminClient();

  const { data: tech } = await supabase
    .from('technicians')
    .select('*, profiles!technicians_profile_id_fkey(full_name, email, phone)')
    .eq('id', id)
    .single();

  if (!tech) notFound();

  const profile = tech.profiles as unknown as { full_name: string; email: string; phone: string } | null;

  const { data: recentOrders } = await supabase
    .from('orders')
    .select('id, order_number, status, scheduled_date, scheduled_time_slot, rating, services(name_en), areas(name_en)')
    .eq('assigned_technician_id', tech.profile_id)
    .order('scheduled_date', { ascending: false })
    .limit(15);

  const { data: categories } = await supabase
    .from('service_categories')
    .select('id, name_en')
    .in('id', tech.specializations ?? []);

  const { data: areas } = await supabase
    .from('areas')
    .select('id, name_en')
    .in('id', tech.work_areas ?? []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/workforce" className="rounded-lg p-2 text-muted-foreground hover:bg-muted"><ArrowLeft className="h-5 w-5" /></Link>
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
            {profile?.full_name?.split(' ').map((n: string) => n[0]).join('') ?? '?'}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{profile?.full_name}</h1>
            <p className="text-sm text-muted-foreground">{tech.employee_code} · {tech.employment_type?.replace('_', ' ')}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Contact */}
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="mb-3 font-semibold text-foreground">Contact</h3>
            <div className="space-y-2 text-sm">
              {profile?.email && <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-muted-foreground" />{profile.email}</div>}
              {profile?.phone && <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-muted-foreground" /><a href={`tel:${profile.phone}`} className="text-accent">{profile.phone}</a></div>}
            </div>
          </div>

          {/* Skills & Areas */}
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="mb-3 font-semibold text-foreground">Specializations & Areas</h3>
            <div className="mb-3">
              <p className="mb-2 text-xs font-medium uppercase text-muted-foreground">Skills</p>
              <div className="flex flex-wrap gap-2">
                {(categories ?? []).map(c => <span key={c.id} className="rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">{c.name_en}</span>)}
              </div>
            </div>
            <div>
              <p className="mb-2 text-xs font-medium uppercase text-muted-foreground">Areas</p>
              <div className="flex flex-wrap gap-2">
                {(areas ?? []).map(a => <span key={a.id} className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">{a.name_en}</span>)}
              </div>
            </div>
          </div>

          {/* Recent jobs */}
          <div className="rounded-xl border border-border bg-card">
            <div className="border-b border-border px-5 py-4">
              <h3 className="font-semibold text-foreground">Recent Jobs</h3>
            </div>
            <div className="divide-y divide-border">
              {(recentOrders ?? []).map(o => (
                <Link key={o.id} href={`/admin/orders/${o.id}`} className="flex items-center justify-between px-5 py-3 hover:bg-muted/30">
                  <div>
                    <p className="text-sm font-medium text-accent">{o.order_number}</p>
                    <p className="text-xs text-muted-foreground">
                      {(o.services as unknown as { name_en: string } | null)?.name_en} · {(o.areas as unknown as { name_en: string } | null)?.name_en} · {o.scheduled_date}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {o.rating && <span className="flex items-center gap-1 text-sm"><Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />{o.rating}</span>}
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${o.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{o.status}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="mb-3 font-semibold text-foreground">Performance</h3>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div><p className="text-2xl font-bold text-foreground">{tech.total_jobs}</p><p className="text-xs text-muted-foreground">Total Jobs</p></div>
              <div><p className="text-2xl font-bold text-foreground">{tech.avg_rating ?? '—'}</p><p className="text-xs text-muted-foreground">Avg Rating</p></div>
              <div><p className="text-2xl font-bold text-foreground">{tech.daily_capacity}</p><p className="text-xs text-muted-foreground">Daily Capacity</p></div>
              <div>
                <p className={`text-2xl font-bold ${tech.is_available ? 'text-green-600' : 'text-red-600'}`}>{tech.is_available ? 'Yes' : 'No'}</p>
                <p className="text-xs text-muted-foreground">Available</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="mb-3 font-semibold text-foreground">Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Joined</span><span className="text-foreground">{tech.joined_at}</span></div>
              {tech.hourly_rate_aed && <div className="flex justify-between"><span className="text-muted-foreground">Rate</span><span className="text-foreground">AED {tech.hourly_rate_aed}/hr</span></div>}
              {tech.commission_pct > 0 && <div className="flex justify-between"><span className="text-muted-foreground">Commission</span><span className="text-foreground">{tech.commission_pct}%</span></div>}
              {tech.vehicle_type && tech.vehicle_type !== 'none' && <div className="flex justify-between"><span className="text-muted-foreground">Vehicle</span><span className="text-foreground">{tech.vehicle_type}{tech.vehicle_plate ? ` (${tech.vehicle_plate})` : ''}</span></div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
