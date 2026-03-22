import { ProKeepLogo } from '@/components/shared/ProKeepLogo';

export const metadata = { title: 'Admin Login' };

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-primary px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center text-primary-foreground">
          <div className="mb-2">
            <ProKeepLogo size="md" dark />
          </div>
          <h1 className="text-lg font-medium text-primary-foreground/60">Admin Panel</h1>
          <p className="text-primary-foreground/60">Sign in to the admin panel</p>
        </div>

        <div className="rounded-xl border border-primary-foreground/10 bg-primary-foreground/5 p-6 backdrop-blur">
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-primary-foreground">Email</label>
              <input type="email" placeholder="admin@liviohomes.ae" className="w-full rounded-lg border border-primary-foreground/20 bg-primary-foreground/10 px-3 py-2 text-sm text-primary-foreground placeholder:text-primary-foreground/40 focus:border-accent focus:outline-none" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-primary-foreground">Password</label>
              <input type="password" placeholder="••••••••" className="w-full rounded-lg border border-primary-foreground/20 bg-primary-foreground/10 px-3 py-2 text-sm text-primary-foreground placeholder:text-primary-foreground/40 focus:border-accent focus:outline-none" />
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
