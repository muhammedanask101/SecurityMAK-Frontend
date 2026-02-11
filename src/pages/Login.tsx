import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../api/auth.api";
import { useAuthStore } from "../store/auth.store";

export default function Login() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.login);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

    useEffect(() => {
    if (isAuthenticated) {
        navigate("/");
    }
    }, [isAuthenticated, navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    try {
      setLoading(true);
      const data = await login({ email, password });
      setAuth(data.user, data.accessToken);
      navigate("/");
    } catch {
      setError("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-semibold tracking-tight text-slate-900">
            SecureCase
          </h1>
          <p className="text-sm text-slate-500 mt-3">
            Secure multi-tenant case management
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-8">
          <h2 className="text-lg font-semibold text-slate-900 mb-6">
            Sign in to your account
          </h2>

          {error && (
            <div className="mb-5 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl p-3">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email
              </label>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400 transition"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>
              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400 transition"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 text-white py-3 rounded-xl font-medium hover:bg-slate-800 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Register Link */}
          <p className="text-sm text-center text-slate-600 mt-8">
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="text-slate-900 font-semibold hover:underline"
            >
              Create one
            </Link>
          </p>
        </div>

        {/* Footer Note */}
        <p className="text-xs text-slate-400 text-center mt-8">
          © {new Date().getFullYear()} SecureCase
        </p>
      </div>
    </div>
  );
}
