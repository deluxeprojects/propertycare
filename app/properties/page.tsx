import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Properties | PropertyCare",
};

const properties = [
  {
    name: "Oakwood Apartments",
    address: "142 Oakwood Dr, Springfield, IL 62704",
    units: 18,
    activeIssues: 3,
    occupancy: 94,
    type: "Apartment Complex",
  },
  {
    name: "Maple Ridge Condos",
    address: "890 Maple Ridge Ln, Springfield, IL 62711",
    units: 32,
    activeIssues: 1,
    occupancy: 100,
    type: "Condominium",
  },
  {
    name: "Cedar Lane Townhomes",
    address: "55 Cedar Ln, Chatham, IL 62629",
    units: 12,
    activeIssues: 0,
    occupancy: 83,
    type: "Townhome",
  },
  {
    name: "Birchwood Plaza",
    address: "2100 Birchwood Ave, Springfield, IL 62702",
    units: 24,
    activeIssues: 2,
    occupancy: 92,
    type: "Mixed Use",
  },
  {
    name: "Riverside Suites",
    address: "310 River Rd, Rochester, IL 62563",
    units: 8,
    activeIssues: 1,
    occupancy: 100,
    type: "Apartment Complex",
  },
  {
    name: "Pinecrest Village",
    address: "780 Pinecrest Blvd, Sherman, IL 62684",
    units: 40,
    activeIssues: 1,
    occupancy: 88,
    type: "Apartment Complex",
  },
];

export default function PropertiesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Properties</h1>
          <p className="text-gray-500 mt-1">
            Manage and monitor all your properties in one place.
          </p>
        </div>
        <button className="px-5 py-2.5 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors text-sm">
          + Add Property
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <div
            key={property.name}
            className="card hover:shadow-md hover:border-emerald-200 transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-gray-900">{property.name}</h3>
                <p className="text-sm text-gray-500 mt-0.5">
                  {property.address}
                </p>
              </div>
              <span className="badge bg-emerald-50 text-emerald-700 text-xs">
                {property.type}
              </span>
            </div>

            <div className="border-t border-gray-100 pt-4 mt-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-xl font-bold text-gray-900">
                    {property.units}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">Units</p>
                </div>
                <div>
                  <p
                    className={`text-xl font-bold ${
                      property.activeIssues > 0
                        ? "text-orange-500"
                        : "text-emerald-600"
                    }`}
                  >
                    {property.activeIssues}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">Active Issues</p>
                </div>
                <div>
                  <p
                    className={`text-xl font-bold ${
                      property.occupancy >= 90
                        ? "text-emerald-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {property.occupancy}%
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">Occupancy</p>
                </div>
              </div>
            </div>

            {/* Occupancy bar */}
            <div className="mt-4">
              <div className="w-full bg-gray-100 rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full ${
                    property.occupancy >= 90
                      ? "bg-emerald-500"
                      : "bg-yellow-500"
                  }`}
                  style={{ width: `${property.occupancy}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
