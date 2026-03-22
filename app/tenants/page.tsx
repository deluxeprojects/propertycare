import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tenants | PropertyCare",
};

const tenants = [
  {
    name: "Emily Johnson",
    email: "emily.johnson@email.com",
    phone: "(217) 555-0142",
    property: "Oakwood Apartments",
    unit: "Unit 3B",
    leaseEnd: "2026-08-31",
    status: "Active",
  },
  {
    name: "Marcus Chen",
    email: "marcus.chen@email.com",
    phone: "(217) 555-0198",
    property: "Maple Ridge Condos",
    unit: "Unit 12A",
    leaseEnd: "2026-11-30",
    status: "Active",
  },
  {
    name: "Sarah Williams",
    email: "sarah.w@email.com",
    phone: "(217) 555-0276",
    property: "Cedar Lane Townhomes",
    unit: "Unit 7",
    leaseEnd: "2026-05-15",
    status: "Expiring Soon",
  },
  {
    name: "David Park",
    email: "d.park@email.com",
    phone: "(217) 555-0331",
    property: "Birchwood Plaza",
    unit: "Unit 5C",
    leaseEnd: "2027-01-31",
    status: "Active",
  },
  {
    name: "Rachel Torres",
    email: "rachel.t@email.com",
    phone: "(217) 555-0415",
    property: "Riverside Suites",
    unit: "Unit 2D",
    leaseEnd: "2026-06-30",
    status: "Expiring Soon",
  },
  {
    name: "James O'Brien",
    email: "j.obrien@email.com",
    phone: "(217) 555-0503",
    property: "Pinecrest Village",
    unit: "Unit 22B",
    leaseEnd: "2026-12-31",
    status: "Active",
  },
];

export default function TenantsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tenants</h1>
          <p className="text-gray-500 mt-1">
            View and manage tenant information across all properties.
          </p>
        </div>
        <button className="px-5 py-2.5 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors text-sm">
          + Add Tenant
        </button>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto -mx-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left font-medium text-gray-500 px-6 pb-3">
                  Tenant
                </th>
                <th className="text-left font-medium text-gray-500 px-6 pb-3">
                  Property
                </th>
                <th className="text-left font-medium text-gray-500 px-6 pb-3">
                  Unit
                </th>
                <th className="text-left font-medium text-gray-500 px-6 pb-3">
                  Lease End
                </th>
                <th className="text-left font-medium text-gray-500 px-6 pb-3">
                  Contact
                </th>
                <th className="text-left font-medium text-gray-500 px-6 pb-3">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {tenants.map((tenant) => (
                <tr key={tenant.email} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                        {tenant.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {tenant.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    {tenant.property}
                  </td>
                  <td className="px-6 py-4 text-gray-700">{tenant.unit}</td>
                  <td className="px-6 py-4 text-gray-700">
                    {tenant.leaseEnd}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-gray-700">{tenant.email}</div>
                    <div className="text-gray-500 text-xs">{tenant.phone}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`badge ${
                        tenant.status === "Active"
                          ? "badge-completed"
                          : "badge-pending"
                      }`}
                    >
                      {tenant.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
