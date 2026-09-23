// Shared shell for every /patient/* page: header with the patient's name,
// notification bell and logout, plus a consistent bottom-safe wrapper.
// Fixes a real bug in the original app where only PatientDashboard had
// this header - every other patient page was missing it entirely.
import { Link, useNavigate, Outlet } from "react-router";
import { User, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import NotificationBell from "../ui/NotificationBell.jsx";

export default function PatientLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-ink-50">
      <header className="bg-white border-b border-ink-200 sticky top-0 z-50">
        <div className="container-page py-3.5 flex items-center justify-between">
          <Link to="/patient/dashboard" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-md bg-brand-600 flex items-center justify-center">
              <User className="w-4.5 h-4.5 text-white" />
            </div>
            <div>
              <h1 className="font-semibold text-ink-900 leading-tight text-sm">{user?.name || "Patient"}</h1>
              <p className="text-xs text-ink-500">Patient Portal</p>
            </div>
          </Link>

          <div className="flex items-center gap-1">
            <NotificationBell />
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3.5 py-2 rounded-md text-ink-500 hover:bg-ink-100 hover:text-ink-900 transition-colors text-sm font-medium"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <Outlet />
    </div>
  );
}
