import { ProKeepLogo } from '@/components/shared/ProKeepLogo';

export const metadata = { title: 'Sign In' };

export default function LoginPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mb-4">
            <ProKeepLogo size="md" />
          </div>
          <h1 className="mb-2 text-lg font-medium text-muted-foreground">Sign in to your account</h1>
          <p className="text-muted-foreground">Sign in to manage your bookings</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Email</label>
              <input type="email" placeholder="your@email.com" className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Password</label>
              <input type="password" placeholder="••••••••" className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent" />
            </div>
            <button className="w-full rounded-lg bg-accent py-2.5 text-sm font-semibold text-accent-foreground hover:bg-accent/90">
              Sign In
            </button>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
            <div className="relative flex justify-center"><span className="bg-card px-2 text-xs text-muted-foreground">or continue with</span></div>
          </div>

          <button className="w-full rounded-lg border border-border py-2.5 text-sm font-medium text-foreground hover:bg-muted">
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
}
