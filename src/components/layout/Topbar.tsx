import { useAuthStore } from "../../store/auth.store";

interface Props {
  onMenuClick?: () => void;
}

export default function Topbar({ onMenuClick }: Props) {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        {/* Mobile Menu Button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden text-slate-600"
        >
          ☰
        </button>

        <div className="hidden md:block text-sm text-slate-600">
          {user?.organizationName
            ? `Organization: ${user.organizationName}`
            : "No organization selected"}
        </div>
      </div>

      <div className="flex items-center gap-6">
        <span className="hidden md:block text-sm text-slate-700">
          {user?.email}
        </span>

        <button
          onClick={logout}
          className="bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-slate-800 transition"
        >
          Logout
        </button>
      </div>
    </header>
  );
}

