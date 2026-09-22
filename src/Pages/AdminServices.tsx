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
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-[#0F172A]/40 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-[#0F172A]">{isEdit ? "Edit Service" : "New Service"}</h3>
          <button onClick={onClose}><X className="w-5 h-5 text-[#64748B]" /></button>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#0F172A] mb-2">Name</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#0F172A] mb-2">Description</label>
            <textarea value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full px-4 py-3 rounded-xl border border-gray-200 resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#0F172A] mb-2">Duration (min)</label>
              <input type="number" min={5} value={form.durationMinutes} onChange={(e) => setForm({ ...form, durationMinutes: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#0F172A] mb-2">Price ($)</label>
              <input type="number" min={0} value={form.price ?? ""} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200" />
            </div>
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button type="submit" disabled={saving} className="w-full py-3 rounded-xl bg-[#0EA5E9] text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-50">
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
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#0F172A] mb-2">Services</h1>
            <p className="text-lg sm:text-xl text-[#64748B]">Manage the services patients can book</p>
          </div>
          <button
            onClick={() => { setModalTarget(null); setShowModal(true); }}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#0EA5E9] to-[#0284C7] text-white font-semibold hover:shadow-lg transition-all"
          >
            <Plus className="w-5 h-5" /> New Service
          </button>
        </div>

        {error && <ErrorState message={error} onRetry={load} />}
        {!error && !services && <LoadingState label="Loading services..." />}
        {services && services.length === 0 && <EmptyState icon={Stethoscope} title="No services yet" message="Add your first service to let patients start booking." />}

        {services && services.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s) => (
              <div key={s.id} className={`p-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-white shadow-lg ${!s.active ? "opacity-60" : ""}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0EA5E9] to-[#0284C7] flex items-center justify-center">
                    <Stethoscope className="w-6 h-6 text-white" />
                  </div>
                  {!s.active && <span className="px-2 py-1 rounded-full bg-gray-200 text-gray-600 text-xs font-semibold">Hidden</span>}
                </div>
                <h3 className="font-bold text-[#0F172A] mb-1">{s.name}</h3>
                <p className="text-sm text-[#64748B] mb-3 line-clamp-2">{s.description}</p>
                <p className="text-sm text-[#64748B] mb-4">{s.durationMinutes} min{s.price != null ? ` · $${s.price}` : ""}</p>
                <div className="flex gap-2">
                  <button onClick={() => { setModalTarget(s); setShowModal(true); }} className="flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-xl bg-[#0EA5E9]/10 text-[#0EA5E9] text-sm font-semibold hover:bg-[#0EA5E9]/20">
                    <Pencil className="w-4 h-4" /> Edit
                  </button>
                  <button onClick={() => toggleActive(s)} className="flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-xl border-2 border-gray-200 text-[#64748B] text-sm font-semibold hover:bg-gray-50">
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
