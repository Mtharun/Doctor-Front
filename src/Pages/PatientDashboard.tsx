import { Link } from "react-router";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Calendar, AlertCircle, FileText, User, Clock, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { AppointmentsApi } from "../api/appointments.js";
import { ReportsApi } from "../api/reports.js";
import LoadingState from "../components/ui/LoadingState.jsx";
import ErrorState from "../components/ui/ErrorState.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import StatusBadge from "../components/ui/StatusBadge.jsx";

const QUICK_ACTIONS = [
  { icon: Calendar, title: "Book Appointment", link: "/patient/book" },
  { icon: AlertCircle, title: "Emergency", link: "/patient/emergency", danger: true },
  { icon: FileText, title: "My Reports", link: "/patient/reports" },
  { icon: User, title: "My Profile", link: "/patient/profile" },
];

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
      <div className="container-page py-12">
        <ErrorState message={error} onRetry={load} />
      </div>
    );
  }

  return (
    <div className="container-page py-8 sm:py-12">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-serif font-semibold text-ink-900 mb-1">
          Welcome back, {user?.name?.split(" ")[0]}
        </h1>
        <p className="text-ink-500">Manage your appointments and health records</p>
      </motion.div>

      {/* Quick actions - a slim row, not a wall of colored tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
        {QUICK_ACTIONS.map((action) => (
          <Link
            key={action.title}
            to={action.link}
            className={`card card-hover flex flex-col items-center justify-center gap-2 py-5 text-center ${action.danger ? "hover:border-danger-600/30" : ""}`}
          >
            <action.icon className={`w-5 h-5 ${action.danger ? "text-danger-600" : "text-brand-600"}`} />
            <span className="text-sm font-medium text-ink-800">{action.title}</span>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-serif font-semibold text-ink-900">Upcoming Appointments</h2>
            <Link to="/patient/appointments" className="text-sm font-semibold text-brand-700 hover:text-brand-800">View All &rarr;</Link>
          </div>

          {!appointments && <LoadingState label="Loading appointments..." />}

          {appointments && upcoming.length === 0 && (
            <EmptyState
              icon={Calendar}
              title="No upcoming appointments"
              message="Book your next visit to keep your dental health on track."
              action={
                <Link to="/patient/book" className="btn btn-primary btn-sm">
                  Book Appointment
                </Link>
              }
            />
          )}

          {appointments && upcoming.length > 0 && (
            <div className="space-y-3">
              {upcoming.map((apt) => (
                <div key={apt.id} className="card card-hover flex items-center gap-4 p-4">
                  <div className="shrink-0 w-14 h-14 rounded-md bg-brand-50 flex flex-col items-center justify-center">
                    <p className="text-lg font-semibold text-brand-700 leading-none">{new Date(apt.date).getDate()}</p>
                    <p className="text-[11px] text-brand-600 mt-1">{new Date(apt.date).toLocaleString("en-US", { month: "short" })}</p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-ink-900 mb-1 truncate text-sm">{apt.service.name}</h4>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-ink-500">
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {apt.time}</span>
                      <span>{apt.dentist.name}</span>
                    </div>
                  </div>
                  <StatusBadge status={apt.status} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="card p-6">
            <h3 className="text-sm font-semibold text-ink-900 mb-4">Your Activity</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-ink-100">
                <span className="text-ink-500 text-sm">Total Appointments</span>
                <span className="text-xl font-serif font-semibold text-ink-900">{appointments ? appointments.length : "–"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-ink-500 text-sm">Reports on File</span>
                <span className="text-xl font-serif font-semibold text-ink-900">{reports ? reports.length : "–"}</span>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="text-sm font-semibold text-ink-900 mb-4">Recent Reports</h3>
            {!reports && <LoadingState label="Loading..." />}
            {reports && reports.length === 0 && <p className="text-sm text-ink-500">No reports yet.</p>}
            {reports && reports.length > 0 && (
              <div className="space-y-2">
                {reports.slice(0, 3).map((r) => (
                  <div key={r.id} className="flex items-center gap-3 p-3 rounded-md bg-ink-50">
                    <FileText className="w-4 h-4 text-brand-600 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-ink-900 truncate">{r.title}</p>
                      <p className="text-xs text-ink-500">{new Date(r.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <Link to="/patient/reports" className="flex items-center justify-center gap-1.5 mt-4 text-sm font-semibold text-brand-700 hover:text-brand-800">
              View All Reports <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
