import { User, Phone, Mail, Star, Briefcase, MapPin } from 'lucide-react';

export default function StaffProfilePage() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-foreground">My Profile</h1>

      <div className="rounded-xl border border-border bg-card p-6">
        <div className="mb-4 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
            OM
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">Omar M.</h2>
            <p className="text-sm text-muted-foreground">TECH-002 — AC Services Specialist</p>
          </div>
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-3 text-foreground">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span>+971 50 234 5678</span>
          </div>
          <div className="flex items-center gap-3 text-foreground">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span>omar@prokeep.ae</span>
          </div>
          <div className="flex items-center gap-3 text-foreground">
            <Star className="h-4 w-4 text-yellow-500" />
            <span>4.8 rating (312 jobs)</span>
          </div>
          <div className="flex items-center gap-3 text-foreground">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>Downtown Dubai, DIFC, Business Bay</span>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="mb-3 font-semibold text-foreground">Availability</h3>
        <div className="flex items-center justify-between">
          <span className="text-sm text-foreground">Available for tasks</span>
          <div className="h-6 w-11 rounded-full bg-green-500 p-0.5">
            <div className="h-5 w-5 translate-x-5 rounded-full bg-white" />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="mb-3 font-semibold text-foreground">This Month</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-foreground">48</p>
            <p className="text-xs text-muted-foreground">Jobs Done</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">4.8</p>
            <p className="text-xs text-muted-foreground">Avg Rating</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-accent">97%</p>
            <p className="text-xs text-muted-foreground">On Time</p>
          </div>
        </div>
      </div>
    </div>
  );
}
