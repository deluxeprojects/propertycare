import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NewCustomerPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/customers" className="rounded-lg p-2 text-muted-foreground hover:bg-muted"><ArrowLeft className="h-5 w-5" /></Link>
        <h1 className="text-2xl font-bold text-foreground">Add Customer</h1>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="mb-4 font-semibold text-foreground">Customer Details</h3>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Full Name *</label>
              <input type="text" placeholder="Customer name" className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-accent focus:outline-none" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Email *</label>
              <input type="email" placeholder="customer@email.com" className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-accent focus:outline-none" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Phone</label>
              <input type="tel" placeholder="+971 50 XXX XXXX" className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-accent focus:outline-none" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Password *</label>
              <input type="password" placeholder="Min 6 characters" className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-accent focus:outline-none" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Preferred Language</label>
              <select className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                <option value="en">English</option>
                <option value="ar">Arabic</option>
                <option value="ru">Russian</option>
                <option value="zh">Chinese</option>
                <option value="de">German</option>
              </select>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="mb-4 font-semibold text-foreground">Address (Optional)</h3>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Area</label>
              <select className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                <option value="">Select area</option>
                <option>Dubai Marina</option>
                <option>Downtown Dubai</option>
                <option>JBR</option>
                <option>Palm Jumeirah</option>
                <option>Business Bay</option>
                <option>JLT</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Building Name</label>
              <input type="text" placeholder="Building name" className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-accent focus:outline-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Unit</label>
                <input type="text" placeholder="Apt #" className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-accent focus:outline-none" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Floor</label>
                <input type="text" placeholder="Floor" className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-accent focus:outline-none" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-3">
        <Link href="/admin/customers" className="rounded-lg border border-border px-6 py-2 text-sm font-medium text-foreground hover:bg-muted">Cancel</Link>
        <button className="rounded-lg bg-accent px-6 py-2 text-sm font-semibold text-accent-foreground hover:bg-accent/90">Create Customer</button>
      </div>
    </div>
  );
}
