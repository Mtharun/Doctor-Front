import { Link } from "react-router";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Calendar, AlertCircle, FileText, User, Clock } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { AppointmentsApi } from "../api/appointments.js";
import { ReportsApi } from "../api/reports.js";
import LoadingState from "../components/ui/LoadingState.jsx";
import ErrorState from "../components/ui/ErrorState.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import StatusBadge from "../components/ui/StatusBadge.jsx";

export default function PatientDashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState(null);
  const [reports, setReports] = useState(null);
  const [error, setError] = useState(null);

  const load = () => {
    Promise.all([AppointmentsApi.list(), ReportsApi.list()])
      .then(([apptRes, reportRes]) => {
        setAppointments(apptRes.appointments);
        setReports(reportRes.reports);
        setError(null);
      })
      .catch((err) => setError(err.message));
  };

  useEffect(load, []);

  const upcoming = (appointments || [])
    .filter((a) => ["pending", "confirmed"].includes(a.status))
    .slice(0, 3);

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12">
        <ErrorState message={error} onRetry={load} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 sm:py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <h2 className="text-3xl sm:text-4xl font-bold text-[#0F172A] mb-2">Welcome back, {user?.name?.split(" ")[0]}!</h2>
        <p className="text-lg sm:text-xl text-[#64748B]">Manage your appointments and health records</p>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {quickActions.map((action, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Link
              to={action.link}
              className={`group block p-6 rounded-2xl bg-gradient-to-br ${action.gradient} hover:shadow-2xl transition-all hover:scale-105`}
            >
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-4">
                <action.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{action.title}</h3>
              <p className="text-white/90 text-sm">{action.description}</p>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-xl border border-white"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-[#0F172A]">Upcoming Appointments</h3>
              <Link to="/patient/appointments" className="text-sm text-[#0EA5E9] hover:text-[#0284C7]">View All →</Link>
            </div>

            {!appointments && <LoadingState label="Loading appointments..." />}

            {appointments && upcoming.length === 0 && (
              <EmptyState
                icon={Calendar}
                title="No upcoming appointments"
                message="Book your next visit to keep your dental health on track."
                action={
                  <Link to="/patient/book" className="px-5 py-2.5 rounded-xl bg-[#0EA5E9] text-white font-semibold">
                    Book Appointment
                  </Link>
                }
              />
            )}

            {appointments && upcoming.length > 0 && (
              <div className="space-y-4">
                {upcoming.map((apt) => (
                  <div key={apt.id} className="flex items-center gap-4 p-4 rounded-xl bg-white border border-gray-100 hover:border-[#0EA5E9]/30 transition-all">
                    <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-gradient-to-br from-[#0EA5E9]/10 to-[#0284C7]/10 flex flex-col items-center justify-center">
                      <p className="text-xl font-bold text-[#0EA5E9]">{new Date(apt.date).getDate()}</p>
                      <p className="text-xs text-[#64748B]">{new Date(apt.date).toLocaleString("en-US", { month: "short" })}</p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-[#0F172A] mb-1 truncate">{apt.service.name}</h4>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-[#64748B]">
                        <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {apt.time}</span>
                        <span>{apt.dentist.name}</span>
                      </div>
                    </div>
                    <StatusBadge status={apt.status} />
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-br from-[#0EA5E9] to-[#0284C7] rounded-3xl p-6 text-white shadow-xl"
          >
            <h3 className="text-lg font-semibold mb-4">Your Activity</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-white/20">
                <span className="text-white/80">Total Appointments</span>
                <span className="text-2xl font-bold">{appointments ? appointments.length : "–"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/80">Reports on File</span>
                <span className="text-2xl font-bold">{reports ? reports.length : "–"}</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white"
          >
            <h3 className="text-lg font-semibold text-[#0F172A] mb-4">Recent Reports</h3>
            {!reports && <LoadingState label="Loading..." />}
            {reports && reports.length === 0 && <p className="text-sm text-[#64748B]">No reports yet.</p>}
            {reports && reports.length > 0 && (
              <div className="space-y-3">
                {reports.slice(0, 3).map((r) => (
                  <div key={r.id} className="flex items-center gap-3 p-3 rounded-xl bg-white border border-gray-100">
                    <FileText className="w-5 h-5 text-[#0EA5E9]" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#0F172A] truncate">{r.title}</p>
                      <p className="text-xs text-[#64748B]">{new Date(r.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <Link to="/patient/reports" className="block mt-4 text-center text-sm text-[#0EA5E9] hover:text-[#0284C7]">
              View All Reports →
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

const quickActions = [
  { icon: Calendar, title: "Book Appointment", description: "Schedule your next dental visit", link: "/patient/book", gradient: "from-[#0EA5E9] to-[#0284C7]" },
  { icon: AlertCircle, title: "Emergency", description: "Request immediate assistance", link: "/patient/emergency", gradient: "from-[#EF4444] to-[#DC2626]" },
  { icon: FileText, title: "My Reports", description: "View dental records & reports", link: "/patient/reports", gradient: "from-[#22C55E] to-[#16A34A]" },
  { icon: User, title: "My Profile", description: "Update personal information", link: "/patient/profile", gradient: "from-[#8B5CF6] to-[#7C3AED]" },
];
