import { useState } from "react";
import { motion } from "motion/react";
import { ChevronDown } from "lucide-react";

const FAQS = [
  { q: "How do I book an appointment?", a: "Create a free patient account, then go to \"Book Appointment\" from your dashboard. Pick a service, dentist, date and an available time slot - your booking is instantly recorded as pending until the clinic confirms it." },
  { q: "Can I cancel or reschedule an appointment?", a: "Yes. Open \"My Appointments\" from your dashboard. Pending and confirmed appointments can be cancelled or rescheduled to a new date/time as long as it's in the future." },
  { q: "What should I do in a dental emergency?", a: "Use the Emergency Request form from your dashboard for urgent (non-life-threatening) issues like severe pain, a broken tooth, or a lost filling. For a life-threatening emergency, call your local emergency number immediately." },
  { q: "How do I view my dental reports?", a: "Reports uploaded by your dentist appear under \"Reports\" in your patient dashboard, where you can view or download them at any time." },
  { q: "Is my medical information kept private?", a: "Yes. Patients can only ever see their own appointments, reports and emergency requests. Staff access is limited to what's needed to provide your care - see our Privacy Policy for details." },
  { q: "Do you accept walk-ins?", a: "We prioritize scheduled and emergency-request patients, but you're welcome to call the clinic directly to ask about same-day availability." },
];

export default function FAQ() {
  const [open, setOpen] = useState(0);

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-4xl sm:text-5xl font-bold text-[#0F172A] mb-4 text-center">Frequently Asked Questions</h1>
      <p className="text-lg text-[#64748B] text-center mb-12">Answers to what patients ask us most often.</p>

      <div className="space-y-4">
        {FAQS.map((item, i) => (
          <motion.div
            key={item.q}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="bg-white/60 backdrop-blur-sm border border-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
          >
            <button
              onClick={() => setOpen(open === i ? -1 : i)}
              className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
              aria-expanded={open === i}
            >
              <span className="font-semibold text-[#0F172A]">{item.q}</span>
              <ChevronDown className={`w-5 h-5 text-[#0EA5E9] flex-shrink-0 transition-transform ${open === i ? "rotate-180" : ""}`} />
            </button>
            {open === i && (
              <div className="px-6 pb-5 text-sm text-[#64748B] leading-relaxed">{item.a}</div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
