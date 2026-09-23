import { Link } from "react-router";
import { Phone, Mail, MapPin, Clock, AlertCircle } from "lucide-react";
import { CLINIC } from "../../config/clinic.js";

// lucide-react no longer ships brand/social marks, so these three are kept
// as small inline outlines - purely decorative, no external asset needed.
function FacebookMark(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" {...props}>
      <path d="M13.5 21v-7.5h2.5l.5-3h-3V8.5c0-.9.25-1.5 1.5-1.5H16.6V4.3c-.27-.04-1.2-.11-2.28-.11-2.26 0-3.8 1.38-3.8 3.9V10.5H8v3h2.5V21h3z" />
    </svg>
  );
}
function InstagramMark(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="16" height="16" {...props}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17" cy="7" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}
function TwitterMark(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" {...props}>
      <path d="M20.5 6.2c-.6.28-1.25.47-1.93.55a3.4 3.4 0 0 0 1.48-1.87 6.8 6.8 0 0 1-2.15.82 3.38 3.38 0 0 0-5.76 3.08A9.6 9.6 0 0 1 5 5.6a3.38 3.38 0 0 0 1.05 4.51c-.55-.02-1.07-.17-1.52-.42v.04a3.38 3.38 0 0 0 2.71 3.32c-.5.14-1.03.16-1.53.06a3.39 3.39 0 0 0 3.16 2.35A6.79 6.79 0 0 1 3.5 16.9a9.58 9.58 0 0 0 5.19 1.52c6.23 0 9.64-5.16 9.64-9.64l-.01-.44c.66-.48 1.24-1.07 1.7-1.75-.62.27-1.28.46-1.97.54z" />
    </svg>
  );
}

export default function PublicFooter() {
  return (
    <footer className="border-t border-ink-200 bg-ink-900 text-ink-300">
      <div className="container-page py-16 grid sm:grid-cols-2 lg:grid-cols-5 gap-10">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-400" aria-hidden="true" />
            <span className="font-serif text-xl font-semibold text-white">{CLINIC.name}</span>
          </div>
          <p className="text-sm leading-relaxed max-w-xs">
            {CLINIC.tagline}. Modern, trustworthy dental care for the whole family, delivered with a calm,
            patient-first approach.
          </p>
          <div className="flex items-center gap-3 mt-6">
            {CLINIC.social?.facebook && (
              <a href={CLINIC.social.facebook} target="_blank" rel="noreferrer" aria-label="Facebook" className="w-9 h-9 rounded-md bg-white/10 flex items-center justify-center hover:bg-white/20">
                <FacebookMark />
              </a>
            )}
            {CLINIC.social?.instagram && (
              <a href={CLINIC.social.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className="w-9 h-9 rounded-md bg-white/10 flex items-center justify-center hover:bg-white/20">
                <InstagramMark />
              </a>
            )}
            {CLINIC.social?.twitter && (
              <a href={CLINIC.social.twitter} target="_blank" rel="noreferrer" aria-label="Twitter" className="w-9 h-9 rounded-md bg-white/10 flex items-center justify-center hover:bg-white/20">
                <TwitterMark />
              </a>
            )}
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-4 text-sm">Explore</h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/about" className="hover:text-white">About Us</Link></li>
            <li><Link to="/doctors" className="hover:text-white">Our Dentists</Link></li>
            <li><Link to="/services" className="hover:text-white">Services</Link></li>
            <li><Link to="/faq" className="hover:text-white">FAQ</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-4 text-sm">Legal &amp; Support</h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/privacy" className="hover:text-white">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-white">Terms &amp; Conditions</Link></li>
            <li><Link to="/contact" className="hover:text-white">Contact Us</Link></li>
            <li>
              <Link to="/patient/emergency" className="flex items-center gap-1.5 text-danger-400 hover:text-danger-300 font-medium">
                <AlertCircle className="w-3.5 h-3.5" /> Emergency Request
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-4 text-sm">Visit &amp; Hours</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-brand-400 shrink-0" /> {CLINIC.phone}</li>
            <li className="flex items-center gap-2"><Mail className="w-4 h-4 text-brand-400 shrink-0" /> {CLINIC.email}</li>
            <li className="flex items-start gap-2"><MapPin className="w-4 h-4 text-brand-400 mt-0.5 shrink-0" /> {CLINIC.address}</li>
          </ul>
          <ul className="mt-4 space-y-1.5 text-sm border-t border-white/10 pt-4">
            {CLINIC.hours?.map((h) => (
              <li key={h.day} className="flex items-start gap-2">
                <Clock className="w-3.5 h-3.5 text-brand-400 mt-0.5 shrink-0" />
                <span>{h.day}: {h.time}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <p className="container-page py-6 text-center text-sm text-ink-400">
          © {new Date().getFullYear()} {CLINIC.name}. All rights reserved. · Professional Dental Services
        </p>
      </div>
    </footer>
  );
}
