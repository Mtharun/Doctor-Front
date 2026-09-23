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
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-[#0F172A]/40 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-[#0F172A]">{isEdit ? "Edit Dentist" : "New Dentist"}</h3>
          <button onClick={onClose}><X className="w-5 h-5 text-[#64748B]" /></button>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#0F172A] mb-2">Name</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] transition-all" placeholder="Dr. Jane Doe" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#0F172A] mb-2">Specialty</label>
              <input value={form.specialty} onChange={(e) => setForm({ ...form, specialty: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] transition-all" placeholder="Orthodontics" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#0F172A] mb-2">Bio</label>
            <textarea value={form.bio || ""} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={2} className="w-full px-4 py-3 rounded-xl border border-gray-200 resize-none focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] transition-all" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#0F172A] mb-2">Working Days</label>
            <div className="flex flex-wrap gap-2">
              {DAYS.map((d) => (
                <button
                  type="button"
                  key={d}
                  onClick={() => toggleDay(d)}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold ${form.workingDays.includes(d) ? "bg-[#0EA5E9] text-white" : "bg-gray-100 text-gray-500"}`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#0F172A] mb-2">Start</label>
              <input type="time" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} className="w-full px-3 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#0F172A] mb-2">End</label>
              <input type="time" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} className="w-full px-3 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#0F172A] mb-2">Slot (min)</label>
              <input type="number" min={5} value={form.slotMinutes} onChange={(e) => setForm({ ...form, slotMinutes: e.target.value })} className="w-full px-3 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] transition-all" />
            </div>
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button type="submit" disabled={saving} className="w-full py-3 rounded-xl bg-[#0EA5E9] text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-50">
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
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#0F172A] mb-2">Dentists</h1>
            <p className="text-lg sm:text-xl text-[#64748B]">Manage dentists and their availability</p>
          </div>
          <button
            onClick={() => { setModalTarget(null); setShowModal(true); }}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#0EA5E9] to-[#0284C7] text-white font-semibold hover:shadow-lg transition-all"
          >
            <Plus className="w-5 h-5" /> New Dentist
          </button>
        </div>

        {error && <ErrorState message={error} onRetry={load} />}
        {!error && !dentists && <LoadingState label="Loading dentists..." />}
        {dentists && dentists.length === 0 && <EmptyState icon={Stethoscope} title="No dentists yet" message="Add a dentist so patients can start booking." />}

        {dentists && dentists.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {dentists.map((d) => (
              <div key={d.id} className={`p-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-white shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 ${!d.active ? "opacity-60" : ""}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0EA5E9] to-[#0284C7] flex items-center justify-center">
                    <Stethoscope className="w-6 h-6 text-white" />
                  </div>
                  {!d.active && <span className="px-2 py-1 rounded-full bg-gray-200 text-gray-600 text-xs font-semibold">Hidden</span>}
                </div>
                <h3 className="font-bold text-[#0F172A] mb-1">{d.name}</h3>
                <p className="text-sm text-[#0EA5E9] font-medium mb-2">{d.specialty}</p>
                <p className="text-xs text-[#64748B] mb-3">{d.workingDays.join(", ")} · {d.startTime}-{d.endTime}</p>
                <div className="flex gap-2">
                  <button onClick={() => { setModalTarget(d); setShowModal(true); }} className="flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-xl bg-[#0EA5E9]/10 text-[#0EA5E9] text-sm font-semibold hover:bg-[#0EA5E9]/20">
                    <Pencil className="w-4 h-4" /> Edit
                  </button>
                  <button onClick={() => toggleActive(d)} className="flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-xl border-2 border-gray-200 text-[#64748B] text-sm font-semibold hover:bg-gray-50">
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
