import { siteConfig } from '@/config/site';

export const metadata = {
  title: 'Book a Service',
  description: `Book professional home services with ${siteConfig.name}. Choose your service, configure, schedule, and pay in minutes.`,
};

export default function BookPage() {
  return (
    <div className="px-4 py-12 md:py-16">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-foreground">Book a Service</h1>
          <p className="text-muted-foreground">Complete your booking in 8 simple steps</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8 flex overflow-x-auto">
          {['Service', 'Size', 'Add-ons', 'Location', 'Schedule', 'Account', 'Review', 'Done'].map((step, i) => (
            <div key={step} className="flex items-center">
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                i === 0 ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground'
              }`}>
                {i + 1}
              </div>
              <span className={`ml-2 whitespace-nowrap text-sm ${
                i === 0 ? 'font-medium text-foreground' : 'text-muted-foreground'
              }`}>
                {step}
              </span>
              {i < 7 && <div className="mx-3 h-px w-8 bg-border" />}
            </div>
          ))}
        </div>

        {/* Step 1: Service Selection */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-4 text-xl font-semibold text-foreground">Select a Service</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { name: 'Cleaning', count: 12, icon: '🧹' },
              { name: 'AC Services', count: 5, icon: '❄️' },
              { name: 'Pest Control', count: 10, icon: '🐛' },
              { name: 'Plumbing', count: 7, icon: '🔧' },
              { name: 'Electrical', count: 5, icon: '⚡' },
              { name: 'Painting & Fit-Out', count: 11, icon: '🎨' },
            ].map((cat) => (
              <button
                key={cat.name}
                className="rounded-lg border border-border p-4 text-left transition-colors hover:border-accent hover:bg-accent/5"
              >
                <span className="text-2xl">{cat.icon}</span>
                <h3 className="mt-2 font-semibold text-foreground">{cat.name}</h3>
                <p className="text-xs text-muted-foreground">{cat.count} services</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
