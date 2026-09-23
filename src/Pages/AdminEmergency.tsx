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
  critical: "border-l-danger-600",
  high: "border-l-warning-600",
  medium: "border-l-warning-600/50",
};
const PRIORITY_BADGE = {
  critical: "bg-danger-600 text-white border-danger-600",
  high: "bg-warning-600 text-white border-warning-600",
  medium: "bg-warning-50 text-warning-600 border-warning-600/20",
};
const PRIORITY_LABEL = { critical: "CRITICAL", high: "HIGH", medium: "MEDIUM" };

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
    <div className="min-h-screen bg-ink-50">
      <header className="bg-danger-600 text-white">
        <div className="px-4 sm:px-8 py-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-md bg-white/15 flex items-center justify-center">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-serif font-semibold">Emergency Cases</h1>
                <p className="text-white/85 text-sm">Real-time emergency request monitoring</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-serif font-semibold">{pendingCount}</div>
              <p className="text-white/85 text-sm">Pending</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex gap-2 mb-8 overflow-x-auto pb-1">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors border ${
                filter === f ? "bg-brand-600 border-brand-600 text-white" : "bg-white border-ink-200 text-ink-600 hover:border-brand-400"
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
          <div className="space-y-4">
            {requests.map((r, i) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`card border-l-4 p-6 sm:p-7 ${PRIORITY_STYLES[r.priority]}`}
              >
                <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
                  <div className="flex items-start gap-4 flex-1 min-w-[240px]">
                    <div className="w-12 h-12 rounded-md flex items-center justify-center shrink-0 bg-danger-50">
                      <AlertCircle className="w-6 h-6 text-danger-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-3 flex-wrap">
                        <h3 className="text-lg font-semibold text-ink-900">{r.name}</h3>
                        <span className={`badge ${PRIORITY_BADGE[r.priority]}`}>{PRIORITY_LABEL[r.priority]}</span>
                        <span className="badge bg-ink-100 text-ink-600 border-ink-300 capitalize">{r.status.replace("_", " ")}</span>
                      </div>

                      <div className="grid sm:grid-cols-3 gap-3 mb-4 text-sm">
                        <span className="flex items-center gap-2 text-ink-500"><Phone className="w-4 h-4" /> {r.phone}</span>
                        <span className="flex items-center gap-2 text-ink-500"><MapPin className="w-4 h-4" /> {r.location}</span>
                        <span className="flex items-center gap-2 text-ink-500"><Clock className="w-4 h-4" /> {new Date(r.createdAt).toLocaleString()}</span>
                      </div>

                      <div className="bg-ink-50 rounded-md p-4">
                        <h4 className="font-semibold text-ink-900 mb-1.5 text-sm">Problem Description</h4>
                        <p className="text-ink-600 text-sm">{r.description}</p>
                      </div>
                      {r.imageUrl && (
                        <a href={`${BASE_URL}${r.imageUrl}`} target="_blank" rel="noreferrer" className="inline-block mt-3 text-sm text-brand-700 font-semibold">
                          View attached image &rarr;
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {!["resolved", "cancelled"].includes(r.status) && (
                  <div className="flex flex-wrap gap-3">
                    <a href={`tel:${r.phone}`} className="btn btn-primary flex-1 min-w-[140px]">
                      <Phone className="w-4 h-4" /> Call Patient
                    </a>
                    {r.status === "pending" && (
                      <button onClick={() => setStatus(r.id, "accepted")} disabled={busyId === r.id} className="btn flex-1 min-w-[140px] bg-success-50 text-success-600 hover:bg-success-50/70">
                        {busyId === r.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />} Accept Case
                      </button>
                    )}
                    {r.status === "accepted" && (
                      <button onClick={() => setStatus(r.id, "in_progress")} disabled={busyId === r.id} className="btn flex-1 min-w-[140px] bg-info-50 text-info-600 hover:bg-info-50/70">
                        Mark In Progress
                      </button>
                    )}
                    {["accepted", "in_progress"].includes(r.status) && (
                      <button onClick={() => setStatus(r.id, "resolved")} disabled={busyId === r.id} className="btn flex-1 min-w-[140px] bg-success-50 text-success-600 hover:bg-success-50/70">
                        Mark Resolved
                      </button>
                    )}
                    <button onClick={() => setStatus(r.id, "cancelled")} disabled={busyId === r.id} className="btn btn-outline" aria-label="Cancel case">
                      <X className="w-4 h-4" />
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
