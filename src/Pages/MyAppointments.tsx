import { Link } from "react-router";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Clock, User, ArrowLeft, Loader2, X, Plus } from "lucide-react";
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
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-ink-900/45">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-ink-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-ink-900">Reschedule Appointment</h3>
          <button onClick={onClose} aria-label="Close"><X className="w-5 h-5 text-ink-400" /></button>
        </div>
        <p className="text-sm text-ink-500 mb-4">with {appointment.dentist.name} &middot; {appointment.service.name}</p>

        <label className="field-label">New Date</label>
        <input
          type="date"
          min={todayISO()}
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="input-field mb-4"
        />

        <label className="field-label">New Time</label>
        {loadingSlots && <LoadingState label="Checking availability..." />}
        {slots && slots.length === 0 && <p className="text-sm text-ink-500 mb-4">No slots on this day.</p>}
        {slots && slots.length > 0 && (
          <div className="grid grid-cols-4 gap-2 mb-4">
            {slots.map((s) => (
              <button
                key={s.time}
                type="button"
                disabled={!s.available}
                onClick={() => setTime(s.time)}
                className={`py-2 rounded-md text-xs font-medium border ${
                  time === s.time ? "bg-brand-600 border-brand-600 text-white" : s.available ? "bg-white hover:border-brand-400 border-ink-200" : "bg-ink-50 border-ink-100 text-ink-300 line-through"
                }`}
              >
                {s.time}
              </button>
            ))}
          </div>
        )}

        {error && <p className="field-error mb-4">{error}</p>}

        <div className="flex gap-3">
          <button onClick={onClose} className="btn btn-outline flex-1">Cancel</button>
          <button onClick={submit} disabled={!date || !time || saving} className="btn btn-primary flex-1">
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
      <div className="container-page py-12">
        <ErrorState message={error} onRetry={load} />
      </div>
    );
  }

  return (
    <div className="container-page py-8 sm:py-12">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <Link to="/patient/dashboard" className="inline-flex items-center gap-2 text-sm text-ink-500 hover:text-ink-900 transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-serif font-semibold text-ink-900 mb-1">My Appointments</h1>
            <p className="text-ink-500">View and manage your appointments</p>
          </div>
          <Link to="/patient/book" className="btn btn-primary">
            <Plus className="w-4 h-4" /> Book New
          </Link>
        </div>

        {!appointments && <LoadingState label="Loading your appointments..." />}

        {appointments && appointments.length === 0 && (
          <EmptyState
            icon={CalendarIcon}
            title="No appointments yet"
            message="Book your first appointment to get started."
            action={<Link to="/patient/book" className="btn btn-primary btn-sm">Book Appointment</Link>}
          />
        )}

        {appointments && appointments.length > 0 && (
          <div className="space-y-4">
            {appointments.map((apt, i) => {
              const canCancel = ["pending", "confirmed"].includes(apt.status);
              const canReschedule = ["pending", "confirmed"].includes(apt.status);
              return (
                <motion.div
                  key={apt.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="card p-6"
                >
                  <div className="flex flex-col sm:flex-row items-start gap-5">
                    <div className="shrink-0 w-16 h-16 rounded-md bg-brand-50 flex flex-col items-center justify-center">
                      <p className="text-xl font-semibold text-brand-700 leading-none">{new Date(apt.date).getDate()}</p>
                      <p className="text-xs text-brand-600 mt-1">{new Date(apt.date).toLocaleString("en-US", { month: "short" })}</p>
                    </div>

                    <div className="flex-1 w-full">
                      <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                        <div>
                          <h3 className="text-lg font-semibold text-ink-900 mb-1.5">{apt.service.name}</h3>
                          <div className="flex flex-wrap gap-4 text-sm text-ink-500">
                            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {apt.time}</span>
                            <span className="flex items-center gap-1.5"><User className="w-4 h-4" /> {apt.dentist.name}</span>
                          </div>
                        </div>
                        <StatusBadge status={apt.status} />
                      </div>

                      {apt.reason && (
                        <div className="bg-ink-50 rounded-md p-3.5 mb-4">
                          <p className="text-sm text-ink-600">{apt.reason}</p>
                        </div>
                      )}

                      {(canCancel || canReschedule) && (
                        <div className="flex flex-wrap gap-3">
                          {canReschedule && (
                            <button onClick={() => setRescheduleTarget(apt)} className="btn btn-outline btn-sm">
                              Reschedule
                            </button>
                          )}
                          {canCancel && (
                            <button onClick={() => setCancelTarget(apt)} disabled={busyId === apt.id} className="btn btn-outline btn-sm">
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
