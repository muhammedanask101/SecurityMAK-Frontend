import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useCaseStore } from "@/store/case.store";
import { useAuthStore } from "@/store/auth.store";
import { statusStyles } from "@/lib/caseStyles";
import { useNavigate } from "react-router-dom";

export default function CaseListPage() {

    const navigate = useNavigate();

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
      fetchCases(0, 20);
    } else {
      fetchMyCases(0, 10);
    }
  }, [isAdmin]);

// useEffect(() => {
//   if (!user) return;

//   if (user.role === "ADMIN") {
//     fetchCases(0, 20);
//   } else {
//     fetchMyCases(0, 10);
//   }
// }, [user]);
console.log("USER:", user);
console.log("ROLE:", user?.role);
console.log("CASES:", cases);

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

      <div className="bg-white border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="text-left px-6 py-3">Title</th>
              <th className="text-left px-6 py-3">Status</th>
              <th className="text-left px-6 py-3">Owner</th>
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
                ? fetchCases(i, 20)
                : fetchMyCases(i, 10)
            }
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
