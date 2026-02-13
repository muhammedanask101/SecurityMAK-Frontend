import { useAuthStore } from "../store/auth.store";
import { useCaseStore } from "../store/case.store";
import { useEffect } from "react";

export default function Dashboard() {
  const user = useAuthStore((s) => s.user);
  const { totalElements, fetchCases, fetchMyCases } = useCaseStore();

  const isAdmin = user?.role === "ADMIN";

  useEffect(() => {
    if (!user) return;

    if (isAdmin) {
      fetchCases(0, 1); // we just need count
    } else {
      fetchMyCases(0, 1);
    }
  }, [user]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">
          Welcome back
        </h1>
        <p className="text-slate-600 mt-2">
          Signed in as {user?.email}
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-sm font-medium text-slate-500">
            Active Cases
          </h3>
          <p className="text-3xl font-semibold text-slate-900 mt-2">
            {totalElements}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-sm font-medium text-slate-500">
            Organization
          </h3>
          <p className="text-lg font-medium text-slate-900 mt-2">
            {user?.organizationName ?? "Not assigned"}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-sm font-medium text-slate-500">
            Role
          </h3>
          <p className="text-lg font-medium text-slate-900 mt-2">
            {user?.role}
          </p>
        </div>
      </div>

      {/* Informational Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-2">
          Getting Started
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          Use the sidebar to manage cases, review audit logs,
          and administer users within your organization.
        </p>
      </div>
    </div>
  );
}
