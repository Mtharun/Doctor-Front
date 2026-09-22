import { Link } from "react-router";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Clock, User, ArrowLeft, Loader2, X } from "lucide-react";
import { AppointmentsApi } from "../api/appointments.js";
import { DentistsApi } from "../api/dentists.js";
import { useToast } from "../context/ToastContext.jsx";
import LoadingState from "../components/ui/LoadingState.jsx";
import ErrorState from "../components/ui/ErrorState.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import StatusBadge from "../components/ui/StatusBadge.jsx";
import ConfirmDialog from "../components/ui/ConfirmDialog.jsx";
import { Calendar as CalendarIcon } from "lucide-react";

const todayISO = () => new Date().toISOString().slice(0, 10);

function RescheduleModal({ appointment, onClose, onDone }) {
  const toast = useToast();
  const [date, setDate] = useState(appointment.date);
  const [time, setTime] = useState("");
  const [slots, setSlots] = useState(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!date) return;
    // Legitimate "fetch started" flags for a dependency-driven refetch:
    // loadingSlots is cleared in .finally() below regardless of outcome.
    /* eslint-disable react-hooks/set-state-in-effect */
    setLoadingSlots(true);
    setTime("");
    /* eslint-enable react-hooks/set-state-in-effect */
    DentistsApi.availability(appointment.dentistId, date)
      .then((res) => setSlots(res.slots))
      .catch((err) => setError(err.message))
      .finally(() => setLoadingSlots(false));
  }, [date, appointment.dentistId]);

  const submit = async () => {
    if (!date || !time) return;
    setSaving(true);
    setError("");
    try {
      await AppointmentsApi.reschedule(appointment.id, { date, time });
      toast.success("Appointment rescheduled.");
      onDone();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-[#0F172A]/40 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-[#0F172A]">Reschedule Appointment</h3>
          <button onClick={onClose} aria-label="Close"><X className="w-5 h-5 text-[#64748B]" /></button>
        </div>
        <p className="text-sm text-[#64748B] mb-4">with Dr. {appointment.dentist.name} · {appointment.service.name}</p>

        <label className="block text-sm font-medium text-[#0F172A] mb-2">New Date</label>
        <input
          type="date"
          min={todayISO()}
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 mb-4 focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]"
        />

        <label className="block text-sm font-medium text-[#0F172A] mb-2">New Time</label>
        {loadingSlots && <LoadingState label="Checking availability..." />}
        {slots && slots.length === 0 && <p className="text-sm text-[#64748B] mb-4">No slots on this day.</p>}
        {slots && slots.length > 0 && (
          <div className="grid grid-cols-4 gap-2 mb-4">
            {slots.map((s) => (
              <button
                key={s.time}
                type="button"
                disabled={!s.available}
                onClick={() => setTime(s.time)}
                className={`py-2 rounded-lg text-xs font-semibold ${
                  time === s.time ? "bg-[#0EA5E9] text-white" : s.available ? "bg-gray-50 hover:border-[#0EA5E9] border border-gray-200" : "bg-gray-100 text-gray-400 line-through"
                }`}
              >
                {s.time}
              </button>
            ))}
          </div>
        )}

        {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border-2 border-gray-200 text-[#64748B] font-semibold">Cancel</button>
          <button
            onClick={submit}
            disabled={!date || !time || saving}
            className="flex-1 py-2.5 rounded-xl bg-[#0EA5E9] text-white font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MyAppointments() {
  const toast = useToast();
  const [appointments, setAppointments] = useState(null);
  const [error, setError] = useState(null);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [rescheduleTarget, setRescheduleTarget] = useState(null);
  const [busyId, setBusyId] = useState(null);

  const load = () => {
    AppointmentsApi.list()
      .then((res) => {
        setAppointments(res.appointments);
        setError(null);
      })
      .catch((err) => setError(err.message));
  };

  useEffect(load, []);

  const confirmCancel = async () => {
    if (!cancelTarget) return;
    setBusyId(cancelTarget.id);
    try {
      await AppointmentsApi.updateStatus(cancelTarget.id, "cancelled");
      toast.success("Appointment cancelled.");
      setCancelTarget(null);
      load();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusyId(null);
    }
  };

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-12">
        <ErrorState message={error} onRetry={load} />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 sm:py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Link to="/patient/dashboard" className="inline-flex items-center gap-2 text-[#0EA5E9] hover:text-[#0284C7] transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#0F172A] mb-2">My Appointments</h1>
            <p className="text-lg sm:text-xl text-[#64748B]">View and manage your appointments</p>
          </div>
          <Link to="/patient/book" className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#0EA5E9] to-[#0284C7] text-white font-semibold hover:shadow-lg transition-all text-center">
            + Book New
          </Link>
        </div>

        {!appointments && <LoadingState label="Loading your appointments..." />}

        {appointments && appointments.length === 0 && (
          <EmptyState
            icon={CalendarIcon}
            title="No appointments yet"
            message="Book your first appointment to get started."
            action={<Link to="/patient/book" className="px-5 py-2.5 rounded-xl bg-[#0EA5E9] text-white font-semibold">Book Appointment</Link>}
          />
        )}

        {appointments && appointments.length > 0 && (
          <div className="space-y-6">
            {appointments.map((apt, i) => {
              const canCancel = ["pending", "confirmed"].includes(apt.status);
              const canReschedule = ["pending", "confirmed"].includes(apt.status);
              return (
                <motion.div
                  key={apt.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white"
                >
                  <div className="flex flex-col sm:flex-row items-start gap-6">
                    <div className="flex-shrink-0 w-20 h-20 rounded-2xl bg-gradient-to-br from-[#0EA5E9]/10 to-[#0284C7]/10 flex flex-col items-center justify-center">
                      <p className="text-2xl sm:text-3xl font-bold text-[#0EA5E9]">{new Date(apt.date).getDate()}</p>
                      <p className="text-xs sm:text-sm text-[#64748B]">{new Date(apt.date).toLocaleString("en-US", { month: "short" })}</p>
                    </div>

                    <div className="flex-1 w-full">
                      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-[#0F172A] mb-2">{apt.service.name}</h3>
                          <div className="flex flex-wrap gap-4 text-sm text-[#64748B]">
                            <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {apt.time}</span>
                            <span className="flex items-center gap-1"><User className="w-4 h-4" /> Dr. {apt.dentist.name}</span>
                          </div>
                        </div>
                        <StatusBadge status={apt.status} />
                      </div>

                      {apt.reason && (
                        <div className="bg-gray-50 rounded-xl p-4 mb-4">
                          <p className="text-sm text-[#64748B]">{apt.reason}</p>
                        </div>
                      )}

                      {(canCancel || canReschedule) && (
                        <div className="flex flex-wrap gap-3">
                          {canReschedule && (
                            <button
                              onClick={() => setRescheduleTarget(apt)}
                              className="px-6 py-2 rounded-xl border-2 border-[#0EA5E9] text-[#0EA5E9] font-semibold hover:bg-[#0EA5E9]/5 transition-all"
                            >
                              Reschedule
                            </button>
                          )}
                          {canCancel && (
                            <button
                              onClick={() => setCancelTarget(apt)}
                              disabled={busyId === apt.id}
                              className="px-6 py-2 rounded-xl border-2 border-gray-200 text-[#64748B] font-semibold hover:bg-gray-50 transition-all disabled:opacity-50"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>

      <ConfirmDialog
        open={!!cancelTarget}
        title="Cancel this appointment?"
        message="This will cancel your appointment. You can always book a new one later."
        confirmLabel="Yes, Cancel"
        danger
        onConfirm={confirmCancel}
        onCancel={() => setCancelTarget(null)}
      />

      {rescheduleTarget && (
        <RescheduleModal
          appointment={rescheduleTarget}
          onClose={() => setRescheduleTarget(null)}
          onDone={() => {
            setRescheduleTarget(null);
            load();
          }}
        />
      )}
    </div>
  );
}
