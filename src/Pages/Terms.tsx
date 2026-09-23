import { FileText } from "lucide-react";
import { CLINIC } from "../config/clinic.js";

export default function Terms() {
  return (
    <div>
      <section className="bg-sand-50 border-b border-ink-200">
        <div className="container-page py-14 max-w-3xl">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-12 h-12 rounded-md bg-brand-50 flex items-center justify-center shrink-0">
              <FileText className="w-6 h-6 text-brand-700" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-semibold text-ink-900">Terms &amp; Conditions</h1>
          </div>
          <p className="text-sm text-ink-500 ml-16">Last updated: January 2026</p>
        </div>
      </section>

      <div className="container-page max-w-3xl py-14 space-y-8 text-ink-700 leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold text-ink-900 mb-2">1. Acceptance of Terms</h2>
          <p>
            By creating an account or using {CLINIC.name}'s online booking platform, you agree to these terms.
            If you do not agree, please do not use the platform.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-ink-900 mb-2">2. Appointments</h2>
          <p>
            Booking an appointment submits a request; it is not confirmed until our staff reviews and confirms it.
            Appointments may be rescheduled or cancelled subject to availability. Repeated no-shows may result in
            booking restrictions.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-ink-900 mb-2">3. Emergency Requests</h2>
          <p>
            This platform is not a substitute for emergency medical services. If you are experiencing a
            life-threatening emergency, call your local emergency number immediately rather than submitting a
            request through this site.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-ink-900 mb-2">4. Account Responsibility</h2>
          <p>
            You are responsible for maintaining the confidentiality of your account credentials and for all
            activity under your account.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-ink-900 mb-2">5. Changes</h2>
          <p>We may update these terms from time to time. Continued use of the platform means you accept the current terms.</p>
        </section>
      </div>
    </div>
  );
}
