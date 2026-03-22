import { HardHat, Plus } from 'lucide-react';

const technicians = [
  { code: 'TECH-001', name: 'Ali H.', specializations: ['Cleaning', 'Deep Clean'], areas: ['Dubai Marina', 'JBR'], rating: 4.9, jobs: 245, todayJobs: 4, capacity: 6, status: 'active' },
  { code: 'TECH-002', name: 'Omar M.', specializations: ['AC Services'], areas: ['Downtown Dubai', 'DIFC', 'Business Bay'], rating: 4.8, jobs: 312, todayJobs: 5, capacity: 6, status: 'active' },
  { code: 'TECH-003', name: 'Raj P.', specializations: ['Pest Control'], areas: ['Palm Jumeirah', 'Dubai Marina'], rating: 4.7, jobs: 189, todayJobs: 3, capacity: 6, status: 'active' },
  { code: 'TECH-004', name: 'Hassan S.', specializations: ['Plumbing', 'Electrical'], areas: ['JBR', 'JLT', 'Dubai Marina'], rating: 4.8, jobs: 275, todayJobs: 2, capacity: 6, status: 'active' },
  { code: 'TECH-005', name: 'Priya K.', specializations: ['Cleaning'], areas: ['Business Bay', 'Downtown Dubai'], rating: 4.9, jobs: 198, todayJobs: 4, capacity: 6, status: 'active' },
  { code: 'TECH-006', name: 'Mohammed A.', specializations: ['Painting', 'Fit-Out'], areas: ['All areas'], rating: 4.6, jobs: 87, todayJobs: 1, capacity: 3, status: 'active' },
  { code: 'TECH-007', name: 'David L.', specializations: ['AC Services', 'Electrical'], areas: ['JLT', 'Discovery Gardens'], rating: 4.5, jobs: 156, todayJobs: 0, capacity: 6, status: 'day_off' },
  { code: 'TECH-008', name: 'Aisha N.', specializations: ['Cleaning', 'Pest Control'], areas: ['Dubai Hills', 'Arabian Ranches'], rating: 4.8, jobs: 142, todayJobs: 3, capacity: 6, status: 'active' },
];

export default function WorkforcePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Workforce</h1>
          <p className="text-sm text-muted-foreground">{technicians.length} technicians</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-accent/90">
          <Plus className="h-4 w-4" /> Add Technician
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Code</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Name</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Specializations</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Areas</th>
              <th className="px-4 py-3 text-center font-medium text-muted-foreground">Rating</th>
              <th className="px-4 py-3 text-center font-medium text-muted-foreground">Today</th>
              <th className="px-4 py-3 text-center font-medium text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody>
            {technicians.map((t) => (
              <tr key={t.code} className="border-b border-border last:border-0 hover:bg-muted/30">
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{t.code}</td>
                <td className="px-4 py-3 font-medium text-foreground">{t.name}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {t.specializations.map((s) => (
                      <span key={s} className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">{s}</span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{t.areas.join(', ')}</td>
                <td className="px-4 py-3 text-center font-medium text-foreground">{t.rating}</td>
                <td className="px-4 py-3 text-center">
                  <span className={t.todayJobs >= t.capacity ? 'text-red-600 font-medium' : 'text-foreground'}>
                    {t.todayJobs}/{t.capacity}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                    t.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {t.status === 'active' ? 'Active' : 'Day Off'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
