import { useEffect } from "react";
import { useAdminUserStore } from "@/store/adminUser.store";
import { useAuthStore } from "@/store/auth.store";

export default function ManageUsersPage() {
  const { users, fetchUsers, updateRole, updateClearance, loading, error } =
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
    <div className="p-8 max-w-6xl space-y-8">
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

      <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="text-left px-6 py-3">Email</th>
              <th className="text-left px-6 py-3">Role</th>
              <th className="text-left px-6 py-3">Clearance</th>
              <th className="text-left px-6 py-3">Organization</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => {
              const isSelf = u.email === currentUser?.email;

              return (
                <tr key={u.id} className="border-t">
                  <td className="px-6 py-4 text-slate-800">
                    {u.email}
                    {isSelf && (
                      <span className="ml-2 text-xs text-slate-400">
                        (You)
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-4">
                    <select
                      disabled={loading || isSelf}
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

                  <td className="px-6 py-4">
                    <select
                      disabled={loading}
                      value={u.clearanceLevel}
                      onChange={(e) =>
                        updateClearance(
                          u.id,
                          e.target.value
                        )
                      }
                      className={`border rounded-md px-3 py-2 text-sm ${
                        clearanceStyles[u.clearanceLevel]
                      }`}
                    >
                      <option value="LOW">LOW</option>
                      <option value="MEDIUM">MEDIUM</option>
                      <option value="HIGH">HIGH</option>
                      <option value="CRITICAL">
                        CRITICAL
                      </option>
                    </select>
                  </td>

                  <td className="px-6 py-4 text-slate-600">
                    {u.organizationName}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
