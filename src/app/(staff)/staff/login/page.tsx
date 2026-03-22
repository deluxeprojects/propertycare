import { ProKeepLogo } from '@/components/shared/ProKeepLogo';

export const metadata = { title: 'Staff Login' };

export default function StaffLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mb-2">
            <ProKeepLogo size="md" />
          </div>
          <h1 className="text-sm font-medium text-muted-foreground">Staff Portal</h1>
          <p className="text-sm text-muted-foreground">Sign in to view your tasks</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Email</label>
              <input type="email" placeholder="tech@liviohomes.ae" className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Password</label>
              <input type="password" placeholder="••••••••" className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent" />
            </div>
            <button className="w-full rounded-lg bg-accent py-2.5 text-sm font-semibold text-accent-foreground hover:bg-accent/90">
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
