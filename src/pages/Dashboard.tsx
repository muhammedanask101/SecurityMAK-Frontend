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
      fetchCases(0, 1);
    } else {
      fetchMyCases(0, 1);
    }
  }, [user]);

  return (
    <div className="px-4 sm:px-6 lg:px-8 pb-6 pt-3 md:pt-6 md:pb-6 space-y-8">

      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-xl sm:text-2xl font-semibold text-slate-900">
          Welcome back
        </h1>
        <p className="text-sm sm:text-base text-slate-600 break-all">
          Signed in as {user?.email}
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">

        {/* Active Cases */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6">
          <h3 className="text-xs sm:text-sm font-medium text-slate-500">
            Active Cases
          </h3>

            <p className="text-2xl sm:text-3xl font-semibold text-slate-900 mt-2">
              {totalElements}
            </p>
          
        </div>

        {/* Organization */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6">
          <h3 className="text-xs sm:text-sm font-medium text-slate-500">
            Organization
          </h3>

          <p className="text-base sm:text-lg font-medium text-slate-900 mt-2 break-words">
            {user?.organizationName ?? "Not assigned"}
          </p>
        </div>

        {/* Role */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6">
          <h3 className="text-xs sm:text-sm font-medium text-slate-500">
            Role
          </h3>

          <p className="text-base sm:text-lg font-medium text-slate-900 mt-2">
            {user?.role}
          </p>
        </div>

      </div>

      {/* Informational Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6">
        <h2 className="text-base sm:text-lg font-semibold text-slate-900 mb-2">
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
