import { Link, useParams } from "react-router";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, Phone, Mail, Calendar, FileText, Clock } from "lucide-react";
import { PatientsApi } from "../api/patients.js";
import LoadingState from "../components/ui/LoadingState.jsx";
import ErrorState from "../components/ui/ErrorState.jsx";
import StatusBadge from "../components/ui/StatusBadge.jsx";

export default function AdminPatientDetail() {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [error, setError] = useState(null);

  const load = () => {
    PatientsApi.get(id)
      .then((res) => {
        setPatient(res.patient);
        setError(null);
      })
      .catch((err) => setError(err.message));
  };

  useEffect(load, [id]);

  return (
    <div className="p-4 sm:p-8 max-w-5xl">
      <Link to="/admin/patients" className="inline-flex items-center gap-2 text-sm text-ink-500 hover:text-ink-900 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Patients
      </Link>

      {error && <ErrorState message={error} onRetry={load} />}
      {!error && !patient && <LoadingState label="Loading patient record..." />}

      {patient && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <div className="card p-6 sm:p-8 mb-8">
            <div className="flex flex-wrap items-start gap-6">
              <div className="w-16 h-16 rounded-full bg-brand-100 flex items-center justify-center shrink-0">
                <span className="text-lg font-semibold text-brand-700">{patient.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}</span>
              </div>
              <div className="flex-1 min-w-[200px]">
                <h1 className="text-2xl font-serif font-semibold text-ink-900 mb-1">{patient.name}</h1>
                <p className="text-ink-500 text-sm">Patient since {new Date(patient.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-ink-100">
              <InfoItem icon={Mail} label="Email" value={patient.email} />
              <InfoItem icon={Phone} label="Phone" value={patient.phone || "—"} />
              <InfoItem icon={Calendar} label="Age" value={patient.age || "—"} />
              <InfoItem icon={FileText} label="Medical History" value={patient.medicalHistory || "None reported"} />
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="card p-6">
              <h2 className="text-lg font-serif font-semibold text-ink-900 mb-4">Appointment History</h2>
              {patient.appointments.length === 0 && <p className="text-sm text-ink-500">No appointments yet.</p>}
              <div className="space-y-3">
                {patient.appointments.map((apt) => (
                  <div key={apt.id} className="p-3.5 rounded-md bg-ink-50">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-ink-900 text-sm">{apt.service.name}</p>
                      <StatusBadge status={apt.status} />
                    </div>
                    <p className="text-xs text-ink-500 flex items-center gap-1"><Clock className="w-3 h-3" /> {apt.date} at {apt.time} &middot; {apt.dentist.name}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="card p-6">
              <h2 className="text-lg font-serif font-semibold text-ink-900 mb-4">Reports</h2>
              {patient.reports.length === 0 && <p className="text-sm text-ink-500">No reports on file.</p>}
              <div className="space-y-3">
                {patient.reports.map((r) => (
                  <div key={r.id} className="p-3.5 rounded-md bg-ink-50 flex items-center gap-3">
                    <FileText className="w-4.5 h-4.5 text-brand-600 shrink-0" />
                    <div className="min-w-0">
                      <p className="font-medium text-ink-900 text-sm truncate">{r.title}</p>
                      <p className="text-xs text-ink-500">{new Date(r.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

function InfoItem({ icon: Icon, label, value }) {
  return (
    <div>
      <p className="flex items-center gap-1 text-xs text-ink-500 mb-1"><Icon className="w-3 h-3" /> {label}</p>
      <p className="font-medium text-ink-900 text-sm break-words">{value}</p>
    </div>
  );
}
