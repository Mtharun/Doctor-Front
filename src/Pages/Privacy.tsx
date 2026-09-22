import { CLINIC } from "../config/clinic.js";

export default function Privacy() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold text-[#0F172A] mb-2">Privacy Policy</h1>
      <p className="text-sm text-[#64748B] mb-10">Last updated: January 2026</p>

      <div className="space-y-8 text-[#334155] leading-relaxed">
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
