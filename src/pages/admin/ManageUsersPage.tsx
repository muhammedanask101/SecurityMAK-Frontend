import { useEffect } from "react";
import { useAdminUserStore } from "@/store/adminUser.store";
import { useAuthStore } from "@/store/auth.store";

export default function ManageUsersPage() {
  const { users, fetchUsers, updateRole, updateClearance, banUser, unbanUser, loading, error } =
    useAdminUserStore();

  const currentUser = useAuthStore((s) => s.user);

  useEffect(() => {
    fetchUsers();
  }, []);

  const clearanceStyles: Record<string, string> = {
    LOW: "bg-green-100 text-green-700",
    MEDIUM: "bg-yellow-100 text-yellow-700",
    HIGH: "bg-orange-100 text-orange-700",
    CRITICAL: "bg-red-100 text-red-700",
  };

return (
  <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8">
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">
        Manage Users
      </h1>
      <p className="text-sm text-slate-600 mt-2">
        Tenant-scoped user administration
      </p>
    </div>

    {error && (
      <div className="text-sm text-red-600">{error}</div>
    )}

    {loading && (
  <>
    {/* ================= MOBILE SKELETON ================= */}
    <div className="md:hidden space-y-4 animate-pulse opacity-80">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="bg-white border rounded-2xl p-4 space-y-4 shadow-sm"
        >
          <div className="flex justify-between items-center">
            <div className="h-4 w-2/3 bg-slate-200 rounded" />
            <div className="h-5 w-16 bg-slate-200 rounded-full" />
          </div>

          <div className="space-y-3">
            <div className="h-9 w-full bg-slate-200 rounded-md" />
            <div className="h-9 w-full bg-slate-200 rounded-md" />
          </div>

          <div className="h-9 w-full bg-slate-200 rounded-lg" />
        </div>
      ))}
    </div>

    {/* ================= DESKTOP SKELETON ================= */}
    <div className="hidden md:block bg-white border rounded-2xl shadow-sm overflow-hidden animate-pulse opacity-80">
      <table className="w-full text-sm">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-6 py-3 text-left">Email</th>
            <th className="px-6 py-3 text-left">Role</th>
            <th className="px-6 py-3 text-left">Clearance</th>
            <th className="px-6 py-3 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 6 }).map((_, i) => (
            <tr key={i} className="border-t">
              <td className="px-6 py-4">
                <div className="h-4 w-48 bg-slate-200 rounded" />
              </td>
              <td className="px-6 py-4">
                <div className="h-9 w-28 bg-slate-200 rounded-md" />
              </td>
              <td className="px-6 py-4">
                <div className="h-9 w-32 bg-slate-200 rounded-md" />
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="h-5 w-16 bg-slate-200 rounded-full" />
                  <div className="h-8 w-24 bg-slate-200 rounded-md" />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </>
)}

    {/* Mobile Card View */}

    {!loading && (
  <>
    <div className="md:hidden space-y-4">
      {users.map((u) => {
        const isSelf = u.email === currentUser?.email;

        return (
          <div
            key={u.id}
            className="bg-white border rounded-2xl p-4 space-y-4 shadow-sm"
          >
            <div className="flex justify-between items-start">
              <div className="text-sm font-medium text-slate-800">
                {u.email}
                {isSelf && (
                  <span className="ml-2 text-xs text-slate-400">
                    (You)
                  </span>
                )}
              </div>

              <span
                className={`px-3 py-1 rounded-full text-xs font-medium tracking-wide ${
                  u.enabled
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                {u.enabled ? "ACTIVE" : "BANNED"}
              </span>
            </div>

            <div className="space-y-3">
              <select
                disabled={loading || isSelf || u.role === "ADMIN"}
                value={u.role}
                onChange={(e) => updateRole(u.id, e.target.value)}
                className="w-full border rounded-md px-3 py-2 text-sm"
              >
                <option value="USER">USER</option>
                <option value="ADMIN">ADMIN</option>
              </select>

              <select
                disabled={loading || isSelf || u.role === "ADMIN"}
                value={u.clearanceLevel}
                onChange={(e) =>
                  updateClearance(u.id, e.target.value)
                }
                className={`w-full border rounded-md px-3 py-2 text-sm ${
                  clearanceStyles[u.clearanceLevel]
                }`}
              >
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
                <option value="CRITICAL">CRITICAL</option>
              </select>
            </div>

            {!isSelf && u.role !== "ADMIN" && (
              u.enabled ? (
                <button
                  onClick={() => banUser(u.id)}
                  disabled={loading}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 transition disabled:opacity-50"
                >
                  Ban User
                </button>
              ) : (
                <button
                  onClick={() => unbanUser(u.id)}
                  disabled={loading}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 transition disabled:opacity-50"
                >
                  Restore Access
                </button>
              )
            )}
          </div>
        );
      })}
    </div>

    {/* Desktop Table */}
    <div className="hidden md:block bg-white border rounded-2xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="text-left px-4 md:px-6 py-3">Email</th>
              <th className="text-left px-4 md:px-6 py-3">Role</th>
              <th className="text-left px-4 md:px-6 py-3">Clearance</th>
              <th className="text-left px-4 md:px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => {
              const isSelf = u.email === currentUser?.email;

              return (
                <tr key={u.id} className="border-t">
                  <td className="px-4 md:px-6 py-3 md:py-4 text-slate-800">
                    {u.email}
                    {isSelf && (
                      <span className="ml-2 text-xs text-slate-400">
                        (You)
                      </span>
                    )}
                  </td>

                  <td className="px-4 md:px-6 py-3 md:py-4">
                    <select
                      disabled={loading || isSelf || u.role === "ADMIN"}
                      value={u.role}
                      onChange={(e) =>
                        updateRole(u.id, e.target.value)
                      }
                      className="border rounded-md px-3 py-2 text-sm"
                    >
                      <option value="USER">USER</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </td>

                  <td className="px-4 md:px-6 py-3 md:py-4">
                    <select
                      disabled={loading || isSelf || u.role === "ADMIN"}
                      value={u.clearanceLevel}
                      onChange={(e) =>
                        updateClearance(u.id, e.target.value)
                      }
                      className={`border rounded-md px-3 py-2 text-sm ${
                        clearanceStyles[u.clearanceLevel]
                      }`}
                    >
                      <option value="LOW">LOW</option>
                      <option value="MEDIUM">MEDIUM</option>
                      <option value="HIGH">HIGH</option>
                      <option value="CRITICAL">CRITICAL</option>
                    </select>
                  </td>

                  <td className="px-4 md:px-6 py-3 md:py-4">
                    <div className="flex items-center justify-between gap-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium tracking-wide ${
                          u.enabled
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-red-50 text-red-700 border border-red-200"
                        }`}
                      >
                        {u.enabled ? "ACTIVE" : "BANNED"}
                      </span>

                      {!isSelf && u.role !== "ADMIN" && (
                        u.enabled ? (
                          <button
                            onClick={() => banUser(u.id)}
                            disabled={loading}
                            className="px-3 py-1.5 text-xs rounded-lg border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 transition disabled:opacity-50"
                          >
                            Ban User
                          </button>
                        ) : (
                          <button
                            onClick={() => unbanUser(u.id)}
                            disabled={loading}
                            className="px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 transition disabled:opacity-50"
                          >
                            Restore Access
                          </button>
                        )
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
    </>
)}
  </div>
);

}
