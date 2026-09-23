import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Stethoscope, Plus, X, Loader2, Pencil, EyeOff, Eye } from "lucide-react";
import { ServicesApi } from "../api/services.js";
import { useToast } from "../context/ToastContext.jsx";
import LoadingState from "../components/ui/LoadingState.jsx";
import ErrorState from "../components/ui/ErrorState.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";

const EMPTY_FORM = { name: "", description: "", durationMinutes: 30, price: "" };

function ServiceModal({ initial, onClose, onSaved }) {
  const toast = useToast();
  const [form, setForm] = useState(initial || EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const isEdit = !!initial?.id;

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError("Name is required.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      if (isEdit) await ServicesApi.update(initial.id, form);
      else await ServicesApi.create(form);
      toast.success(isEdit ? "Service updated." : "Service created.");
      onSaved();
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
          <h3 className="text-lg font-semibold text-ink-900">{isEdit ? "Edit Service" : "New Service"}</h3>
          <button onClick={onClose} aria-label="Close"><X className="w-5 h-5 text-ink-400" /></button>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="field-label">Name</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" />
          </div>
          <div>
            <label className="field-label">Description</label>
            <textarea value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="input-field resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="field-label">Duration (min)</label>
              <input type="number" min={5} value={form.durationMinutes} onChange={(e) => setForm({ ...form, durationMinutes: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="field-label">Price ($)</label>
              <input type="number" min={0} value={form.price ?? ""} onChange={(e) => setForm({ ...form, price: e.target.value })} className="input-field" />
            </div>
          </div>
          {error && <p className="field-error">{error}</p>}
          <button type="submit" disabled={saving} className="btn btn-primary w-full">
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            {isEdit ? "Save Changes" : "Create Service"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AdminServices() {
  const toast = useToast();
  const [services, setServices] = useState(null);
  const [error, setError] = useState(null);
  const [modalTarget, setModalTarget] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const load = () => {
    ServicesApi.list()
      .then((res) => {
        setServices(res.services);
        setError(null);
      })
      .catch((err) => setError(err.message));
  };

  useEffect(load, []);

  const toggleActive = async (service) => {
    try {
      await ServicesApi.update(service.id, { active: !service.active });
      toast.success(service.active ? "Service hidden from booking." : "Service re-activated.");
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="p-4 sm:p-8">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-serif font-semibold text-ink-900 mb-1">Services</h1>
            <p className="text-ink-500">Manage the services patients can book</p>
          </div>
          <button onClick={() => { setModalTarget(null); setShowModal(true); }} className="btn btn-primary">
            <Plus className="w-4 h-4" /> New Service
          </button>
        </div>

        {error && <ErrorState message={error} onRetry={load} />}
        {!error && !services && <LoadingState label="Loading services..." />}
        {services && services.length === 0 && <EmptyState icon={Stethoscope} title="No services yet" message="Add your first service to let patients start booking." />}

        {services && services.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((s) => (
              <div key={s.id} className={`card card-hover p-6 ${!s.active ? "opacity-60" : ""}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="w-11 h-11 rounded-md bg-brand-50 flex items-center justify-center">
                    <Stethoscope className="w-5 h-5 text-brand-700" />
                  </div>
                  {!s.active && <span className="badge bg-ink-100 text-ink-600 border-ink-300">Hidden</span>}
                </div>
                <h3 className="font-semibold text-ink-900 mb-1">{s.name}</h3>
                <p className="text-sm text-ink-500 mb-3 line-clamp-2">{s.description}</p>
                <p className="text-sm text-ink-500 mb-4">{s.durationMinutes} min{s.price != null ? ` · $${s.price}` : ""}</p>
                <div className="flex gap-2">
                  <button onClick={() => { setModalTarget(s); setShowModal(true); }} className="btn btn-ghost btn-sm flex-1">
                    <Pencil className="w-4 h-4" /> Edit
                  </button>
                  <button onClick={() => toggleActive(s)} className="btn btn-outline btn-sm flex-1">
                    {s.active ? <><EyeOff className="w-4 h-4" /> Hide</> : <><Eye className="w-4 h-4" /> Show</>}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {showModal && (
        <ServiceModal
          initial={modalTarget}
          onClose={() => setShowModal(false)}
          onSaved={() => { setShowModal(false); load(); }}
        />
      )}
    </div>
  );
}
