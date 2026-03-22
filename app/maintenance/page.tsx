import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Maintenance | PropertyCare",
};

type MaintenanceRequest = {
  id: string;
  property: string;
  unit: string;
  issue: string;
  description: string;
  priority: "High" | "Medium" | "Low";
  status: "Pending" | "In Progress" | "Completed";
  reportedDate: string;
  assignedTo: string;
};

const requests: MaintenanceRequest[] = [
  {
    id: "MR-1042",
    property: "Oakwood Apartments",
    unit: "Unit 3B",
    issue: "Leaking kitchen faucet",
    description: "Kitchen faucet has a steady drip that worsens when the handle is turned.",
    priority: "High",
    status: "In Progress",
    reportedDate: "2026-03-20",
    assignedTo: "Mike Torres",
  },
  {
    id: "MR-1041",
    property: "Maple Ridge Condos",
    unit: "Unit 12A",
    issue: "HVAC not heating properly",
    description: "Heating system blows cold air. Thermostat shows correct setting but temperature stays low.",
    priority: "High",
    status: "Pending",
    reportedDate: "2026-03-19",
    assignedTo: "Unassigned",
  },
  {
    id: "MR-1040",
    property: "Cedar Lane Townhomes",
    unit: "Unit 7",
    issue: "Broken window latch",
    description: "Master bedroom window latch is broken and window cannot be secured shut.",
    priority: "Medium",
    status: "Completed",
    reportedDate: "2026-03-18",
    assignedTo: "Sarah Kim",
  },
  {
    id: "MR-1039",
    property: "Birchwood Plaza",
    unit: "Unit 5C",
    issue: "Garbage disposal jammed",
    description: "Garbage disposal makes humming noise but does not spin. Reset button does not help.",
    priority: "Low",
    status: "In Progress",
    reportedDate: "2026-03-17",
    assignedTo: "Mike Torres",
  },
  {
    id: "MR-1038",
    property: "Riverside Suites",
    unit: "Unit 2D",
    issue: "Bathroom exhaust fan not working",
    description: "Exhaust fan in main bathroom stopped working. No noise or movement when switched on.",
    priority: "Medium",
    status: "Pending",
    reportedDate: "2026-03-16",
    assignedTo: "Unassigned",
  },
  {
    id: "MR-1037",
    property: "Pinecrest Village",
    unit: "Unit 22B",
    issue: "Dishwasher leaking",
    description: "Water pools under the dishwasher during the wash cycle. Seal appears worn.",
    priority: "High",
    status: "Pending",
    reportedDate: "2026-03-15",
    assignedTo: "Unassigned",
  },
  {
    id: "MR-1036",
    property: "Oakwood Apartments",
    unit: "Unit 10A",
    issue: "Ceiling light flickering",
    description: "Living room ceiling light flickers intermittently. Bulb replacement did not fix the issue.",
    priority: "Low",
    status: "Completed",
    reportedDate: "2026-03-14",
    assignedTo: "Sarah Kim",
  },
  {
    id: "MR-1035",
    property: "Birchwood Plaza",
    unit: "Unit 8D",
    issue: "Front door deadbolt sticking",
    description: "Deadbolt lock is difficult to turn and sometimes does not fully engage.",
    priority: "Medium",
    status: "Completed",
    reportedDate: "2026-03-12",
    assignedTo: "Mike Torres",
  },
];

const tabs = ["All", "Pending", "In Progress", "Completed"] as const;

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

export default function MaintenancePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Maintenance Requests</h1>
          <p className="text-gray-500 mt-1">
            Track and manage all property maintenance requests.
          </p>
        </div>
        <button className="px-5 py-2.5 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors text-sm">
          + New Request
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
        {tabs.map((tab, i) => (
          <button
            key={tab}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              i === 0
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {requests.map((req) => (
          <div
            key={req.id}
            className="card hover:shadow-md hover:border-emerald-200 transition-all"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-sm font-mono text-gray-400">
                    {req.id}
                  </span>
                  <StatusBadge status={req.status} />
                  <PriorityBadge priority={req.priority} />
                </div>
                <h3 className="font-semibold text-gray-900 mt-2">
                  {req.issue}
                </h3>
                <p className="text-sm text-gray-600 mt-1">{req.description}</p>
                <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    {req.property} &middot; {req.unit}
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {req.reportedDate}
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {req.assignedTo}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
