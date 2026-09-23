import { Link } from "react-router";
import { motion } from "motion/react";
import { useState } from "react";
import { AlertCircle, User, Phone, MapPin, FileText, Upload, ArrowLeft, CheckCircle, Loader2 } from "lucide-react";
import { EmergencyApi } from "../api/emergency.js";
import { useAuth } from "../context/AuthContext.jsx";
import { CLINIC } from "../config/clinic.js";

export default function EmergencyRequest() {
  const { user } = useAuth();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    location: "",
    description: "",
    priority: "high",
  });
  const [image, setImage] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = "Name is required";
    if (!formData.phone.trim()) errs.phone = "Phone is required";
    if (!formData.location.trim()) errs.location = "Location is required";
    if (!formData.description.trim() || formData.description.trim().length < 10) errs.description = "Please describe your emergency (at least 10 characters)";
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!validate()) return;

    setSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries(formData).forEach(([key, value]) => fd.append(key, value));
      if (image) fd.append("image", image);
      await EmergencyApi.create(fd);
      setSubmitted(true);
    } catch (err) {
      setError(err.message || "Unable to submit your request. Please call the clinic directly.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-6 bg-ink-50">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full card p-10 sm:p-12 text-center"
        >
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-success-50 flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-success-600" />
          </div>

          <h2 className="text-2xl font-serif font-semibold text-ink-900 mb-3">Request Received</h2>
          <p className="text-ink-500 mb-6 text-sm leading-relaxed">
            Our clinic team has been notified and will contact you as soon as possible.
          </p>

          <div className="bg-danger-50 rounded-md p-4 mb-6 text-left">
            <p className="text-sm font-medium text-danger-600">
              This is not an emergency medical service. If this is life-threatening, call your local emergency
              number now.
            </p>
          </div>

          <Link to="/patient/dashboard" className="btn btn-primary w-full">
            Back to Dashboard
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink-50">
      <header className="bg-danger-600 text-white">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <Link to="/patient/dashboard" className="inline-flex items-center gap-2 text-white/85 hover:text-white mb-4 text-sm">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>

          <div className="flex items-center gap-4">
            <div className="w-[52px] h-[52px] rounded-md bg-white/15 flex items-center justify-center shrink-0">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-serif font-semibold">Emergency Request</h1>
              <p className="text-white/85 text-sm">Our team will respond as soon as possible</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="card p-6 sm:p-8">
          <div className="mb-8 p-5 rounded-md bg-danger-50 border-l-4 border-danger-600">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-danger-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-danger-600 mb-1.5 text-sm">This form is not a substitute for emergency services</h3>
                <p className="text-sm text-ink-600">
                  Use this form for urgent dental issues (severe pain, broken tooth, lost filling). If you are
                  experiencing a life-threatening emergency, call your local emergency number immediately.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="field-label">Your Name *</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-ink-400" />
                  <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" className="input-field pl-10" />
                </div>
                {fieldErrors.name && <p className="field-error">{fieldErrors.name}</p>}
              </div>

              <div>
                <label className="field-label">Phone Number *</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-ink-400" />
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+1 (555) 123-4567" className="input-field pl-10" />
                </div>
                {fieldErrors.phone && <p className="field-error">{fieldErrors.phone}</p>}
              </div>
            </div>

            <div>
              <label className="field-label">Current Location *</label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-ink-400" />
                <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="Your current address or location" className="input-field pl-10" />
              </div>
              {fieldErrors.location && <p className="field-error">{fieldErrors.location}</p>}
            </div>

            <div>
              <label className="field-label">Priority Level *</label>
              <select name="priority" value={formData.priority} onChange={handleChange} className="input-field">
                <option value="critical">Critical &mdash; Severe pain/bleeding</option>
                <option value="high">High &mdash; Urgent attention needed</option>
                <option value="medium">Medium &mdash; Can wait a few hours</option>
              </select>
            </div>

            <div>
              <label className="field-label">Problem Description *</label>
              <div className="relative">
                <FileText className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-ink-400" />
                <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Describe your emergency in detail (symptoms, when it started, severity, etc.)" rows={6} className="input-field pl-10 resize-none" />
              </div>
              {fieldErrors.description && <p className="field-error">{fieldErrors.description}</p>}
            </div>

            <div>
              <label className="field-label">Upload Image (Optional)</label>
              <label className="block border-2 border-dashed border-ink-300 rounded-md p-8 text-center hover:border-danger-600 transition-colors cursor-pointer bg-white">
                <Upload className="w-9 h-9 mx-auto text-ink-400 mb-3" />
                <p className="text-sm text-ink-600 mb-1">{image ? image.name : "Click to upload or drag and drop"}</p>
                <p className="text-xs text-ink-400">PNG, JPG or PDF up to 10MB</p>
                <input type="file" className="hidden" accept="image/*,application/pdf" onChange={(e) => setImage(e.target.files?.[0] || null)} />
              </label>
            </div>

            {error && <div className="p-4 rounded-md bg-danger-50 border border-danger-600/15 text-sm text-danger-600">{error}</div>}

            <div className="flex gap-4">
              <Link to="/patient/dashboard" className="btn btn-outline flex-1">
                Cancel
              </Link>
              <button type="submit" disabled={submitting} className="btn btn-danger flex-1">
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <AlertCircle className="w-4 h-4" />}
                {submitting ? "Submitting..." : "Request Emergency Help"}
              </button>
            </div>
          </form>

          <div className="mt-8 pt-8 border-t border-ink-200">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 rounded-md bg-brand-50">
                <Phone className="w-5 h-5 text-brand-700 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-ink-900">Emergency Hotline</p>
                  <p className="text-sm text-ink-500">{CLINIC.emergencyPhone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-md bg-success-50">
                <AlertCircle className="w-5 h-5 text-success-600 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-ink-900">Life-threatening emergency?</p>
                  <p className="text-sm text-ink-500">Call your local emergency number immediately</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
