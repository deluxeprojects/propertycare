import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | PropertyCare",
};

const stats = [
  {
    label: "Total Properties",
    value: "24",
    change: "+2 this month",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
  {
    label: "Active Requests",
    value: "8",
    change: "3 urgent",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    label: "Completed This Month",
    value: "15",
    change: "+23% vs last month",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    label: "Avg Response Time",
    value: "2.4 days",
    change: "-0.5 days vs last month",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

const recentRequests = [
  {
    id: "MR-1042",
    property: "Oakwood Apartments",
    unit: "Unit 3B",
    issue: "Leaking kitchen faucet",
    status: "In Progress",
    priority: "High",
    date: "2026-03-20",
  },
  {
    id: "MR-1041",
    property: "Maple Ridge Condos",
    unit: "Unit 12A",
    issue: "HVAC not heating properly",
    status: "Pending",
    priority: "High",
    date: "2026-03-19",
  },
  {
    id: "MR-1040",
    property: "Cedar Lane Townhomes",
    unit: "Unit 7",
    issue: "Broken window latch",
    status: "Completed",
    priority: "Medium",
    date: "2026-03-18",
  },
  {
    id: "MR-1039",
    property: "Birchwood Plaza",
    unit: "Unit 5C",
    issue: "Garbage disposal jammed",
    status: "In Progress",
    priority: "Low",
    date: "2026-03-17",
  },
  {
    id: "MR-1038",
    property: "Riverside Suites",
    unit: "Unit 2D",
    issue: "Bathroom exhaust fan not working",
    status: "Pending",
    priority: "Medium",
    date: "2026-03-16",
  },
];

function StatusBadge({ status }: { status: string }) {
  const classes =
    status === "Pending"
      ? "badge-pending"
      : status === "In Progress"
      ? "badge-in-progress"
      : "badge-completed";
  return <span className={`badge ${classes}`}>{status}</span>;
}

function PriorityBadge({ priority }: { priority: string }) {
  const classes =
    priority === "High"
      ? "badge-high"
      : priority === "Medium"
      ? "badge-medium"
      : "badge-low";
  return <span className={`badge ${classes}`}>{priority}</span>;
}

export default function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">
          Overview of your property maintenance operations.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="card flex items-start gap-4">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
              {stat.icon}
            </div>
            <div>
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-emerald-600 mt-0.5">{stat.change}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Requests Table */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-gray-900">
            Recent Maintenance Requests
          </h2>
          <a
            href="/maintenance"
            className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
          >
            View all
          </a>
        </div>
        <div className="overflow-x-auto -mx-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left font-medium text-gray-500 px-6 pb-3">
                  ID
                </th>
                <th className="text-left font-medium text-gray-500 px-6 pb-3">
                  Property / Unit
                </th>
                <th className="text-left font-medium text-gray-500 px-6 pb-3">
                  Issue
                </th>
                <th className="text-left font-medium text-gray-500 px-6 pb-3">
                  Status
                </th>
                <th className="text-left font-medium text-gray-500 px-6 pb-3">
                  Priority
                </th>
                <th className="text-left font-medium text-gray-500 px-6 pb-3">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentRequests.map((req) => (
                <tr key={req.id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-3.5 font-medium text-gray-900">
                    {req.id}
                  </td>
                  <td className="px-6 py-3.5">
                    <div className="text-gray-900">{req.property}</div>
                    <div className="text-gray-500 text-xs">{req.unit}</div>
                  </td>
                  <td className="px-6 py-3.5 text-gray-700">{req.issue}</td>
                  <td className="px-6 py-3.5">
                    <StatusBadge status={req.status} />
                  </td>
                  <td className="px-6 py-3.5">
                    <PriorityBadge priority={req.priority} />
                  </td>
                  <td className="px-6 py-3.5 text-gray-500">{req.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
