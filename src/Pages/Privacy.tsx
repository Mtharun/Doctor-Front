import { motion } from "motion/react";
import { ShieldCheck } from "lucide-react";
import { CLINIC } from "../config/clinic.js";

export default function Privacy() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4 mb-2">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0EA5E9] to-[#0284C7] flex items-center justify-center shadow-md shadow-[#0EA5E9]/20 flex-shrink-0">
          <ShieldCheck className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-[#0F172A]">Privacy Policy</h1>
      </motion.div>
      <p className="text-sm text-[#64748B] mb-10 ml-16">Last updated: January 2026</p>

      <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 sm:p-10 border border-white shadow-lg space-y-8 text-[#334155] leading-relaxed">
        <section>
          <h2 className="text-xl font-bold text-[#0F172A] mb-2">1. Information We Collect</h2>
          <p>
            When you create an account with {CLINIC.name}, we collect your name, email, phone number, age, and
            optional medical history you choose to share. When you book appointments, submit emergency requests,
            or receive reports, that information is stored against your account so your care team can access it.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-[#0F172A] mb-2">2. How We Use Your Information</h2>
          <p>
            Your information is used to manage appointments, respond to emergency requests, share medical reports
            with you, and send you relevant notifications about your care. We do not sell your personal or medical
            information to third parties.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-[#0F172A] mb-2">3. Data Security</h2>
          <p>
            Passwords are never stored in plain text - they are hashed using industry-standard algorithms.
            Access to patient records is restricted by role: patients can only view their own data, and clinic
            staff access is limited to what is needed to provide care.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-[#0F172A] mb-2">4. Your Rights</h2>
          <p>
            You can view and update your profile information at any time from your patient dashboard. To request
            deletion of your account or data, please contact us at {CLINIC.email}.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-[#0F172A] mb-2">5. Contact</h2>
          <p>Questions about this policy can be sent to {CLINIC.email} or {CLINIC.phone}.</p>
        </section>
      </div>
    </div>
  );
}
