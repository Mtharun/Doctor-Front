import { CLINIC } from "../config/clinic.js";

export default function Terms() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold text-[#0F172A] mb-2">Terms &amp; Conditions</h1>
      <p className="text-sm text-[#64748B] mb-10">Last updated: January 2026</p>

      <div className="space-y-8 text-[#334155] leading-relaxed">
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
