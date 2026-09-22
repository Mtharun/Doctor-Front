import { Link } from "react-router";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { FileText, Download, Eye, ArrowLeft, Loader2, X, Trash2 } from "lucide-react";
import { ReportsApi } from "../api/reports.js";
import { PatientsApi } from "../api/patients.js";
import { BASE_URL } from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import LoadingState from "../components/ui/LoadingState.jsx";
import ErrorState from "../components/ui/ErrorState.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import ConfirmDialog from "../components/ui/ConfirmDialog.jsx";

const TYPE_STYLES = {
  "X-Ray": "bg-[#0EA5E9]/10 text-[#0EA5E9]",
  Lab: "bg-[#22C55E]/10 text-[#22C55E]",
  Report: "bg-[#8B5CF6]/10 text-[#8B5CF6]",
};

function UploadReportModal({ onClose, onDone }) {
  const toast = useToast();
  const [patients, setPatients] = useState(null);
  const [form, setForm] = useState({ patientId: "", title: "", type: "Report", doctor: "", notes: "" });
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    PatientsApi.list().then((res) => setPatients(res.patients)).catch((err) => setError(err.message));
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.patientId || !form.title.trim() || !file) {
      setError("Patient, title and a file are required.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      fd.append("file", file);
      await ReportsApi.upload(fd);
      toast.success("Report uploaded.");
      onDone();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-[#0F172A]/40 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-[#0F172A]">Upload Report</h3>
          <button onClick={onClose} aria-label="Close"><X className="w-5 h-5 text-[#64748B]" /></button>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#0F172A] mb-2">Patient</label>
            {!patients ? (
              <LoadingState label="Loading patients..." />
            ) : (
              <select value={form.patientId} onChange={(e) => setForm({ ...form, patientId: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200">
                <option value="">Select a patient</option>
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>{p.name} ({p.email})</option>
                ))}
              </select>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-[#0F172A] mb-2">Title</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200" placeholder="e.g. Dental X-Ray Report" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#0F172A] mb-2">Type</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200">
                <option value="Report">Report</option>
                <option value="X-Ray">X-Ray</option>
                <option value="Lab">Lab</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#0F172A] mb-2">Doctor</label>
              <input value={form.doctor} onChange={(e) => setForm({ ...form, doctor: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200" placeholder="Dr. ..." />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#0F172A] mb-2">Notes</label>
            <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={3} className="w-full px-4 py-3 rounded-xl border border-gray-200 resize-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#0F172A] mb-2">File (PDF/Image)</label>
            <input type="file" accept="application/pdf,image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className="w-full text-sm" />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button type="submit" disabled={saving} className="w-full py-3 rounded-xl bg-[#0EA5E9] text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-50">
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            {saving ? "Uploading..." : "Upload Report"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function Reports() {
  const { user } = useAuth();
  const toast = useToast();
  const isAdmin = user?.role === "admin";

  const [reports, setReports] = useState(null);
  const [error, setError] = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = () => {
    ReportsApi.list()
      .then((res) => {
        setReports(res.reports);
        setError(null);
      })
      .catch((err) => setError(err.message));
  };

  useEffect(load, []);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await ReportsApi.remove(deleteTarget.id);
      toast.success("Report removed.");
      setDeleteTarget(null);
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className={`max-w-6xl mx-auto px-6 py-8 sm:py-12`}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Link to={isAdmin ? "/admin/dashboard" : "/patient/dashboard"} className="inline-flex items-center gap-2 text-[#0EA5E9] hover:text-[#0284C7] transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#0F172A] mb-2">Medical Reports</h1>
            <p className="text-lg sm:text-xl text-[#64748B]">{isAdmin ? "Manage patient reports" : "View your dental records"}</p>
          </div>
          {isAdmin && (
            <button onClick={() => setShowUpload(true)} className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#0EA5E9] to-[#0284C7] text-white font-semibold hover:shadow-lg transition-all">
              + Upload Report
            </button>
          )}
        </div>

        {error && <ErrorState message={error} onRetry={load} />}
        {!error && !reports && <LoadingState label="Loading reports..." />}

        {reports && reports.length === 0 && (
          <EmptyState icon={FileText} title="No reports available" message={isAdmin ? "Upload a report for a patient to get started." : "Your dentist hasn't uploaded any reports yet."} />
        )}

        {reports && reports.length > 0 && (
          <div className="space-y-6">
            {reports.map((report, i) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white"
              >
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0EA5E9] to-[#0284C7] flex items-center justify-center">
                    <FileText className="w-8 h-8 text-white" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-[#0F172A] mb-1">{report.title}</h3>
                        <p className="text-sm text-[#64748B]">
                          {new Date(report.date).toLocaleDateString()}{report.doctor ? ` · Dr. ${report.doctor}` : ""}
                          {isAdmin && ` · ${report.patient.name}`}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${TYPE_STYLES[report.type] || "bg-gray-100 text-gray-600"}`}>{report.type}</span>
                    </div>

                    {report.notes && (
                      <div className="bg-gray-50 rounded-xl p-4 mb-4">
                        <p className="text-sm text-[#64748B]">{report.notes}</p>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-3">
                      {report.fileUrl && (
                        <>
                          <a href={`${BASE_URL}${report.fileUrl}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0EA5E9]/10 text-[#0EA5E9] font-semibold hover:bg-[#0EA5E9]/20 transition-all">
                            <Eye className="w-4 h-4" /> View
                          </a>
                          <a href={`${BASE_URL}${report.fileUrl}`} download className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-gray-200 text-[#64748B] font-semibold hover:bg-gray-50 transition-all">
                            <Download className="w-4 h-4" /> Download
                          </a>
                        </>
                      )}
                      {isAdmin && (
                        <button onClick={() => setDeleteTarget(report)} className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-gray-200 text-[#EF4444] font-semibold hover:bg-red-50 transition-all">
                          <Trash2 className="w-4 h-4" /> Delete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {showUpload && (
        <UploadReportModal
          onClose={() => setShowUpload(false)}
          onDone={() => {
            setShowUpload(false);
            load();
          }}
        />
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete this report?"
        message="This will permanently remove the report and file. This cannot be undone."
        confirmLabel="Delete"
        danger
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
