import { siteConfig } from '@/config/site';
import Link from 'next/link';

export const metadata = { title: 'My Orders' };

const orders = [
  { id: 'LH-2026-00042', service: 'Deep Cleaning - 2BR', date: '2026-03-22', time: '10:00-12:00', status: 'confirmed', total: 850 },
  { id: 'LH-2026-00038', service: 'Regular Cleaning', date: '2026-03-21', time: '10:00-12:00', status: 'completed', total: 152 },
  { id: 'LH-2026-00030', service: 'AC Service (x2)', date: '2026-03-15', time: '14:00-16:00', status: 'completed', total: 240 },
];

export default function AccountPage() {
  return (
    <div className="px-4 py-12 md:py-16">
      <div className="container mx-auto max-w-4xl">
        <h1 className="mb-6 text-2xl font-bold text-foreground">My Orders</h1>
        <div className="space-y-4">
          {orders.map((o) => (
            <div key={o.id} className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-foreground">{o.service}</p>
                  <p className="text-sm text-muted-foreground">{o.date} · {o.time}</p>
                  <p className="text-sm text-muted-foreground">Order #{o.id}</p>
                </div>
                <div className="text-right">
                  <span className={`rounded-full px-2 py-1 text-xs font-medium ${
                    o.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                  }`}>{o.status}</span>
                  <p className="mt-1 font-semibold text-foreground">AED {o.total}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
