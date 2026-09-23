import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { AlertCircle, Phone, MapPin, Clock, CheckCircle, X, Loader2 } from "lucide-react";
import { EmergencyApi } from "../api/emergency.js";
import { BASE_URL } from "../api/client.js";
import { useToast } from "../context/ToastContext.jsx";
import LoadingState from "../components/ui/LoadingState.jsx";
import ErrorState from "../components/ui/ErrorState.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";

const PRIORITY_STYLES = {
  critical: "border-[#EF4444]",
  high: "border-[#F59E0B]",
  medium: "border-[#F59E0B]/50",
};
const PRIORITY_BADGE = {
  critical: "bg-[#EF4444] text-white animate-pulse",
  high: "bg-[#F59E0B] text-white",
  medium: "bg-[#F59E0B]/70 text-white",
};
const PRIORITY_LABEL = { critical: "🔴 CRITICAL", high: "🟠 HIGH", medium: "🟡 MEDIUM" };

const FILTERS = ["all", "pending", "accepted", "in_progress", "resolved", "cancelled"];

export default function AdminEmergency() {
  const toast = useToast();
  const [requests, setRequests] = useState(null);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [busyId, setBusyId] = useState(null);

  const load = () => {
    EmergencyApi.list({ status: filter })
      .then((res) => {
        setRequests(res.requests);
        setError(null);
      })
      .catch((err) => setError(err.message));
  };

  useEffect(load, [filter]);

  const setStatus = async (id, status) => {
    setBusyId(id);
    try {
      await EmergencyApi.updateStatus(id, status);
      toast.success(`Marked as ${status.replace("_", " ")}.`);
      load();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusyId(null);
    }
  };

  const pendingCount = requests?.filter((r) => r.status === "pending").length ?? 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8FAFC] via-[#FEF2F2] to-[#FEE2E2]">
      <header className="bg-gradient-to-r from-[#EF4444] to-[#DC2626] text-white">
        <div className="px-4 sm:px-8 py-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }} className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <AlertCircle className="w-7 h-7 sm:w-8 sm:h-8" />
              </motion.div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">Emergency Cases</h1>
                <p className="text-white/90 text-sm sm:text-base">Real-time emergency request monitoring</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl sm:text-5xl font-bold">{pendingCount}</div>
              <p className="text-white/90 text-sm">Pending</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex gap-2 mb-8 overflow-x-auto pb-1">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-5 py-2.5 rounded-xl font-semibold whitespace-nowrap transition-all ${
                filter === f ? "bg-white text-[#0F172A] shadow-lg" : "bg-white/60 text-[#64748B] hover:bg-white"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1).replace("_", " ")}
            </button>
          ))}
        </div>

        {error && <ErrorState message={error} onRetry={load} />}
        {!error && !requests && <LoadingState label="Loading emergency requests..." />}

        {requests && requests.length === 0 && (
          <EmptyState icon={AlertCircle} title="No emergency requests" message="Nothing matches this filter right now." />
        )}

        {requests && requests.length > 0 && (
          <div className="space-y-6">
            {requests.map((r, i) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className={`bg-white/80 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-2xl border-l-8 hover:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.15)] hover:-translate-y-1 transition-all duration-300 ${PRIORITY_STYLES[r.priority]}`}
              >
                <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                  <div className="flex items-start gap-4 flex-1 min-w-[240px]">
                    <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br ${r.priority === "critical" ? "from-[#EF4444] to-[#DC2626]" : "from-[#F59E0B] to-[#D97706]"} shadow-lg`}>
                      <AlertCircle className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-3 flex-wrap">
                        <h3 className="text-xl sm:text-2xl font-bold text-[#0F172A]">{r.name}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${PRIORITY_BADGE[r.priority]}`}>{PRIORITY_LABEL[r.priority]}</span>
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 capitalize">{r.status.replace("_", " ")}</span>
                      </div>

                      <div className="grid sm:grid-cols-3 gap-3 mb-4 text-sm">
                        <span className="flex items-center gap-2 text-[#64748B]"><Phone className="w-4 h-4" /> {r.phone}</span>
                        <span className="flex items-center gap-2 text-[#64748B]"><MapPin className="w-4 h-4" /> {r.location}</span>
                        <span className="flex items-center gap-2 text-[#64748B]"><Clock className="w-4 h-4" /> {new Date(r.createdAt).toLocaleString()}</span>
                      </div>

                      <div className="bg-gray-50 rounded-xl p-4">
                        <h4 className="font-semibold text-[#0F172A] mb-2 text-sm">Problem Description:</h4>
                        <p className="text-[#64748B] text-sm">{r.description}</p>
                      </div>
                      {r.imageUrl && (
                        <a href={`${BASE_URL}${r.imageUrl}`} target="_blank" rel="noreferrer" className="inline-block mt-3 text-sm text-[#0EA5E9] font-semibold">
                          View attached image →
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {!["resolved", "cancelled"].includes(r.status) && (
                  <div className="flex flex-wrap gap-3">
                    <a href={`tel:${r.phone}`} className="flex-1 min-w-[140px] flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#0EA5E9] to-[#0284C7] text-white font-semibold hover:shadow-lg transition-all">
                      <Phone className="w-5 h-5" /> Call Patient
                    </a>
                    {r.status === "pending" && (
                      <button onClick={() => setStatus(r.id, "accepted")} disabled={busyId === r.id} className="flex-1 min-w-[140px] flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#22C55E] to-[#16A34A] text-white font-semibold hover:shadow-lg transition-all disabled:opacity-50">
                        {busyId === r.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />} Accept Case
                      </button>
                    )}
                    {r.status === "accepted" && (
                      <button onClick={() => setStatus(r.id, "in_progress")} disabled={busyId === r.id} className="flex-1 min-w-[140px] px-6 py-3 rounded-xl bg-[#8B5CF6]/10 text-[#8B5CF6] font-semibold hover:bg-[#8B5CF6]/20 transition-all disabled:opacity-50">
                        Mark In Progress
                      </button>
                    )}
                    {["accepted", "in_progress"].includes(r.status) && (
                      <button onClick={() => setStatus(r.id, "resolved")} disabled={busyId === r.id} className="flex-1 min-w-[140px] px-6 py-3 rounded-xl bg-[#22C55E]/10 text-[#22C55E] font-semibold hover:bg-[#22C55E]/20 transition-all disabled:opacity-50">
                        Mark Resolved
                      </button>
                    )}
                    <button onClick={() => setStatus(r.id, "cancelled")} disabled={busyId === r.id} className="px-6 py-3 rounded-xl border-2 border-gray-300 text-[#64748B] font-semibold hover:bg-gray-50 transition-all disabled:opacity-50">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
