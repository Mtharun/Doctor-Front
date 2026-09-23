// Shared shell for every /admin/* page: fixed sidebar nav + top header.
// Fixes a real bug in the original app where AdminAppointments,
// AdminPatients, AdminEmergency etc. had a `pl-64` padding hack assuming
// a sidebar, but no sidebar was ever actually rendered on those pages -
// only AdminDashboard had one. Now every admin page gets it from here.
import { useState } from "react";
import { Link, NavLink, useNavigate, Outlet } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  Calendar,
  Users,
  AlertCircle,
  FileText,
  Stethoscope,
  ClipboardList,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import NotificationBell from "../ui/NotificationBell.jsx";

const NAV_ITEMS = [
  { icon: Calendar, label: "Dashboard", to: "/admin/dashboard" },
  { icon: ClipboardList, label: "Appointments", to: "/admin/appointments" },
  { icon: Users, label: "Patients", to: "/admin/patients" },
  { icon: AlertCircle, label: "Emergency Cases", to: "/admin/emergency" },
  { icon: FileText, label: "Reports", to: "/admin/reports" },
  { icon: Stethoscope, label: "Dentists", to: "/admin/dentists" },
  { icon: ClipboardList, label: "Services", to: "/admin/services" },
];

function SidebarContent({ onNavigate }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <div className="p-6 flex-1 flex flex-col min-h-0">
        <Link to="/admin/dashboard" className="flex items-center gap-2.5 mb-8">
          <span className="w-2.5 h-2.5 rounded-full bg-brand-500" aria-hidden="true" />
          <div>
            <h1 className="font-serif font-semibold text-white text-lg leading-none">DentalCare</h1>
            <p className="text-xs text-ink-400 mt-0.5">Admin Panel</p>
          </div>
        </Link>

        <nav className="space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-md transition-colors text-sm font-medium ${
                  isActive ? "bg-white/10 text-white" : "text-ink-400 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              <item.icon className="w-[18px] h-[18px]" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="p-6 border-t border-white/10">
        <p className="text-xs text-ink-400 mb-3 truncate">{user?.email}</p>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3.5 py-2.5 rounded-md text-ink-300 hover:bg-white/5 hover:text-white transition-colors w-full text-sm font-medium"
        >
          <LogOut className="w-[18px] h-[18px]" />
          <span>Logout</span>
        </button>
      </div>
    </>
  );
}

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-ink-50">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex flex-col fixed left-0 top-0 h-full w-64 bg-ink-900 z-40">
        <SidebarContent />
      </div>

      {/* Mobile sidebar drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-ink-900/50 z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "tween", duration: 0.2 }}
              className="fixed left-0 top-0 h-full w-72 bg-ink-900 flex flex-col z-50 lg:hidden"
            >
              <SidebarContent onNavigate={() => setMobileOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="lg:ml-64 min-h-screen flex flex-col">
        <header className="bg-white border-b border-ink-200 sticky top-0 z-30">
          <div className="px-4 sm:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden p-2 rounded-md hover:bg-ink-100"
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6 text-ink-900" />
              </button>
              <div>
                <h2 className="text-lg sm:text-xl font-serif font-semibold text-ink-900">Admin Panel</h2>
                <p className="text-xs sm:text-sm text-ink-500 hidden sm:block">Welcome back, {user?.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <NotificationBell />
              <div className="hidden sm:flex items-center gap-3 pl-4 border-l border-ink-200">
                <div className="w-9 h-9 rounded-md bg-ink-900 flex items-center justify-center">
                  <Stethoscope className="w-4.5 h-4.5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-ink-900 text-sm leading-tight">{user?.name}</p>
                  <p className="text-xs text-ink-500">Admin</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
