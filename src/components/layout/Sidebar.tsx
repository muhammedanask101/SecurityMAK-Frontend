import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/auth.store";

interface Props {
  onNavigate?: () => void;
}

export default function Sidebar({ onNavigate }: Props) {
  const user = useAuthStore((s) => s.user);
  const location = useLocation();

  function navClass(path: string) {
    const active = location.pathname === path;
    return `block px-3 py-2 rounded-lg text-sm transition ${
      active
        ? "bg-slate-800 text-white"
        : "text-slate-300 hover:bg-slate-800 hover:text-white"
    }`;
  }

  return (
    <aside className="w-64 h-screen bg-slate-900 text-white flex flex-col p-5">
      <div className="mb-8">
        <h2 className="text-xl font-semibold tracking-tight">
          SecureCase
        </h2>
      </div>

      <nav className="space-y-2 flex-1">
        <Link to="/" onClick={onNavigate} className={navClass("/")}>
          Dashboard
        </Link>

        <Link to="/cases" onClick={onNavigate} className={navClass("/cases")}>
          Cases
        </Link>

        <Link to="/profile" onClick={onNavigate} className={navClass("/profile")}>
          Profile
        </Link>

        {user?.role?.includes("ADMIN") && (
          <>
            <div className="border-t border-slate-700 my-4" />
            <Link
              to="/admin/users"
              onClick={onNavigate}
              className={navClass("/admin/users")}
            >
              Manage Users
            </Link>

            <Link
              to="/admin/audit-logs"
              onClick={onNavigate}
              className={navClass("/admin/audit-logs")}
            >
              Audit Logs
            </Link>
          </>
        )}
      </nav>

      <div className="text-xs text-slate-400 pt-6 border-t border-slate-700">
        © {new Date().getFullYear()} SecureCase
      </div>
    </aside>
  );
}
