import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCaseStore } from "@/store/case.store";
import { useAuthStore } from "@/store/auth.store";
import { sensitivityStyles, statusStyles } from "@/lib/caseStyles";
import { useNavigate } from "react-router-dom";

export default function CaseListPage() {

    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [sensitivity, setSensitivity] = useState("");

    const [activeFilters, setActiveFilters] = useState<{
      title?: string
      status?: string
      sensitivity?: string
    }>({})

  const { user } = useAuthStore();
  const {
    cases,
    page,
    totalPages,
    loading,
    error,
    fetchCases,
    fetchMyCases,
  } = useCaseStore();

  const isAdmin = user?.role === "ADMIN";

  useEffect(() => {
  if (isAdmin) {
    fetchCases(0, 10, {
      title: search,
      status,
      sensitivity,
    });
  } else {
    fetchMyCases(0, 10, {
      title: search,
      status,
      sensitivity,
    });
  }
}, [isAdmin]);


 if (loading) {
  return (
    <div className="p-4 md:p-8 space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center">
        <div className="h-6 w-32 bg-gray-200 rounded"></div>
        <div className="h-9 w-28 bg-gray-200 rounded-md"></div>
      </div>

      {/* Filters Skeleton */}
      <div className="bg-white border rounded-xl p-4 flex flex-col md:flex-row gap-4">
        <div className="h-10 bg-gray-200 rounded w-full md:w-56"></div>
        <div className="h-10 bg-gray-200 rounded w-full md:w-40"></div>
        <div className="h-10 bg-gray-200 rounded w-full md:w-40"></div>
        <div className="h-10 bg-gray-200 rounded w-full md:w-24"></div>
      </div>

      {/* Table/Card Skeleton */}
      <div className="space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="bg-white border rounded-xl p-4 space-y-3"
          >
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>

            <div className="flex gap-4">
              <div className="h-4 bg-gray-200 rounded w-20"></div>
              <div className="h-4 bg-gray-200 rounded w-24"></div>
            </div>

            <div className="h-3 bg-gray-200 rounded w-40"></div>
          </div>
        ))}
      </div>
    </div>
  );
}


  if (error) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
      <div className="bg-white border rounded-2xl p-8 max-w-md w-full shadow-sm space-y-6">
        <div className="text-red-600 text-sm font-medium tracking-wide uppercase">
          Something went wrong
        </div>

        <h2 className="text-lg font-semibold text-gray-800">
          Unable to load cases
        </h2>

        <p className="text-sm text-gray-500">
          {error}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() =>
              isAdmin
                ? fetchCases(0, 10, activeFilters)
                : fetchMyCases(0, 10, activeFilters)
            }
            className="px-4 py-2 bg-gray-900 text-white text-sm rounded-md hover:bg-gray-800"
          >
            Retry
          </button>

          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 border text-sm rounded-md hover:bg-gray-50"
          >
            Refresh Page
          </button>
        </div>
      </div>
    </div>
  );
}


 return (
  <div className="p-4 md:p-8 space-y-6">
    <div className="flex justify-between items-center">
      <h1 className="text-xl font-semibold text-gray-800">Cases</h1>

      <Link
        to="/cases/create"
        className="px-4 py-2 bg-gray-900 text-white text-sm rounded-md hover:bg-gray-800"
      >
        Create Case
      </Link>
    </div>

    {/* Filters */}
    <div className="bg-white border rounded-xl p-4 flex flex-col md:flex-row gap-4 md:items-end">
      <div className="flex flex-col">
        <label className="text-xs text-gray-500 mb-1">Search Title</label>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-md px-3 py-2 text-sm w-full md:w-56"
          placeholder="Search by title..."
        />
      </div>

      <div className="flex flex-col">
        <label className="text-xs text-gray-500 mb-1">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border rounded-md px-3 py-2 text-sm w-full md:w-40"
        >
          <option value="">All</option>
          <option value="OPEN">OPEN</option>
          <option value="IN_PROGRESS">IN_PROGRESS</option>
          <option value="CLOSED">CLOSED</option>
          <option value="ARCHIVED">ARCHIVED</option>
        </select>
      </div>

      <div className="flex flex-col">
        <label className="text-xs text-gray-500 mb-1">Sensitivity</label>
        <select
          value={sensitivity}
          onChange={(e) => setSensitivity(e.target.value)}
          className="border rounded-md px-3 py-2 text-sm w-full md:w-40"
        >
          <option value="">All</option>
          <option value="LOW">LOW</option>
          <option value="MEDIUM">MEDIUM</option>
          <option value="HIGH">HIGH</option>
          <option value="CRITICAL">CRITICAL</option>
        </select>
      </div>

      <button
        onClick={() => {
          const filters = {
            title: search || undefined,
            status: status || undefined,
            sensitivity: sensitivity || undefined,
          };

          setActiveFilters(filters);

          if (isAdmin) {
            fetchCases(0, 10, filters);
          } else {
            fetchMyCases(0, 10, filters);
          }
        }}
        className="px-4 py-2 bg-gray-900 text-white text-sm rounded-md hover:bg-gray-800 w-full md:w-auto"
      >
        Apply
      </button>
    </div>

    {/* Mobile Card View */}
    <div className="md:hidden space-y-4">
      {cases.map((c) => (
        <div
          key={c.id}
          onClick={() => navigate(`/cases/${c.id}`)}
          className="border rounded-xl p-4 bg-white space-y-3 hover:bg-gray-50 transition cursor-pointer"
        >
          <div className="font-medium text-gray-800">{c.title}</div>

          <div className="flex justify-between text-xs">
            <span
              className={`px-2 py-1 rounded-md ${statusStyles[c.status]}`}
            >
              {c.status}
            </span>

            <span
              className={`px-2 py-1 rounded-md ${
                sensitivityStyles[c.sensitivityLevel]
              }`}
            >
              {c.sensitivityLevel}
            </span>
          </div>

          <div className="text-xs text-gray-500">
            Owner: {c.ownerEmail}
          </div>
        </div>
      ))}
    </div>

    {/* Desktop Table */}
    <div className="hidden md:block bg-white border rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="text-left px-3 md:px-6 py-3">Title</th>
              <th className="text-left px-3 md:px-6 py-3">Status</th>
              <th className="text-left px-3 md:px-6 py-3 hidden md:table-cell">
                Owner
              </th>
              <th className="text-left px-3 md:px-6 py-3">Sensitivity</th>
            </tr>
          </thead>
          <tbody>
            {cases.map((c) => (
              <tr
                key={c.id}
                onClick={() => navigate(`/cases/${c.id}`)}
                className="border-t hover:bg-gray-50 transition cursor-pointer"
              >
                <td className="px-3 md:px-6 py-3 md:py-4 text-gray-800 hover:underline">
                  {c.title}
                </td>

                <td className="px-3 md:px-6 py-3 md:py-4">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-md ${statusStyles[c.status]}`}
                  >
                    {c.status}
                  </span>
                </td>

                <td className="px-3 md:px-6 py-3 md:py-4 text-gray-600 hidden md:table-cell">
                  {c.ownerEmail}
                </td>

                <td className="px-3 md:px-6 py-3 md:py-4">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-md ${
                      sensitivityStyles[c.sensitivityLevel]
                    }`}
                  >
                    {c.sensitivityLevel}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    {/* Pagination */}
    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
      {Array.from({ length: totalPages }).map((_, i) => (
        <button
          key={i}
          onClick={() =>
            isAdmin
              ? fetchCases(i, 10, activeFilters)
              : fetchMyCases(i, 10, activeFilters)
          }
          disabled={loading}
          className={`px-3 py-1 text-sm rounded-md border ${
            i === page
              ? "bg-gray-900 text-white"
              : "bg-white hover:bg-gray-50"
          }`}
        >
          {i + 1}
        </button>
      ))}
    </div>
  </div>
);

}
