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
    <div>
      <section className="bg-sand-50 border-b border-ink-200">
        <div className="container-page py-16 sm:py-20 text-center">
          <span className="eyebrow mb-4 justify-center">Get In Touch</span>
          <h1 className="text-4xl sm:text-5xl font-serif font-semibold text-ink-900 mb-4">Contact Us</h1>
          <p className="text-lg text-ink-600">We&rsquo;d love to hear from you.</p>
        </div>
      </section>

      <div className="container-page py-14 sm:py-20 grid lg:grid-cols-2 gap-10">
        <motion.div initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-4">
          <InfoRow icon={Phone} title="Phone" value={CLINIC.phone} />
          <InfoRow icon={Mail} title="Email" value={CLINIC.email} />
          <InfoRow icon={MapPin} title="Address" value={CLINIC.address} />
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="w-5 h-5 text-brand-600" />
              <h3 className="font-semibold text-ink-900">Working Hours</h3>
            </div>
            <ul className="space-y-2 text-sm">
              {CLINIC.hours.map((h) => (
                <li key={h.day} className="flex justify-between text-ink-500">
                  <span>{h.day}</span>
                  <span className="font-medium text-ink-900">{h.time}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="card p-8"
        >
          {sent ? (
            <div className="text-center py-10">
              <CheckCircle className="w-12 h-12 text-success-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-ink-900 mb-2">Message received</h3>
              <p className="text-ink-500 text-sm">
                Thanks for reaching out &mdash; for appointment changes, please use your patient dashboard so our
                team can respond fastest.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              <div>
                <label className="field-label">Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="input-field"
                />
                {errors.name && <p className="field-error">{errors.name}</p>}
              </div>
              <div>
                <label className="field-label">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="input-field"
                />
                {errors.email && <p className="field-error">{errors.email}</p>}
              </div>
              <div>
                <label className="field-label">Message</label>
                <textarea
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="input-field resize-none"
                />
                {errors.message && <p className="field-error">{errors.message}</p>}
              </div>
              <button type="submit" className="btn btn-primary w-full">
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
    <div className="card p-5 flex items-center gap-4">
      <div className="w-11 h-11 rounded-md bg-brand-50 flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5 text-brand-700" />
      </div>
      <div>
        <p className="text-sm text-ink-500">{title}</p>
        <p className="font-semibold text-ink-900">{value}</p>
      </div>
    </div>
  );
}
