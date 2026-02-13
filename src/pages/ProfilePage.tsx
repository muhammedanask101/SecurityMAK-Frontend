import { useAuthStore } from "@/store/auth.store";
import { useState } from "react";
import { changePassword } from "@/api/user.api";

export default function ProfilePage() {
  const { user } = useAuthStore();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const passwordsMismatch =
  confirmPassword.length > 0 &&
  newPassword !== confirmPassword;

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();

    setMessage(null);
    setError(null);

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    if (newPassword.length < 8) {
        setError("Password must be at least 8 characters.");
        return;
    }

    try {
      setLoading(true);

      await changePassword({
        currentPassword,
        newPassword,
      });

      setMessage("Password updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
    setError(
        "Failed to update password."
    );
    } finally {
        setLoading(false);
        }
    }

  const clearanceStyles: Record<string, string> = {
    LOW: "bg-green-100 text-green-700",
    MEDIUM: "bg-yellow-100 text-yellow-700",
    HIGH: "bg-orange-100 text-orange-700",
    CRITICAL: "bg-red-100 text-red-700",
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">
          Profile
        </h1>
        <p className="text-slate-600 mt-2 text-sm">
          Manage your account information and security settings.
        </p>
      </div>

      {/* Account Information */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
        <h2 className="text-lg font-semibold text-slate-900">
          Account Information
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
          <InfoField label="Email" value={user?.email} />
          <InfoField label="Role" value={user?.role} />
          <InfoField
            label="Organization"
            value={user?.organizationName ?? "—"}
          />

          <div>
            <p className="text-slate-500">Clearance Level</p>
            {user?.clearanceLevel ? (
              <span
                className={`inline-block mt-1 px-2 py-1 text-xs font-medium rounded-md ${
                  clearanceStyles[user.clearanceLevel] ??
                  "bg-slate-100 text-slate-700"
                }`}
              >
                {user.clearanceLevel}
              </span>
            ) : (
              <p className="font-medium text-slate-900">—</p>
            )}
          </div>
        </div>
      </div>

      {/* Security Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6 max-w-xl">
        <h2 className="text-lg font-semibold text-slate-900">
          Security
        </h2>

        <form
          onSubmit={handlePasswordChange}
          className="space-y-4 max-w-md"
        >
          <div>
            <label className="block text-sm text-slate-600 mb-1">
              Current Password
            </label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) =>
                setCurrentPassword(e.target.value)
              }
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-600 mb-1">
              New Password
            </label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) =>
                setNewPassword(e.target.value)
              }
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
            />
          </div>
          <div>
              <label className="block text-sm text-slate-600 mb-1">
              Confirm Password
            </label>
          <input
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
                passwordsMismatch
                ? "border-red-400 focus:ring-red-400"
                : "border-slate-300 focus:ring-slate-400"
            }`}
            />
            </div>

            {passwordsMismatch && (
            <p className="text-xs text-red-600 mt-1">
                Passwords do not match.
            </p>
            )}

          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-slate-900 text-white text-sm rounded-lg hover:bg-slate-800 transition disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>

          {error && (
        <p className="text-sm text-red-600 mt-2">
            {error}
        </p>
        )}

        {message && (
        <p className="text-sm text-emerald-600 mt-2">
            {message}
        </p>
        )}
        </form>
      </div>
    </div>
  );
}

/* Reusable Info Field */
function InfoField({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
  return (
    <div>
      <p className="text-slate-500">{label}</p>
      <p className="font-medium text-slate-900 mt-1">
        {value ?? "—"}
      </p>
    </div>
  );
}
