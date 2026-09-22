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
      <div className="p-6">
        <Link to="/admin/dashboard" className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0EA5E9] to-[#0284C7] flex items-center justify-center shadow-lg">
            <Stethoscope className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-[#0F172A]">DentalCare</h1>
            <p className="text-xs text-[#64748B]">Admin Panel</p>
          </div>
        </Link>

        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-[#0EA5E9] to-[#0284C7] text-white shadow-lg"
                    : "text-[#64748B] hover:bg-gray-100"
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium text-sm">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-[#0EA5E9]/10">
        <p className="text-xs text-[#64748B] mb-2 truncate">{user?.email}</p>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#64748B] hover:bg-gray-100 transition-all w-full"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium text-sm">Logout</span>
        </button>
      </div>
    </>
  );
}

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8FAFC] via-[#EFF6FF] to-[#F0F9FF]">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex flex-col fixed left-0 top-0 h-full w-64 bg-white/70 backdrop-blur-xl border-r border-[#0EA5E9]/10 z-40">
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
              className="fixed inset-0 bg-[#0F172A]/40 z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "tween", duration: 0.2 }}
              className="fixed left-0 top-0 h-full w-72 bg-white flex flex-col z-50 lg:hidden"
            >
              <SidebarContent onNavigate={() => setMobileOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="lg:ml-64 min-h-screen flex flex-col">
        <header className="bg-white/70 backdrop-blur-xl border-b border-[#0EA5E9]/10 sticky top-0 z-30">
          <div className="px-4 sm:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden p-2 rounded-xl hover:bg-gray-100"
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6 text-[#0F172A]" />
              </button>
              <div>
                <h2 className="text-lg sm:text-2xl font-bold text-[#0F172A]">Admin Panel</h2>
                <p className="text-xs sm:text-sm text-[#64748B] hidden sm:block">Welcome back, {user?.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <NotificationBell />
              <div className="hidden sm:flex items-center gap-3 pl-4 border-l border-gray-200">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0EA5E9] to-[#0284C7] flex items-center justify-center">
                  <Stethoscope className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-[#0F172A] text-sm">{user?.name}</p>
                  <p className="text-xs text-[#64748B]">Admin</p>
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
