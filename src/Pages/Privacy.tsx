import { ShieldCheck } from "lucide-react";
import { CLINIC } from "../config/clinic.js";

export default function Privacy() {
  return (
    <div>
      <section className="bg-sand-50 border-b border-ink-200">
        <div className="container-page py-14 max-w-3xl">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-12 h-12 rounded-md bg-brand-50 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 text-brand-700" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-semibold text-ink-900">Privacy Policy</h1>
          </div>
          <p className="text-sm text-ink-500 ml-16">Last updated: January 2026</p>
        </div>
      </section>

      <div className="container-page max-w-3xl py-14 space-y-8 text-ink-700 leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold text-ink-900 mb-2">1. Information We Collect</h2>
          <p>
            When you create an account with {CLINIC.name}, we collect your name, email, phone number, age, and
            optional medical history you choose to share. When you book appointments, submit emergency requests,
            or receive reports, that information is stored against your account so your care team can access it.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-ink-900 mb-2">2. How We Use Your Information</h2>
          <p>
            Your information is used to manage appointments, respond to emergency requests, share medical reports
            with you, and send you relevant notifications about your care. We do not sell your personal or medical
            information to third parties.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-ink-900 mb-2">3. Data Security</h2>
          <p>
            Passwords are never stored in plain text - they are hashed using industry-standard algorithms.
            Access to patient records is restricted by role: patients can only view their own data, and clinic
            staff access is limited to what is needed to provide care.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-ink-900 mb-2">4. Your Rights</h2>
          <p>
            You can view and update your profile information at any time from your patient dashboard. To request
            deletion of your account or data, please contact us at {CLINIC.email}.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-ink-900 mb-2">5. Contact</h2>
          <p>Questions about this policy can be sent to {CLINIC.email} or {CLINIC.phone}.</p>
        </section>
      </div>
    </div>
  );
}
