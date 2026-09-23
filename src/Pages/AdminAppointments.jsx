import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Search, ClipboardList, Loader2 } from "lucide-react";
import { AppointmentsApi } from "../api/appointments.js";
import { useToast } from "../context/ToastContext.jsx";
import LoadingState from "../components/ui/LoadingState.jsx";
import ErrorState from "../components/ui/ErrorState.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import StatusBadge from "../components/ui/StatusBadge.jsx";

const STATUS_FILTERS = ["all", "pending", "confirmed", "completed", "cancelled", "rejected"];

const NEXT_ACTIONS = {
  pending: [
    { status: "confirmed", label: "Confirm", style: "bg-[#22C55E]/10 text-[#22C55E] hover:bg-[#22C55E]/20" },
    { status: "rejected", label: "Reject", style: "bg-[#EF4444]/10 text-[#EF4444] hover:bg-[#EF4444]/20" },
  ],
  confirmed: [
    { status: "completed", label: "Mark Completed", style: "bg-[#0EA5E9]/10 text-[#0EA5E9] hover:bg-[#0EA5E9]/20" },
    { status: "cancelled", label: "Cancel", style: "bg-gray-100 text-gray-600 hover:bg-gray-200" },
  ],
};

export default function AdminAppointments() {
  const toast = useToast();
  const [appointments, setAppointments] = useState(null);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [busyId, setBusyId] = useState(null);

  const load = () => {
    setError(null);
    AppointmentsApi.list({ status, search: search || undefined })
      .then((res) => setAppointments(res.appointments))
      .catch((err) => setError(err.message));
  };

  useEffect(() => {
    const timeout = setTimeout(load, 250); // debounce search typing
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, search]);

  const updateStatus = async (id, newStatus) => {
    setBusyId(id);
    try {
      await AppointmentsApi.updateStatus(id, newStatus);
      toast.success(`Appointment marked as ${newStatus}.`);
      load();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusyId(null);
    }
  };

  const counts = {
    today: appointments?.filter((a) => a.date === new Date().toISOString().slice(0, 10)).length ?? "–",
    pending: appointments?.filter((a) => a.status === "pending").length ?? "–",
    confirmed: appointments?.filter((a) => a.status === "confirmed").length ?? "–",
    total: appointments?.length ?? "–",
  };

  return (
    <div className="p-4 sm:p-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#0F172A] mb-2">Appointments</h1>
            <p className="text-lg sm:text-xl text-[#64748B]">Manage all patient appointments</p>
          </div>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748B]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by patient name or email..."
              className="pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] w-full sm:w-80"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {[
            { value: counts.total, label: "Total" },
            { value: counts.pending, label: "Pending" },
            { value: counts.confirmed, label: "Confirmed" },
            { value: counts.today, label: "Today" },
          ].map((s) => (
            <div key={s.label} className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-xl border border-white hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
              <h3 className="text-2xl sm:text-3xl font-bold text-[#0F172A] mb-1">{s.value}</h3>
              <p className="text-sm sm:text-base text-[#64748B]">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setStatus(f)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                status === f ? "bg-[#0EA5E9] text-white shadow-lg" : "bg-white/60 text-[#64748B] hover:bg-white"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {error && <ErrorState message={error} onRetry={load} />}
        {!error && !appointments && <LoadingState label="Loading appointments..." />}

        {appointments && appointments.length === 0 && (
          <EmptyState icon={ClipboardList} title="No appointments found" message="Try a different filter or search term." />
        )}

        {appointments && appointments.length > 0 && (
          <div className="bg-white/60 backdrop-blur-sm rounded-3xl shadow-xl border border-white overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-[#0EA5E9]/5 to-[#0284C7]/5">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[#64748B]">Patient</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[#64748B]">Date &amp; Time</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[#64748B]">Service</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[#64748B]">Dentist</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[#64748B]">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[#64748B]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {appointments.map((apt, i) => (
                    <motion.tr key={apt.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="hover:bg-[#0EA5E9]/5 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-[#0F172A]">{apt.patient.name}</p>
                        <p className="text-sm text-[#64748B]">{apt.patient.phone}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-[#0F172A]">{apt.date}</p>
                        <p className="text-sm text-[#64748B]">{apt.time}</p>
                      </td>
                      <td className="px-6 py-4 text-[#0F172A]">{apt.service.name}</td>
                      <td className="px-6 py-4 text-[#64748B]">{apt.dentist.name}</td>
                      <td className="px-6 py-4"><StatusBadge status={apt.status} /></td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          {(NEXT_ACTIONS[apt.status] || []).map((action) => (
                            <button
                              key={action.status}
                              disabled={busyId === apt.id}
                              onClick={() => updateStatus(apt.id, action.status)}
                              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all disabled:opacity-50 ${action.style}`}
                            >
                              {busyId === apt.id ? <Loader2 className="w-4 h-4 animate-spin" /> : action.label}
                            </button>
                          ))}
                          {!(NEXT_ACTIONS[apt.status] || []).length && <span className="text-sm text-gray-400">—</span>}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
