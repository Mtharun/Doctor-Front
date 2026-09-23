import { Link } from "react-router";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { FileText, Download, Eye, ArrowLeft, Loader2, X, Trash2, Plus } from "lucide-react";
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
  "X-Ray": "bg-info-50 text-info-600 border-info-600/15",
  Lab: "bg-success-50 text-success-600 border-success-600/15",
  Report: "bg-brand-50 text-brand-700 border-brand-600/15",
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
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-ink-900/45">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-ink-200 p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-ink-900">Upload Report</h3>
          <button onClick={onClose} aria-label="Close"><X className="w-5 h-5 text-ink-400" /></button>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="field-label">Patient</label>
            {!patients ? (
              <LoadingState label="Loading patients..." />
            ) : (
              <select value={form.patientId} onChange={(e) => setForm({ ...form, patientId: e.target.value })} className="input-field">
                <option value="">Select a patient</option>
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>{p.name} ({p.email})</option>
                ))}
              </select>
            )}
          </div>
          <div>
            <label className="field-label">Title</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-field" placeholder="e.g. Dental X-Ray Report" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="field-label">Type</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="input-field">
                <option value="Report">Report</option>
                <option value="X-Ray">X-Ray</option>
                <option value="Lab">Lab</option>
              </select>
            </div>
            <div>
              <label className="field-label">Doctor</label>
              <input value={form.doctor} onChange={(e) => setForm({ ...form, doctor: e.target.value })} className="input-field" placeholder="Dr. ..." />
            </div>
          </div>
          <div>
            <label className="field-label">Notes</label>
            <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={3} className="input-field resize-none" />
          </div>
          <div>
            <label className="field-label">File (PDF/Image)</label>
            <input type="file" accept="application/pdf,image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className="w-full text-sm text-ink-600" />
          </div>

          {error && <p className="field-error">{error}</p>}

          <button type="submit" disabled={saving} className="btn btn-primary w-full">
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
    <div className={`container-page py-8 sm:py-12`}>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <Link to={isAdmin ? "/admin/dashboard" : "/patient/dashboard"} className="inline-flex items-center gap-2 text-sm text-ink-500 hover:text-ink-900 transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-serif font-semibold text-ink-900 mb-1">Medical Reports</h1>
            <p className="text-ink-500">{isAdmin ? "Manage patient reports" : "View your dental records"}</p>
          </div>
          {isAdmin && (
            <button onClick={() => setShowUpload(true)} className="btn btn-primary">
              <Plus className="w-4 h-4" /> Upload Report
            </button>
          )}
        </div>

        {error && <ErrorState message={error} onRetry={load} />}
        {!error && !reports && <LoadingState label="Loading reports..." />}

        {reports && reports.length === 0 && (
          <EmptyState icon={FileText} title="No reports available" message={isAdmin ? "Upload a report for a patient to get started." : "Your dentist hasn't uploaded any reports yet."} />
        )}

        {reports && reports.length > 0 && (
          <div className="space-y-4">
            {reports.map((report, i) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="card p-6"
              >
                <div className="flex items-start gap-5">
                  <div className="shrink-0 w-12 h-12 rounded-md bg-brand-50 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-brand-700" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-ink-900 mb-1">{report.title}</h3>
                        <p className="text-sm text-ink-500">
                          {new Date(report.date).toLocaleDateString()}{report.doctor ? ` · Dr. ${report.doctor}` : ""}
                          {isAdmin && ` · ${report.patient.name}`}
                        </p>
                      </div>
                      <span className={`badge ${TYPE_STYLES[report.type] || "bg-ink-100 text-ink-600 border-ink-300"}`}>{report.type}</span>
                    </div>

                    {report.notes && (
                      <div className="bg-ink-50 rounded-md p-3.5 mb-4">
                        <p className="text-sm text-ink-600">{report.notes}</p>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-3">
                      {report.fileUrl && (
                        <>
                          <a href={`${BASE_URL}${report.fileUrl}`} target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm">
                            <Eye className="w-4 h-4" /> View
                          </a>
                          <a href={`${BASE_URL}${report.fileUrl}`} download className="btn btn-outline btn-sm">
                            <Download className="w-4 h-4" /> Download
                          </a>
                        </>
                      )}
                      {isAdmin && (
                        <button onClick={() => setDeleteTarget(report)} className="btn btn-outline btn-sm text-danger-600 border-danger-600/25 hover:bg-danger-50">
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
