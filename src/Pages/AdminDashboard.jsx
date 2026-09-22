import { Link } from "react-router";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Calendar, Users, AlertCircle, FileText } from "lucide-react";
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
        { icon: Calendar, value: stats.todayCount, label: "Today's Appointments", gradient: "from-[#0EA5E9] to-[#0284C7]" },
        { icon: Users, value: stats.totalPatients, label: "Total Patients", gradient: "from-[#22C55E] to-[#16A34A]" },
        { icon: AlertCircle, value: emergencies?.length ?? "–", label: "Pending Emergencies", gradient: "from-[#EF4444] to-[#DC2626]" },
        { icon: FileText, value: stats.pending, label: "Pending Appointments", gradient: "from-[#F59E0B] to-[#D97706]" },
      ]
    : [];

  return (
    <div className="p-4 sm:p-8">
      {emergencies && emergencies.length > 0 && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <Link
            to="/admin/emergency"
            className="block p-6 rounded-2xl bg-gradient-to-r from-[#EF4444] to-[#DC2626] text-white shadow-2xl hover:shadow-3xl transition-all hover:scale-[1.01]"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0"
                >
                  <AlertCircle className="w-7 h-7" />
                </motion.div>
                <div>
                  <h3 className="text-xl font-bold mb-1">Emergency Cases</h3>
                  <p className="text-white/90">{emergencies.length} pending emergency request{emergencies.length !== 1 ? "s" : ""} need attention</p>
                </div>
              </div>
              <div className="text-right hidden sm:block">
                <div className="text-4xl font-bold">{emergencies.length}</div>
                <p className="text-white/90 text-sm">Active</p>
              </div>
            </div>
          </Link>
        </motion.div>
      )}

      {!stats && <LoadingState label="Loading dashboard..." />}

      {stats && (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center mb-4`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-[#0F172A] mb-1">{stat.value}</h3>
                <p className="text-[#64748B]">{stat.label}</p>
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
                  <h3 className="text-2xl font-bold text-[#0F172A]">Today's Appointments</h3>
                  <Link to="/admin/appointments" className="text-sm text-[#0EA5E9] hover:text-[#0284C7]">View All →</Link>
                </div>

                {appointments && appointments.length === 0 && (
                  <EmptyState icon={Calendar} title="No appointments today" message="Enjoy the quiet - new bookings will show up here." />
                )}

                {appointments && appointments.length > 0 && (
                  <div className="space-y-3">
                    {appointments.map((apt) => (
                      <div key={apt.id} className="flex items-center gap-4 p-4 rounded-xl bg-white border border-gray-100">
                        <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-gradient-to-br from-[#0EA5E9]/10 to-[#0284C7]/10 flex items-center justify-center">
                          <p className="text-sm font-bold text-[#0EA5E9]">{apt.time}</p>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-[#0F172A] mb-1 truncate">{apt.patient.name}</h4>
                          <p className="text-sm text-[#64748B] truncate">{apt.service.name} · Dr. {apt.dentist.name}</p>
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
                <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-4 border-b border-white/20">
                    <span className="text-white/80">Pending</span>
                    <span className="text-2xl font-bold">{stats.pending}</span>
                  </div>
                  <div className="flex items-center justify-between pb-4 border-b border-white/20">
                    <span className="text-white/80">Confirmed</span>
                    <span className="text-2xl font-bold">{stats.confirmed}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/80">Completed</span>
                    <span className="text-2xl font-bold">{stats.completed}</span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white"
              >
                <h3 className="text-lg font-semibold text-[#0F172A] mb-4">Recent Patients</h3>
                {patients && patients.length === 0 && <p className="text-sm text-[#64748B]">No patients yet.</p>}
                {patients && patients.length > 0 && (
                  <div className="space-y-3">
                    {patients.slice(0, 5).map((p) => (
                      <div key={p.id} className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0EA5E9]/20 to-[#0284C7]/20 flex items-center justify-center flex-shrink-0">
                          <span className="font-semibold text-[#0EA5E9] text-sm">{p.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-[#0F172A] truncate">{p.name}</p>
                          <p className="text-xs text-[#64748B] truncate">{p.email}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <Link to="/admin/patients" className="block mt-4 text-center text-sm text-[#0EA5E9] hover:text-[#0284C7]">
                  View All Patients →
                </Link>
              </motion.div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
