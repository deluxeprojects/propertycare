const days = [
  { day: 'Mon', date: '24', tasks: 5, hours: '08:00-20:00' },
  { day: 'Tue', date: '25', tasks: 4, hours: '08:00-18:00' },
  { day: 'Wed', date: '26', tasks: 6, hours: '08:00-22:00' },
  { day: 'Thu', date: '27', tasks: 3, hours: '10:00-18:00' },
  { day: 'Fri', date: '28', tasks: 0, hours: 'Day Off', isOff: true },
  { day: 'Sat', date: '29', tasks: 5, hours: '08:00-20:00' },
  { day: 'Sun', date: '30', tasks: 4, hours: '08:00-18:00' },
];

export default function StaffSchedulePage() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-foreground">My Schedule</h1>
      <p className="text-sm text-muted-foreground">This week — March 24-30, 2026</p>

      <div className="space-y-2">
        {days.map((d) => (
          <div
            key={d.day}
            className={`flex items-center justify-between rounded-xl border p-4 ${
              d.isOff ? 'border-border bg-muted/50' : 'border-border bg-card'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className="text-xs text-muted-foreground">{d.day}</p>
                <p className="text-lg font-bold text-foreground">{d.date}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  {d.isOff ? 'Day Off' : `${d.tasks} tasks`}
                </p>
                <p className="text-xs text-muted-foreground">{d.hours}</p>
              </div>
            </div>
            {!d.isOff && (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10 text-sm font-bold text-accent">
                {d.tasks}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
