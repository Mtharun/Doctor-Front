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
      <div className="min-h-[80vh] flex items-center justify-center p-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full bg-white/60 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-white text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#22C55E] to-[#16A34A] flex items-center justify-center"
          >
            <CheckCircle className="w-12 h-12 text-white" />
          </motion.div>

          <h2 className="text-3xl font-bold text-[#0F172A] mb-4">Request Received!</h2>
          <p className="text-[#64748B] mb-6">
            Our clinic team has been notified and will contact you as soon as possible.
          </p>

          <div className="bg-[#EF4444]/10 rounded-2xl p-4 mb-6">
            <p className="text-sm font-semibold text-[#EF4444]">
              This is not an emergency medical service. If this is life-threatening, call your local emergency number now.
            </p>
          </div>

          <Link to="/patient/dashboard" className="block w-full py-3 rounded-xl bg-gradient-to-r from-[#0EA5E9] to-[#0284C7] text-white font-semibold">
            Back to Dashboard
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8FAFC] via-[#FEF2F2] to-[#FEE2E2]">
      <header className="bg-gradient-to-r from-[#EF4444] to-[#DC2626] text-white">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <Link to="/patient/dashboard" className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-4">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>

          <div className="flex items-center gap-4">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center"
            >
              <AlertCircle className="w-8 h-8" />
            </motion.div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Emergency Request</h1>
              <p className="text-white/90">Our team will respond as soon as possible</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-2xl border border-white">
          <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-[#EF4444]/10 to-[#DC2626]/10 border-l-4 border-[#EF4444]">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-[#EF4444] flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-[#EF4444] mb-2">This form is not a substitute for emergency services</h3>
                <p className="text-sm text-[#64748B]">
                  Use this form for urgent dental issues (severe pain, broken tooth, lost filling). If you are
                  experiencing a life-threatening emergency, call your local emergency number immediately.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[#0F172A] mb-2">Your Name *</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748B]" />
                  <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#EF4444]" />
                </div>
                {fieldErrors.name && <p className="text-red-500 text-sm mt-1">{fieldErrors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0F172A] mb-2">Phone Number *</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748B]" />
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+1 (555) 123-4567" className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#EF4444]" />
                </div>
                {fieldErrors.phone && <p className="text-red-500 text-sm mt-1">{fieldErrors.phone}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0F172A] mb-2">Current Location *</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-4 w-5 h-5 text-[#64748B]" />
                <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="Your current address or location" className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#EF4444]" />
              </div>
              {fieldErrors.location && <p className="text-red-500 text-sm mt-1">{fieldErrors.location}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0F172A] mb-2">Priority Level *</label>
              <select name="priority" value={formData.priority} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#EF4444]">
                <option value="critical">🔴 Critical - Severe pain/bleeding</option>
                <option value="high">🟠 High - Urgent attention needed</option>
                <option value="medium">🟡 Medium - Can wait a few hours</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0F172A] mb-2">Problem Description *</label>
              <div className="relative">
                <FileText className="absolute left-4 top-4 w-5 h-5 text-[#64748B]" />
                <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Describe your emergency in detail (symptoms, when it started, severity, etc.)" rows={6} className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#EF4444] resize-none" />
              </div>
              {fieldErrors.description && <p className="text-red-500 text-sm mt-1">{fieldErrors.description}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0F172A] mb-2">Upload Image (Optional)</label>
              <label className="block border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-[#EF4444] transition-all cursor-pointer bg-white">
                <Upload className="w-12 h-12 mx-auto text-[#64748B] mb-4" />
                <p className="text-sm text-[#64748B] mb-2">{image ? image.name : "Click to upload or drag and drop"}</p>
                <p className="text-xs text-[#64748B]">PNG, JPG or PDF up to 10MB</p>
                <input type="file" className="hidden" accept="image/*,application/pdf" onChange={(e) => setImage(e.target.files?.[0] || null)} />
              </label>
            </div>

            {error && <div className="p-4 rounded-xl bg-[#FEF2F2] border border-[#EF4444]/20 text-sm text-[#EF4444]">{error}</div>}

            <div className="flex gap-4">
              <Link to="/patient/dashboard" className="flex-1 py-4 rounded-xl border-2 border-gray-200 text-[#64748B] font-semibold hover:bg-gray-50 transition-all text-center">
                Cancel
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 py-4 rounded-xl bg-gradient-to-r from-[#EF4444] to-[#DC2626] text-white font-semibold hover:shadow-2xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <AlertCircle className="w-5 h-5" />}
                {submitting ? "Submitting..." : "Request Emergency Help"}
              </button>
            </div>
          </form>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-[#0EA5E9]/5">
                <Phone className="w-5 h-5 text-[#0EA5E9]" />
                <div>
                  <p className="text-sm font-semibold text-[#0F172A]">Emergency Hotline</p>
                  <p className="text-sm text-[#64748B]">{CLINIC.emergencyPhone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-[#22C55E]/5">
                <AlertCircle className="w-5 h-5 text-[#22C55E]" />
                <div>
                  <p className="text-sm font-semibold text-[#0F172A]">Life-threatening emergency?</p>
                  <p className="text-sm text-[#64748B]">Call your local emergency number immediately</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
