import { Link } from "react-router";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Calendar, Users, AlertCircle, FileText, ArrowRight } from "lucide-react";
import { AppointmentsApi } from "../api/appointments.js";
import { EmergencyApi } from "../api/emergency.js";
import { PatientsApi } from "../api/patients.js";
import LoadingState from "../components/ui/LoadingState.jsx";
import ErrorState from "../components/ui/ErrorState.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import StatusBadge from "../components/ui/StatusBadge.jsx";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [appointments, setAppointments] = useState(null);
  const [emergencies, setEmergencies] = useState(null);
  const [patients, setPatients] = useState(null);
  const [error, setError] = useState(null);

  const load = () => {
    Promise.all([
      AppointmentsApi.stats(),
      AppointmentsApi.list({ date: new Date().toISOString().slice(0, 10) }),
      EmergencyApi.list({ status: "pending" }),
      PatientsApi.list(),
    ])
      .then(([statsRes, apptRes, emergencyRes, patientsRes]) => {
        setStats(statsRes.stats);
        setAppointments(apptRes.appointments);
        setEmergencies(emergencyRes.requests);
        setPatients(patientsRes.patients);
        setError(null);
      })
      .catch((err) => setError(err.message));
  };

  useEffect(load, []);

  if (error) {
    return (
      <div className="p-8">
        <ErrorState message={error} onRetry={load} />
      </div>
    );
  }

  const statCards = stats
    ? [
        { icon: Calendar, value: stats.todayCount, label: "Today's Appointments", accent: "text-brand-600" },
        { icon: Users, value: stats.totalPatients, label: "Total Patients", accent: "text-success-600" },
        { icon: AlertCircle, value: emergencies?.length ?? "–", label: "Pending Emergencies", accent: "text-danger-600" },
        { icon: FileText, value: stats.pending, label: "Pending Appointments", accent: "text-warning-600" },
      ]
    : [];

  return (
    <div className="p-4 sm:p-8">
      {emergencies && emergencies.length > 0 && (
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <Link to="/admin/emergency" className="flex items-center justify-between gap-4 p-5 rounded-lg bg-danger-600 text-white hover:bg-[#8f1e18] transition-colors">
            <div className="flex items-center gap-4">
              <AlertCircle className="w-6 h-6 shrink-0" />
              <div>
                <h3 className="font-semibold mb-0.5">Emergency Cases</h3>
                <p className="text-white/85 text-sm">{emergencies.length} pending emergency request{emergencies.length !== 1 ? "s" : ""} need attention</p>
              </div>
            </div>
            <div className="text-right hidden sm:flex items-center gap-2">
              <span className="text-2xl font-serif font-semibold">{emergencies.length}</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>
        </motion.div>
      )}

      {!stats && <LoadingState label="Loading dashboard..." />}

      {stats && (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {statCards.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="card p-6"
              >
                <stat.icon className={`w-5 h-5 mb-3 ${stat.accent}`} />
                <h3 className="text-2xl font-serif font-semibold text-ink-900 mb-1">{stat.value}</h3>
                <p className="text-ink-500 text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-xl font-serif font-semibold text-ink-900">Today's Appointments</h3>
                <Link to="/admin/appointments" className="text-sm font-semibold text-brand-700 hover:text-brand-800">View All &rarr;</Link>
              </div>

              {appointments && appointments.length === 0 && (
                <EmptyState icon={Calendar} title="No appointments today" message="Enjoy the quiet - new bookings will show up here." />
              )}

              {appointments && appointments.length > 0 && (
                <div className="space-y-3">
                  {appointments.map((apt) => (
                    <div key={apt.id} className="card flex items-center gap-4 p-4">
                      <div className="shrink-0 w-14 h-14 rounded-md bg-brand-50 flex items-center justify-center">
                        <p className="text-sm font-semibold text-brand-700">{apt.time}</p>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-ink-900 mb-0.5 truncate text-sm">{apt.patient.name}</h4>
                        <p className="text-sm text-ink-500 truncate">{apt.service.name} &middot; {apt.dentist.name}</p>
                      </div>
                      <StatusBadge status={apt.status} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="card p-6">
                <h3 className="text-sm font-semibold text-ink-900 mb-4">Quick Stats</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-4 border-b border-ink-100">
                    <span className="text-ink-500 text-sm">Pending</span>
                    <span className="text-xl font-serif font-semibold text-ink-900">{stats.pending}</span>
                  </div>
                  <div className="flex items-center justify-between pb-4 border-b border-ink-100">
                    <span className="text-ink-500 text-sm">Confirmed</span>
                    <span className="text-xl font-serif font-semibold text-ink-900">{stats.confirmed}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-ink-500 text-sm">Completed</span>
                    <span className="text-xl font-serif font-semibold text-ink-900">{stats.completed}</span>
                  </div>
                </div>
              </div>

              <div className="card p-6">
                <h3 className="text-sm font-semibold text-ink-900 mb-4">Recent Patients</h3>
                {patients && patients.length === 0 && <p className="text-sm text-ink-500">No patients yet.</p>}
                {patients && patients.length > 0 && (
                  <div className="space-y-3">
                    {patients.slice(0, 5).map((p) => (
                      <div key={p.id} className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-ink-100 flex items-center justify-center shrink-0">
                          <span className="font-semibold text-ink-700 text-xs">{p.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-ink-900 truncate">{p.name}</p>
                          <p className="text-xs text-ink-500 truncate">{p.email}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <Link to="/admin/patients" className="flex items-center justify-center gap-1.5 mt-4 text-sm font-semibold text-brand-700 hover:text-brand-800">
                  View All Patients <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
