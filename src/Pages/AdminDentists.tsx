import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Stethoscope, Plus, X, Loader2, Pencil, EyeOff, Eye } from "lucide-react";
import { DentistsApi } from "../api/dentists.js";
import { useToast } from "../context/ToastContext.jsx";
import LoadingState from "../components/ui/LoadingState.jsx";
import ErrorState from "../components/ui/ErrorState.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const EMPTY_FORM = { name: "", specialty: "", bio: "", workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri"], startTime: "09:00", endTime: "17:00", slotMinutes: 30 };

function DentistModal({ initial, onClose, onSaved }) {
  const toast = useToast();
  const [form, setForm] = useState(initial || EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const isEdit = !!initial?.id;

  const toggleDay = (day) => {
    setForm((f) => ({
      ...f,
      workingDays: f.workingDays.includes(day) ? f.workingDays.filter((d) => d !== day) : [...f.workingDays, day],
    }));
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.specialty.trim()) {
      setError("Name and specialty are required.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      if (isEdit) await DentistsApi.update(initial.id, form);
      else await DentistsApi.create(form);
      toast.success(isEdit ? "Dentist updated." : "Dentist added.");
      onSaved();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-ink-900/45">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-ink-200 p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-ink-900">{isEdit ? "Edit Dentist" : "New Dentist"}</h3>
          <button onClick={onClose} aria-label="Close"><X className="w-5 h-5 text-ink-400" /></button>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="field-label">Name</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" placeholder="Dr. Jane Doe" />
            </div>
            <div>
              <label className="field-label">Specialty</label>
              <input value={form.specialty} onChange={(e) => setForm({ ...form, specialty: e.target.value })} className="input-field" placeholder="Orthodontics" />
            </div>
          </div>
          <div>
            <label className="field-label">Bio</label>
            <textarea value={form.bio || ""} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={2} className="input-field resize-none" />
          </div>
          <div>
            <label className="field-label">Working Days</label>
            <div className="flex flex-wrap gap-2">
              {DAYS.map((d) => (
                <button
                  type="button"
                  key={d}
                  onClick={() => toggleDay(d)}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${form.workingDays.includes(d) ? "bg-brand-600 text-white" : "bg-ink-100 text-ink-500"}`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="field-label">Start</label>
              <input type="time" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="field-label">End</label>
              <input type="time" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="field-label">Slot (min)</label>
              <input type="number" min={5} value={form.slotMinutes} onChange={(e) => setForm({ ...form, slotMinutes: e.target.value })} className="input-field" />
            </div>
          </div>
          {error && <p className="field-error">{error}</p>}
          <button type="submit" disabled={saving} className="btn btn-primary w-full">
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            {isEdit ? "Save Changes" : "Add Dentist"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AdminDentists() {
  const toast = useToast();
  const [dentists, setDentists] = useState(null);
  const [error, setError] = useState(null);
  const [modalTarget, setModalTarget] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const load = () => {
    DentistsApi.list()
      .then((res) => {
        setDentists(res.dentists);
        setError(null);
      })
      .catch((err) => setError(err.message));
  };

  useEffect(load, []);

  const toggleActive = async (d) => {
    try {
      await DentistsApi.update(d.id, { active: !d.active });
      toast.success(d.active ? "Dentist hidden from booking." : "Dentist re-activated.");
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
            <h1 className="text-2xl sm:text-3xl font-serif font-semibold text-ink-900 mb-1">Dentists</h1>
            <p className="text-ink-500">Manage dentists and their availability</p>
          </div>
          <button onClick={() => { setModalTarget(null); setShowModal(true); }} className="btn btn-primary">
            <Plus className="w-4 h-4" /> New Dentist
          </button>
        </div>

        {error && <ErrorState message={error} onRetry={load} />}
        {!error && !dentists && <LoadingState label="Loading dentists..." />}
        {dentists && dentists.length === 0 && <EmptyState icon={Stethoscope} title="No dentists yet" message="Add a dentist so patients can start booking." />}

        {dentists && dentists.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {dentists.map((d) => (
              <div key={d.id} className={`card card-hover p-6 ${!d.active ? "opacity-60" : ""}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="w-11 h-11 rounded-md bg-brand-50 flex items-center justify-center">
                    <Stethoscope className="w-5 h-5 text-brand-700" />
                  </div>
                  {!d.active && <span className="badge bg-ink-100 text-ink-600 border-ink-300">Hidden</span>}
                </div>
                <h3 className="font-semibold text-ink-900 mb-1">{d.name}</h3>
                <p className="text-sm text-brand-700 font-medium mb-2">{d.specialty}</p>
                <p className="text-xs text-ink-500 mb-4">{d.workingDays.join(", ")} &middot; {d.startTime}-{d.endTime}</p>
                <div className="flex gap-2">
                  <button onClick={() => { setModalTarget(d); setShowModal(true); }} className="btn btn-ghost btn-sm flex-1">
                    <Pencil className="w-4 h-4" /> Edit
                  </button>
                  <button onClick={() => toggleActive(d)} className="btn btn-outline btn-sm flex-1">
                    {d.active ? <><EyeOff className="w-4 h-4" /> Hide</> : <><Eye className="w-4 h-4" /> Show</>}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {showModal && (
        <DentistModal
          initial={modalTarget}
          onClose={() => setShowModal(false)}
          onSaved={() => { setShowModal(false); load(); }}
        />
      )}
    </div>
  );
}
