import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { inviteApi } from "../api/invite.api";

export default function AcceptInvitePage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!token) {
      setError("Invalid invite link.");
      return;
    }

    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await inviteApi.acceptInvite({
        token,
        email,
        password,
      });

      setSuccess(true);
    } catch {
      setError(
       "Failed to register via invite."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow">
          <h1 className="text-xl font-semibold mb-2">Invalid Invite</h1>
          <p className="text-gray-500">
            This invite link is missing a token.
          </p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow text-center">
          <h1 className="text-xl font-semibold mb-2">
            Registration Submitted
          </h1>
          <p className="text-gray-500">
            Your account is awaiting admin approval.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow w-96">
        <h1 className="text-xl font-semibold mb-6">
          Complete Your Registration
        </h1>

        {error && (
          <div className="text-red-600 text-sm mb-4">
            {error}
          </div>
        )}

        <input
          type="email"
          placeholder="Email"
          className="border p-2 rounded w-full mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-2 rounded w-full mb-6"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-blue-600 text-white w-full py-2 rounded"
        >
          {loading ? "Submitting..." : "Register"}
        </button>
      </div>
    </div>
  );
}
