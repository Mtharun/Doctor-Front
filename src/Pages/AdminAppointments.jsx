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
    { status: "confirmed", label: "Confirm", style: "bg-success-50 text-success-600 hover:bg-success-50/70" },
    { status: "rejected", label: "Reject", style: "bg-danger-50 text-danger-600 hover:bg-danger-50/70" },
  ],
  confirmed: [
    { status: "completed", label: "Mark Completed", style: "bg-brand-50 text-brand-700 hover:bg-brand-100" },
    { status: "cancelled", label: "Cancel", style: "bg-ink-100 text-ink-600 hover:bg-ink-200" },
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
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-serif font-semibold text-ink-900 mb-1">Appointments</h1>
            <p className="text-ink-500">Manage all patient appointments</p>
          </div>
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-ink-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by patient name or email..."
              className="input-field pl-10 w-full sm:w-80"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { value: counts.total, label: "Total" },
            { value: counts.pending, label: "Pending" },
            { value: counts.confirmed, label: "Confirmed" },
            { value: counts.today, label: "Today" },
          ].map((s) => (
            <div key={s.label} className="card p-5">
              <h3 className="text-2xl font-serif font-semibold text-ink-900 mb-1">{s.value}</h3>
              <p className="text-sm text-ink-500">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setStatus(f)}
              className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors border ${
                status === f ? "bg-ink-900 border-ink-900 text-white" : "bg-white border-ink-200 text-ink-600 hover:border-ink-300"
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
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="table-clean">
                <thead>
                  <tr>
                    <th>Patient</th>
                    <th>Date &amp; Time</th>
                    <th>Service</th>
                    <th>Dentist</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((apt) => (
                    <tr key={apt.id}>
                      <td>
                        <p className="font-medium text-ink-900">{apt.patient.name}</p>
                        <p className="text-xs text-ink-500">{apt.patient.phone}</p>
                      </td>
                      <td>
                        <p className="text-ink-900">{apt.date}</p>
                        <p className="text-xs text-ink-500">{apt.time}</p>
                      </td>
                      <td>{apt.service.name}</td>
                      <td className="text-ink-500">{apt.dentist.name}</td>
                      <td><StatusBadge status={apt.status} /></td>
                      <td>
                        <div className="flex gap-2">
                          {(NEXT_ACTIONS[apt.status] || []).map((action) => (
                            <button
                              key={action.status}
                              disabled={busyId === apt.id}
                              onClick={() => updateStatus(apt.id, action.status)}
                              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors disabled:opacity-50 ${action.style}`}
                            >
                              {busyId === apt.id ? <Loader2 className="w-4 h-4 animate-spin" /> : action.label}
                            </button>
                          ))}
                          {!(NEXT_ACTIONS[apt.status] || []).length && <span className="text-sm text-ink-300">&mdash;</span>}
                        </div>
                      </td>
                    </tr>
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
