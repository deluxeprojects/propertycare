import { MapPin, Phone, Clock } from 'lucide-react';

const tasks = [
  { id: '1', time: '08:00-10:00', customer: 'Sarah M.', phone: '+971501234567', service: 'Deep Cleaning - 2BR', area: 'Dubai Marina', building: 'Marina Gate 1', unit: '2304', status: 'completed', notes: 'Ring doorbell twice' },
  { id: '2', time: '10:30-12:30', customer: 'Ahmed K.', phone: '+971502345678', service: 'AC Service (x3 units)', area: 'Downtown Dubai', building: 'Burj Vista 2', unit: '1508', status: 'in_progress', notes: '' },
  { id: '3', time: '14:00-16:00', customer: 'Wei Z.', phone: '+971506789012', service: 'AC Deep Clean', area: 'JLT', building: 'Cluster D, Lake Shore Tower', unit: '907', status: 'assigned', notes: 'Call 15 min before' },
  { id: '4', time: '16:30-18:00', customer: 'Elena V.', phone: '+971507890123', service: 'Pest Control - 1BR', area: 'Dubai Marina', building: 'Marina Promenade', unit: '412', status: 'assigned', notes: 'Has a cat — use pet-safe products' },
];

const statusColors: Record<string, { bg: string; text: string; label: string }> = {
  assigned: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Upcoming' },
  in_transit: { bg: 'bg-indigo-100', text: 'text-indigo-800', label: 'En Route' },
  in_progress: { bg: 'bg-cyan-100', text: 'text-cyan-800', label: 'In Progress' },
  completed: { bg: 'bg-green-100', text: 'text-green-800', label: 'Completed' },
};

export default function StaffTasksPage() {
  const completed = tasks.filter(t => t.status === 'completed').length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Today&apos;s Tasks</h1>
          <p className="text-sm text-muted-foreground">{completed}/{tasks.length} completed</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-sm font-bold text-accent-foreground">
          {tasks.length}
        </div>
      </div>

      <div className="space-y-3">
        {tasks.map((task) => {
          const s = statusColors[task.status] ?? statusColors['assigned']!;
          return (
            <div key={task.id} className="rounded-xl border border-border bg-card p-4">
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-semibold text-foreground">{task.time}</span>
                  </div>
                  <h3 className="mt-1 font-semibold text-foreground">{task.service}</h3>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${s.bg} ${s.text}`}>
                  {s.label}
                </span>
              </div>

              <div className="mb-3 space-y-1.5 text-sm">
                <div className="flex items-center gap-2 text-foreground">
                  <span className="font-medium">{task.customer}</span>
                  <a href={`tel:${task.phone}`} className="text-accent"><Phone className="h-3.5 w-3.5" /></a>
                </div>
                <div className="flex items-start gap-2 text-muted-foreground">
                  <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  <span>{task.building}, Unit {task.unit}, {task.area}</span>
                </div>
                {task.notes && (
                  <p className="rounded-lg bg-yellow-50 px-3 py-1.5 text-xs text-yellow-800">
                    Note: {task.notes}
                  </p>
                )}
              </div>

              {task.status !== 'completed' && (
                <div className="flex gap-2">
                  {task.status === 'assigned' && (
                    <button className="flex-1 rounded-lg bg-accent py-2.5 text-sm font-semibold text-accent-foreground">
                      Start Route
                    </button>
                  )}
                  {task.status === 'in_transit' && (
                    <button className="flex-1 rounded-lg bg-accent py-2.5 text-sm font-semibold text-accent-foreground">
                      Arrived — Start Job
                    </button>
                  )}
                  {task.status === 'in_progress' && (
                    <button className="flex-1 rounded-lg bg-green-600 py-2.5 text-sm font-semibold text-white">
                      Complete Job
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
