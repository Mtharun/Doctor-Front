import { Link } from "react-router";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Phone, Mail, Calendar, Search, Users } from "lucide-react";
import { PatientsApi } from "../api/patients.js";
import LoadingState from "../components/ui/LoadingState.jsx";
import ErrorState from "../components/ui/ErrorState.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";

export default function AdminPatients() {
  const [patients, setPatients] = useState(null);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  const load = () => {
    setError(null);
    PatientsApi.list(search)
      .then((res) => setPatients(res.patients))
      .catch((err) => setError(err.message));
  };

  useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  return (
    <div className="p-4 sm:p-8">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-serif font-semibold text-ink-900 mb-1">Patients</h1>
            <p className="text-ink-500">Manage patient records</p>
          </div>
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-ink-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search patients..."
              className="input-field pl-10 w-full sm:w-80"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="card p-5">
            <h3 className="text-2xl font-serif font-semibold text-ink-900 mb-1">{patients ? patients.length : "–"}</h3>
            <p className="text-sm text-ink-500">{search ? "Matching Results" : "Total Patients"}</p>
          </div>
        </div>

        {error && <ErrorState message={error} onRetry={load} />}
        {!error && !patients && <LoadingState label="Loading patients..." />}

        {patients && patients.length === 0 && (
          <EmptyState icon={Users} title="No patients found" message={search ? "Try a different search term." : "Patients will appear here once they sign up."} />
        )}

        {patients && patients.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {patients.map((patient) => (
              <div key={patient.id} className="card card-hover p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-ink-900 flex items-center justify-center shrink-0">
                    <span className="text-sm font-semibold text-white">{patient.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-ink-900 mb-0.5 truncate">{patient.name}</h3>
                    <p className="text-sm text-ink-500">{patient.appointmentCount} appointment{patient.appointmentCount !== 1 ? "s" : ""}</p>
                  </div>
                </div>

                <div className="space-y-2 mb-5 text-sm text-ink-500">
                  <div className="flex items-center gap-2"><Phone className="w-4 h-4 shrink-0" /> <span className="truncate">{patient.phone || "—"}</span></div>
                  <div className="flex items-center gap-2"><Mail className="w-4 h-4 shrink-0" /> <span className="truncate">{patient.email}</span></div>
                  <div className="flex items-center gap-2"><Calendar className="w-4 h-4 shrink-0" /> Joined {new Date(patient.createdAt).toLocaleDateString()}</div>
                </div>

                <Link to={`/admin/patients/${patient.id}`} className="btn btn-outline btn-sm w-full">
                  View Record
                </Link>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
