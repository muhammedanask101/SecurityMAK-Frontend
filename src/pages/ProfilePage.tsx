import { useAuthStore } from "@/store/auth.store";
import { useState } from "react";
import { changePassword } from "@/api/user.api";
import { disableAccount } from "@/api/user.api";
import axios from "axios";

export default function ProfilePage() {
  const { user, logout  } = useAuthStore();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [disablePassword, setDisablePassword] = useState("");
  const [disableLoading, setDisableLoading] = useState(false);
  const [disableError, setDisableError] = useState<string | null>(null);

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

    async function handleDisableAccount(e: React.FormEvent) {
    e.preventDefault();

    setDisableError(null);

    try {
      setDisableLoading(true);

      await disableAccount(disablePassword);
      logout();

  } catch (err) {
    if (axios.isAxiosError(err)) {
      if (err.response?.status === 400) {
        setDisableError("Invalid password.");
      } else {
        setDisableError("Failed to disable account.");
      }
    } else {
      setDisableError("Unexpected error occurred.");
    }
  } finally {
    setDisableLoading(false);
  }
}

  const clearanceStyles: Record<string, string> = {
    LOW: "bg-green-100 text-green-700",
    MEDIUM: "bg-yellow-100 text-yellow-700",
    HIGH: "bg-orange-100 text-orange-700",
    CRITICAL: "bg-red-100 text-red-700",
  };

 return (
  <div className="max-w-5xl mx-auto pt-3 pb-8 md:px-8 md:pt-6 lg:pb:6 sm:py-10 space-y-10">

    {/* Header */}
    <div className="space-y-2">
      <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900">
        Profile
      </h1>
      <p className="text-slate-600 text-sm">
        Manage your account information and security settings.
      </p>
    </div>

    {/* Account Information */}
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-8 space-y-8">
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
              className={`inline-block mt-2 px-3 py-1 text-xs font-medium rounded-md ${
                clearanceStyles[user.clearanceLevel] ??
                "bg-slate-100 text-slate-700"
              }`}
            >
              {user.clearanceLevel}
            </span>
          ) : (
            <p className="font-medium text-slate-900 mt-1">—</p>
          )}
        </div>
      </div>
    </div>

    {/* Security Section */}
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-8 space-y-8 max-w-2xl">
      <h2 className="text-lg font-semibold text-slate-900">
        Security
      </h2>

      <form
        onSubmit={handlePasswordChange}
        className="space-y-5"
      >
        <div>
          <label className="block text-sm text-slate-600 mb-2">
            Current Password
          </label>
          <input
            type="password"
            required
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
          />
        </div>

        <div>
          <label className="block text-sm text-slate-600 mb-2">
            New Password
          </label>
          <input
            type="password"
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
          />
        </div>

        <div>
          <label className="block text-sm text-slate-600 mb-2">
            Confirm Password
          </label>
          <input
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 ${
              passwordsMismatch
                ? "border-red-400 focus:ring-red-400"
                : "border-slate-300 focus:ring-slate-400"
            }`}
          />
          {passwordsMismatch && (
            <p className="text-xs text-red-600 mt-2">
              Passwords do not match.
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto px-6 py-3 bg-slate-900 text-white text-sm rounded-xl hover:bg-slate-800 transition disabled:opacity-50"
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

    {/* Danger Zone */}
    {user?.role !== "ADMIN" && (
      <div className="bg-white rounded-2xl border border-red-200 shadow-sm p-5 sm:p-8 space-y-6 max-w-2xl">
        <h2 className="text-lg font-semibold text-red-700">
          Danger Zone
        </h2>

        <p className="text-sm text-slate-600 leading-relaxed">
          Disabling your account will immediately revoke access.
          An administrator will need to reactivate it.
        </p>

        <form onSubmit={handleDisableAccount} className="space-y-5">
          <div>
            <label className="block text-sm text-slate-600 mb-2">
              Enter Password
            </label>
            <input
              type="password"
              required
              value={disablePassword}
              onChange={(e) => setDisablePassword(e.target.value)}
              className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
            />
          </div>

          <button
            type="submit"
            disabled={disableLoading}
            className="w-full sm:w-auto px-6 py-3 bg-red-600 text-white text-sm rounded-xl hover:bg-red-700 transition disabled:opacity-50"
          >
            {disableLoading ? "Disabling..." : "Disable Account"}
          </button>

          {disableError && (
            <p className="text-sm text-red-600 mt-2">
              {disableError}
            </p>
          )}
        </form>
      </div>
    )}
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
