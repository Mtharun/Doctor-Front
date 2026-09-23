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
    <div className="relative min-h-screen bg-gradient-to-br from-[#F8FAFC] via-[#EFF6FF] to-[#F0F9FF] overflow-x-hidden">
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
        <div className="absolute -top-40 -right-40 w-[32rem] h-[32rem] rounded-full bg-[#0EA5E9]/20 blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-[26rem] h-[26rem] rounded-full bg-[#22C55E]/10 blur-3xl" />
      </div>

      <header className="bg-white/70 backdrop-blur-xl border-b border-[#0EA5E9]/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/patient/dashboard" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0EA5E9] to-[#0284C7] flex items-center justify-center shadow-md shadow-[#0EA5E9]/20 transition-transform group-hover:scale-105">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-[#0F172A] leading-tight">{user?.name || "Patient"}</h1>
              <p className="text-xs text-[#64748B]">Patient Portal</p>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <NotificationBell />
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-[#64748B] hover:bg-gray-100 hover:text-[#0F172A] transition-colors text-sm font-medium"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="relative">
        <Outlet />
      </div>
    </div>
  );
}
