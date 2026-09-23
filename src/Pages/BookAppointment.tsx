import { Link } from "react-router";
import { motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { Calendar, FileText, ArrowLeft, CheckCircle, Loader2, Stethoscope } from "lucide-react";
import { ServicesApi } from "../api/services.js";
import { DentistsApi } from "../api/dentists.js";
import { AppointmentsApi } from "../api/appointments.js";
import { useToast } from "../context/ToastContext.jsx";
import LoadingState from "../components/ui/LoadingState.jsx";
import ErrorState from "../components/ui/ErrorState.jsx";

const todayISO = () => new Date().toISOString().slice(0, 10);

export default function BookAppointment() {
  const toast = useToast();

  const [services, setServices] = useState(null);
  const [dentists, setDentists] = useState(null);
  const [loadError, setLoadError] = useState(null);

  const [serviceId, setServiceId] = useState("");
  const [dentistId, setDentistId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [reason, setReason] = useState("");

  const [slots, setSlots] = useState(null);
  const [slotsError, setSlotsError] = useState(null);
  const [slotsLoading, setSlotsLoading] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const loadOptions = () => {
    Promise.all([ServicesApi.list(), DentistsApi.list()])
      .then(([s, d]) => {
        setServices(s.services);
        setDentists(d.dentists);
        setLoadError(null);
      })
      .catch((err) => setLoadError(err.message));
  };

  useEffect(loadOptions, []);

  useEffect(() => {
    // The slot list only renders once both a dentist and a date are picked
    // (see the `{dentistId && date && (...)}` block below), so there's no
    // need to reset `slots` here when either is missing.
    if (!dentistId || !date) return;
    // Legitimate "fetch started" flags for a dependency-driven refetch:
    // slotsLoading is cleared in .finally() below regardless of outcome.
    /* eslint-disable react-hooks/set-state-in-effect */
    setSlotsLoading(true);
    setTime("");
    /* eslint-enable react-hooks/set-state-in-effect */
    DentistsApi.availability(dentistId, date)
      .then((res) => {
        setSlots(res.slots);
        setSlotsError(null);
      })
      .catch((err) => setSlotsError(err.message))
      .finally(() => setSlotsLoading(false));
  }, [dentistId, date]);

  const selectedService = useMemo(() => services?.find((s) => String(s.id) === serviceId), [services, serviceId]);
  const selectedDentist = useMemo(() => dentists?.find((d) => String(d.id) === dentistId), [dentists, dentistId]);

  const canSubmit = serviceId && dentistId && date && time && reason.trim().length > 0 && !submitting;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitError("");
    setSubmitting(true);
    try {
      await AppointmentsApi.create({ serviceId: Number(serviceId), dentistId: Number(dentistId), date, time, reason });
      setSubmitted(true);
      toast.success("Appointment request submitted!");
    } catch (err) {
      setSubmitError(err.message || "Unable to book this appointment. Please try again.");
      // Slot might have just been taken - refresh availability.
      if (err.status === 409) {
        DentistsApi.availability(dentistId, date).then((res) => setSlots(res.slots)).catch(() => {});
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-6 bg-ink-50">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full card p-10 sm:p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-success-50 flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-success-600" />
          </div>
          <h2 className="text-2xl font-serif font-semibold text-ink-900 mb-3">Appointment Requested</h2>
          <p className="text-ink-500 mb-6 text-sm leading-relaxed">
            Your request has been sent to the clinic and is <strong className="text-ink-800">pending confirmation</strong>.
            You'll see the status update in My Appointments once it's reviewed.
          </p>
          <Link to="/patient/appointments" className="btn btn-primary w-full">
            View My Appointments
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container-page max-w-4xl py-8 sm:py-12">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <Link to="/patient/dashboard" className="inline-flex items-center gap-2 text-sm text-ink-500 hover:text-ink-900 transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-serif font-semibold text-ink-900 mb-1">Book Appointment</h1>
          <p className="text-ink-500">Schedule your next dental visit</p>
        </div>

        {loadError && <ErrorState message={loadError} onRetry={loadOptions} />}
        {!loadError && !services && <LoadingState label="Loading services and dentists..." />}

        {services && dentists && (
          <div className="card p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="field-label">Select Service</label>
                <select value={serviceId} onChange={(e) => setServiceId(e.target.value)} required className="input-field">
                  <option value="">Choose a service</option>
                  {services.map((s) => (
                    <option key={s.id} value={s.id}>{s.name} ({s.durationMinutes} min{s.price != null ? ` · $${s.price}` : ""})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="field-label">Select Dentist</label>
                <select value={dentistId} onChange={(e) => setDentistId(e.target.value)} required className="input-field">
                  <option value="">Choose a dentist</option>
                  {dentists.map((d) => (
                    <option key={d.id} value={d.id}>{d.name} - {d.specialty}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="field-label">Select Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-ink-400 pointer-events-none" />
                  <input
                    type="date"
                    min={todayISO()}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    className="input-field pl-10"
                  />
                </div>
              </div>

              {dentistId && date && (
                <div>
                  <label className="field-label">Select Time Slot</label>
                  {slotsLoading && <LoadingState label="Checking availability..." />}
                  {slotsError && <p className="field-error">{slotsError}</p>}
                  {slots && slots.length === 0 && (
                    <p className="text-sm text-ink-500 bg-ink-50 rounded-md p-4">
                      {selectedDentist?.name} doesn't work on this day. Please choose another date.
                    </p>
                  )}
                  {slots && slots.length > 0 && (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {slots.map((s) => (
                        <button
                          type="button"
                          key={s.time}
                          disabled={!s.available}
                          onClick={() => setTime(s.time)}
                          className={`py-2.5 rounded-md text-sm font-medium transition-colors border ${
                            time === s.time
                              ? "bg-brand-600 border-brand-600 text-white"
                              : s.available
                              ? "bg-white border-ink-200 text-ink-800 hover:border-brand-400"
                              : "bg-ink-50 border-ink-100 text-ink-300 cursor-not-allowed line-through"
                          }`}
                        >
                          {s.time}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div>
                <label className="field-label">Reason for Visit</label>
                <div className="relative">
                  <FileText className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-ink-400" />
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Describe the reason for your visit..."
                    rows={4}
                    required
                    className="input-field pl-10 resize-none"
                  />
                </div>
              </div>

              {(selectedService || selectedDentist || date || time) && (
                <div className="bg-brand-50 rounded-md p-5">
                  <h4 className="font-semibold text-ink-900 mb-3 flex items-center gap-2 text-sm">
                    <Stethoscope className="w-4 h-4 text-brand-700" /> Appointment Summary
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-ink-500">Service:</span><span className="font-medium text-ink-900">{selectedService?.name || "—"}</span></div>
                    <div className="flex justify-between"><span className="text-ink-500">Dentist:</span><span className="font-medium text-ink-900">{selectedDentist?.name || "—"}</span></div>
                    <div className="flex justify-between"><span className="text-ink-500">Date:</span><span className="font-medium text-ink-900">{date || "—"}</span></div>
                    <div className="flex justify-between"><span className="text-ink-500">Time:</span><span className="font-medium text-ink-900">{time || "—"}</span></div>
                  </div>
                </div>
              )}

              {submitError && (
                <div className="p-4 rounded-md bg-danger-50 border border-danger-600/15 text-sm text-danger-600">{submitError}</div>
              )}

              <div className="flex gap-4">
                <Link to="/patient/dashboard" className="btn btn-outline flex-1">
                  Cancel
                </Link>
                <button type="submit" disabled={!canSubmit} className="btn btn-primary flex-1">
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {submitting ? "Booking..." : "Confirm Appointment"}
                </button>
              </div>
            </form>
          </div>
        )}
      </motion.div>
    </div>
  );
}
