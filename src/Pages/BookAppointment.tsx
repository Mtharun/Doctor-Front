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
      <div className="min-h-[80vh] flex items-center justify-center p-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full bg-white/60 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-white text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#22C55E] to-[#16A34A] flex items-center justify-center"
          >
            <CheckCircle className="w-12 h-12 text-white" />
          </motion.div>
          <h2 className="text-3xl font-bold text-[#0F172A] mb-4">Appointment Requested!</h2>
          <p className="text-[#64748B] mb-6">
            Your request has been sent to the clinic and is <strong>pending confirmation</strong>. You'll see the
            status update in My Appointments once it's reviewed.
          </p>
          <Link to="/patient/appointments" className="block w-full py-3 rounded-xl bg-gradient-to-r from-[#0EA5E9] to-[#0284C7] text-white font-semibold">
            View My Appointments
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 sm:py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Link to="/patient/dashboard" className="inline-flex items-center gap-2 text-[#0EA5E9] hover:text-[#0284C7] transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#0F172A] mb-2">Book Appointment</h1>
          <p className="text-lg sm:text-xl text-[#64748B]">Schedule your next dental visit</p>
        </div>

        {loadError && <ErrorState message={loadError} onRetry={loadOptions} />}
        {!loadError && !services && <LoadingState label="Loading services and dentists..." />}

        {services && dentists && (
          <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-xl border border-white">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-[#0F172A] mb-2">Select Service</label>
                <select
                  value={serviceId}
                  onChange={(e) => setServiceId(e.target.value)}
                  required
                  className="w-full px-4 py-4 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]"
                >
                  <option value="">Choose a service</option>
                  {services.map((s) => (
                    <option key={s.id} value={s.id}>{s.name} ({s.durationMinutes} min{s.price != null ? ` · $${s.price}` : ""})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0F172A] mb-2">Select Dentist</label>
                <select
                  value={dentistId}
                  onChange={(e) => setDentistId(e.target.value)}
                  required
                  className="w-full px-4 py-4 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]"
                >
                  <option value="">Choose a dentist</option>
                  {dentists.map((d) => (
                    <option key={d.id} value={d.id}>{d.name} - {d.specialty}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0F172A] mb-2">Select Date</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748B] pointer-events-none" />
                  <input
                    type="date"
                    min={todayISO()}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]"
                  />
                </div>
              </div>

              {dentistId && date && (
                <div>
                  <label className="block text-sm font-medium text-[#0F172A] mb-2">Select Time Slot</label>
                  {slotsLoading && <LoadingState label="Checking availability..." />}
                  {slotsError && <p className="text-red-500 text-sm">{slotsError}</p>}
                  {slots && slots.length === 0 && (
                    <p className="text-sm text-[#64748B] bg-gray-50 rounded-xl p-4">
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
                          className={`py-3 rounded-xl text-sm font-semibold transition-all ${
                            time === s.time
                              ? "bg-[#0EA5E9] text-white shadow-lg"
                              : s.available
                              ? "bg-white border border-gray-200 text-[#0F172A] hover:border-[#0EA5E9]"
                              : "bg-gray-100 text-gray-400 cursor-not-allowed line-through"
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
                <label className="block text-sm font-medium text-[#0F172A] mb-2">Reason for Visit</label>
                <div className="relative">
                  <FileText className="absolute left-4 top-4 w-5 h-5 text-[#64748B]" />
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Describe the reason for your visit..."
                    rows={4}
                    required
                    className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] resize-none"
                  />
                </div>
              </div>

              {(selectedService || selectedDentist || date || time) && (
                <div className="bg-[#0EA5E9]/5 rounded-2xl p-6">
                  <h4 className="font-semibold text-[#0F172A] mb-3 flex items-center gap-2">
                    <Stethoscope className="w-4 h-4 text-[#0EA5E9]" /> Appointment Summary
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-[#64748B]">Service:</span><span className="font-medium text-[#0F172A]">{selectedService?.name || "—"}</span></div>
                    <div className="flex justify-between"><span className="text-[#64748B]">Dentist:</span><span className="font-medium text-[#0F172A]">{selectedDentist?.name || "—"}</span></div>
                    <div className="flex justify-between"><span className="text-[#64748B]">Date:</span><span className="font-medium text-[#0F172A]">{date || "—"}</span></div>
                    <div className="flex justify-between"><span className="text-[#64748B]">Time:</span><span className="font-medium text-[#0F172A]">{time || "—"}</span></div>
                  </div>
                </div>
              )}

              {submitError && (
                <div className="p-4 rounded-xl bg-[#FEF2F2] border border-[#EF4444]/20 text-sm text-[#EF4444]">{submitError}</div>
              )}

              <div className="flex gap-4">
                <Link to="/patient/dashboard" className="flex-1 py-4 rounded-xl border-2 border-gray-200 text-[#64748B] font-semibold hover:bg-gray-50 transition-all text-center">
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="flex-1 py-4 rounded-xl bg-gradient-to-r from-[#0EA5E9] to-[#0284C7] text-white font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
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
