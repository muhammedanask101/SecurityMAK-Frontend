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
    return <div className="p-6 text-sm text-gray-500">Loading cases...</div>;
  }

  if (error) {
    return <div className="p-6 text-sm text-red-600">{error}</div>;
  }

  return (
    <div className="p-8 space-y-6">
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
  
  {/* Search */}
  <div className="flex flex-col">
    <label className="text-xs text-gray-500 mb-1">Search Title</label>
    <input
      type="text"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="border rounded-md px-3 py-2 text-sm w-56"
      placeholder="Search by title..."
    />
  </div>

  {/* Status Filter */}
  <div className="flex flex-col">
    <label className="text-xs text-gray-500 mb-1">Status</label>
    <select
      value={status}
      onChange={(e) => setStatus(e.target.value)}
      className="border rounded-md px-3 py-2 text-sm w-40"
    >
      <option value="">All</option>
      <option value="OPEN">OPEN</option>
      <option value="IN_PROGRESS">IN_PROGRESS</option>
      <option value="CLOSED">CLOSED</option>
      <option value="ARCHIVED">ARCHIVED</option>
    </select>
  </div>

  {/* Sensitivity Filter */}
  <div className="flex flex-col">
    <label className="text-xs text-gray-500 mb-1">Sensitivity</label>
    <select
      value={sensitivity}
      onChange={(e) => setSensitivity(e.target.value)}
      className="border rounded-md px-3 py-2 text-sm w-40"
    >
      <option value="">All</option>
      <option value="LOW">LOW</option>
      <option value="MEDIUM">MEDIUM</option>
      <option value="HIGH">HIGH</option>
      <option value="CRITICAL">CRITICAL</option>
    </select>
  </div>

  {/* Apply Button */}
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
    className="px-4 py-2 bg-gray-900 text-white text-sm rounded-md hover:bg-gray-800"
  >
    Apply
  </button>
</div>

      <div className="bg-white border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="text-left px-6 py-3">Title</th>
              <th className="text-left px-6 py-3">Status</th>
              <th className="text-left px-6 py-3">Owner</th>
              <th className="text-left px-6 py-3">Sensitivity</th>
            </tr>
          </thead>
          <tbody>
            {cases.map((c) => (
              <tr key={c.id} onClick={() => navigate(`/cases/${c.id}`)} className="border-t hover:bg-gray-50 transition">
                <td className="px-6 py-4 hover:underline text-gray-800">
                    {c.title}
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-md ${statusStyles[c.status]}`}
                  >
                    {c.status}
                  </span>
                </td>

                <td className="px-6 py-4 text-gray-600">
                  {c.ownerEmail}
                </td>

                <td className="px-6 py-4">
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

      {/* Pagination */}
      <div className="flex gap-2">
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
