import { motion } from "motion/react";
import { FileText } from "lucide-react";
import { CLINIC } from "../config/clinic.js";

export default function Terms() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4 mb-2">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0EA5E9] to-[#0284C7] flex items-center justify-center shadow-md shadow-[#0EA5E9]/20 flex-shrink-0">
          <FileText className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-[#0F172A]">Terms &amp; Conditions</h1>
      </motion.div>
      <p className="text-sm text-[#64748B] mb-10 ml-16">Last updated: January 2026</p>

      <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 sm:p-10 border border-white shadow-lg space-y-8 text-[#334155] leading-relaxed">
        <section>
          <h2 className="text-xl font-bold text-[#0F172A] mb-2">1. Acceptance of Terms</h2>
          <p>
            By creating an account or using {CLINIC.name}'s online booking platform, you agree to these terms.
            If you do not agree, please do not use the platform.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-[#0F172A] mb-2">2. Appointments</h2>
          <p>
            Booking an appointment submits a request; it is not confirmed until our staff reviews and confirms it.
            Appointments may be rescheduled or cancelled subject to availability. Repeated no-shows may result in
            booking restrictions.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-[#0F172A] mb-2">3. Emergency Requests</h2>
          <p>
            This platform is not a substitute for emergency medical services. If you are experiencing a
            life-threatening emergency, call your local emergency number immediately rather than submitting a
            request through this site.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-[#0F172A] mb-2">4. Account Responsibility</h2>
          <p>
            You are responsible for maintaining the confidentiality of your account credentials and for all
            activity under your account.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-[#0F172A] mb-2">5. Changes</h2>
          <p>We may update these terms from time to time. Continued use of the platform means you accept the current terms.</p>
        </section>
      </div>
    </div>
  );
}
