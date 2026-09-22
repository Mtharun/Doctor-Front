import { useState } from "react";
import { motion } from "motion/react";
import { Phone, Mail, MapPin, Clock, Send, CheckCircle } from "lucide-react";
import { CLINIC } from "../config/clinic.js";

// This form is informational only (no backend endpoint for general
// contact messages) - it validates input and gives clear feedback, then
// tells the patient to use the phone/email directly, or their dashboard
// for anything appointment-related.
export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = "Name is required";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Enter a valid email";
    if (!form.message.trim() || form.message.trim().length < 10) next.message = "Message must be at least 10 characters";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSent(true);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold text-[#0F172A] mb-4">Contact Us</h1>
        <p className="text-lg text-[#64748B]">We'd love to hear from you</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-10">
        <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-6">
          <InfoRow icon={Phone} title="Phone" value={CLINIC.phone} />
          <InfoRow icon={Mail} title="Email" value={CLINIC.email} />
          <InfoRow icon={MapPin} title="Address" value={CLINIC.address} />
          <div className="p-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-white shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="w-5 h-5 text-[#0EA5E9]" />
              <h3 className="font-bold text-[#0F172A]">Working Hours</h3>
            </div>
            <ul className="space-y-2 text-sm">
              {CLINIC.hours.map((h) => (
                <li key={h.day} className="flex justify-between text-[#64748B]">
                  <span>{h.day}</span>
                  <span className="font-medium text-[#0F172A]">{h.time}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 border border-white shadow-lg"
        >
          {sent ? (
            <div className="text-center py-10">
              <CheckCircle className="w-14 h-14 text-[#22C55E] mx-auto mb-4" />
              <h3 className="text-xl font-bold text-[#0F172A] mb-2">Message received</h3>
              <p className="text-[#64748B]">
                Thanks for reaching out - for appointment changes, please use your patient dashboard so our
                team can respond fastest.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-[#0F172A] mb-2">Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0F172A] mb-2">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0F172A] mb-2">Message</label>
                <textarea
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] resize-none"
                />
                {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
              </div>
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-gradient-to-r from-[#0EA5E9] to-[#0284C7] text-white font-semibold hover:shadow-lg hover:shadow-[#0EA5E9]/30 transition-all"
              >
                <Send className="w-4 h-4" />
                Send Message
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, title, value }) {
  return (
    <div className="flex items-center gap-4 p-5 rounded-2xl bg-white/60 backdrop-blur-sm border border-white shadow-lg">
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0EA5E9] to-[#0284C7] flex items-center justify-center flex-shrink-0">
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <p className="text-sm text-[#64748B]">{title}</p>
        <p className="font-semibold text-[#0F172A]">{value}</p>
      </div>
    </div>
  );
}
