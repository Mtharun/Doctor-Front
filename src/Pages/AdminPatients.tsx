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
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#0F172A] mb-2">Patients</h1>
            <p className="text-lg sm:text-xl text-[#64748B]">Manage patient records</p>
          </div>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748B]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search patients..."
              className="pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] w-full sm:w-80"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-xl border border-white">
            <h3 className="text-2xl sm:text-3xl font-bold text-[#0F172A] mb-1">{patients ? patients.length : "–"}</h3>
            <p className="text-sm sm:text-base text-[#64748B]">{search ? "Matching Results" : "Total Patients"}</p>
          </div>
        </div>

        {error && <ErrorState message={error} onRetry={load} />}
        {!error && !patients && <LoadingState label="Loading patients..." />}

        {patients && patients.length === 0 && (
          <EmptyState icon={Users} title="No patients found" message={search ? "Try a different search term." : "Patients will appear here once they sign up."} />
        )}

        {patients && patients.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {patients.map((patient, i) => (
              <motion.div
                key={patient.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white hover:shadow-2xl transition-all"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0EA5E9]/20 to-[#0284C7]/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl font-bold text-[#0EA5E9]">{patient.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-[#0F172A] text-lg mb-1 truncate">{patient.name}</h3>
                    <p className="text-sm text-[#64748B]">{patient.appointmentCount} appointment{patient.appointmentCount !== 1 ? "s" : ""}</p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-[#64748B]"><Phone className="w-4 h-4 flex-shrink-0" /> <span className="truncate">{patient.phone || "—"}</span></div>
                  <div className="flex items-center gap-2 text-sm text-[#64748B]"><Mail className="w-4 h-4 flex-shrink-0" /> <span className="truncate">{patient.email}</span></div>
                  <div className="flex items-center gap-2 text-sm text-[#64748B]"><Calendar className="w-4 h-4 flex-shrink-0" /> Joined {new Date(patient.createdAt).toLocaleDateString()}</div>
                </div>

                <Link to={`/admin/patients/${patient.id}`} className="block text-center px-4 py-2 rounded-xl bg-[#0EA5E9]/10 text-[#0EA5E9] font-semibold hover:bg-[#0EA5E9]/20 transition-all">
                  View Record
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
