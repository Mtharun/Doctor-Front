import { useEffect, useState } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import {
  CalendarCheck,
  Stethoscope,
  HeartHandshake,
  Sparkles,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  AlertCircle,
  Star,
  Clock,
  ChevronDown,
  ShieldCheck,
} from "lucide-react";
import { CLINIC } from "../config/clinic.js";
import { DentistsApi } from "../api/dentists.js";
import { ServicesApi } from "../api/services.js";

const TRUST_ITEMS = [
  { icon: Stethoscope, label: "Experienced Dentists" },
  { icon: Sparkles, label: "Modern Treatment" },
  { icon: CalendarCheck, label: "Flexible Appointments" },
  { icon: HeartHandshake, label: "Patient-focused Care" },
];

const TESTIMONIALS = [
  { name: "Aarav Mehta", quote: "Booking an appointment took less than two minutes. The reminders and clear status updates made the whole process stress-free." },
  { name: "Priya Nair", quote: "I used the emergency request late at night and the clinic team called me back quickly. Genuinely reassuring." },
  { name: "Rohan Das", quote: "Being able to see my reports and appointment history in one dashboard is exactly what I wanted from a dental portal." },
];

// Rotating "sticker" tints for circular icon/avatar placeholders, used in
// place of a flat dark bg-ink-900 circle so grids of them read as playful
// candy chips instead of one repeated dark blob.
const STICKER_TINTS = [
  "bg-brand-100 text-brand-700",
  "bg-coral-100 text-coral-700",
  "bg-sun-100 text-sun-800",
];

const FAQ_PREVIEW = [
  { q: "How do I book an appointment?", a: "Create a free patient account, then go to “Book Appointment” from your dashboard. Pick a service, dentist, date and an available time slot." },
  { q: "What should I do in a dental emergency?", a: "Use the Emergency Request form for urgent, non-life-threatening issues. For a life-threatening emergency, call your local emergency number immediately." },
  { q: "Is my medical information kept private?", a: "Yes. Patients can only ever see their own appointments, reports and emergency requests." },
];

// Simple, original line-art motif used in the hero panel instead of a
// stock photograph - keeps the app self-contained with no external
// image dependency. Swap this section for real clinic photography
// whenever licensed assets are ready.
function HeroMotif() {
  return (
    <svg viewBox="0 0 400 400" className="w-full h-full" role="img" aria-label="Illustration of a tooth, representing dental care">
      <defs>
        <pattern id="dot-grid" width="24" height="24" patternUnits="userSpaceOnUse">
          <circle cx="1.5" cy="1.5" r="1.5" fill="currentColor" className="text-ink-200" />
        </pattern>
      </defs>
      <rect x="0" y="0" width="400" height="400" fill="url(#dot-grid)" />
      <circle cx="200" cy="200" r="128" className="fill-brand-50" />
      <circle cx="200" cy="200" r="128" fill="none" className="stroke-brand-200" strokeWidth="1.5" />
      <path
        d="M200 118c-24 0-33 16-52 16-17 0-30-13-30 14 0 44 20 118 44 118 15 0 17-24 38-24s23 24 38 24c24 0 44-74 44-118 0-27-13-14-30-14-19 0-28-16-52-16z"
        className="fill-white stroke-brand-600"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path d="M172 168c8 10 12 22 12 36" className="stroke-brand-300" strokeWidth="3" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export default function Home() {
  const [services, setServices] = useState(null);
  const [dentists, setDentists] = useState(null);

  useEffect(() => {
    ServicesApi.list().then((res) => setServices(res.services)).catch(() => setServices([]));
    DentistsApi.list().then((res) => setDentists(res.dentists)).catch(() => setDentists([]));
  }, []);

  return (
    <>
      {/* ============ HERO ============ */}
      <section className="bg-sand-50 border-b border-ink-200">
        <div className="container-page pt-16 pb-20 sm:pt-24 sm:pb-28 grid lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="eyebrow mb-5">
              <ShieldCheck className="w-3.5 h-3.5" /> Trusted Dental Care
            </span>
            <h1 className="text-4xl sm:text-6xl font-serif font-semibold text-ink-900 mb-6 leading-[1.08]">
              Your Smile,
              <br />
              Our Priority.
            </h1>
            <p className="text-lg text-ink-600 mb-9 leading-relaxed max-w-md">
              Book appointments, reach us in a dental emergency, and manage your care from one calm, uncomplicated
              dashboard.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/signup" className="btn btn-primary text-base px-7 py-3.5">
                Book Appointment <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/services" className="btn btn-outline text-base px-7 py-3.5">
                Explore Services
              </Link>
            </div>
            <Link to="/patient/emergency" className="inline-flex items-center gap-2 text-sm font-semibold text-danger-600 mt-6 hover:text-[#8f1e18]">
              <AlertCircle className="w-4 h-4" /> Need urgent care? Submit an emergency request
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden border border-ink-200 shadow-lg aspect-[4/3] text-ink-400">
              <HeroMotif />
            </div>
            <div className="hidden sm:block absolute -top-5 -right-5 bg-white rounded-xl px-5 py-4 shadow-lg border border-ink-100">
              <p className="text-xs text-ink-500 mb-1">Booking</p>
              <p className="font-semibold text-ink-900 text-sm flex items-center gap-1.5"><CalendarCheck className="w-4 h-4 text-brand-600" /> In under 2 minutes</p>
            </div>
            <div className="hidden sm:block absolute -bottom-5 -left-5 bg-white rounded-xl px-5 py-4 shadow-lg border border-ink-100">
              <p className="text-xs text-ink-500 mb-1">Emergency Line</p>
              <p className="font-semibold text-ink-900 text-sm flex items-center gap-1.5"><Clock className="w-4 h-4 text-brand-600" /> Priority response</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============ TRUST STRIP ============ */}
      <section className="border-b border-ink-200 bg-white">
        <div className="container-page py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
          {TRUST_ITEMS.map((item) => (
            <div key={item.label} className="flex items-center gap-3">
              <item.icon className="w-5 h-5 text-brand-600 shrink-0" />
              <span className="text-sm font-medium text-ink-700">{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ============ SERVICES PREVIEW ============ */}
      <section className="section">
        <div className="container-page">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <span className="eyebrow mb-3">What We Offer</span>
              <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-ink-900">Dental Services</h2>
            </div>
            <Link to="/services" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:text-brand-800">
              View all services <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(services ?? Array.from({ length: 3 })).slice(0, 3).map((s, i) => (
              <div key={s?.id ?? i} className="card card-hover p-7">
                {s ? (
                  <>
                    <div className="w-11 h-11 rounded-md bg-brand-50 flex items-center justify-center mb-5">
                      <Stethoscope className="w-5 h-5 text-brand-700" />
                    </div>
                    <h3 className="text-lg font-semibold text-ink-900 mb-2">{s.name}</h3>
                    <p className="text-sm text-ink-500 mb-5 leading-relaxed line-clamp-3">{s.description}</p>
                    <div className="flex items-center justify-between text-sm border-t border-ink-100 pt-4">
                      <span className="flex items-center gap-1.5 text-ink-500"><Clock className="w-4 h-4" /> {s.durationMinutes} min</span>
                      {s.price != null && <span className="font-semibold text-ink-900">${s.price}</span>}
                    </div>
                  </>
                ) : (
                  <div className="animate-pulse space-y-4">
                    <div className="w-11 h-11 rounded-md bg-ink-100" />
                    <div className="h-4 bg-ink-100 rounded w-2/3" />
                    <div className="h-3 bg-ink-100 rounded w-full" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ DOCTORS PREVIEW ============ */}
      <section className="section bg-ink-50 border-y border-ink-200">
        <div className="container-page">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <span className="eyebrow mb-3">Our Team</span>
              <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-ink-900">Meet Our Dentists</h2>
            </div>
            <Link to="/doctors" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:text-brand-800">
              Meet our dentists <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(dentists ?? Array.from({ length: 4 })).slice(0, 4).map((d, i) => (
              <div key={d?.id ?? i} className="card card-hover p-6 text-center">
                {d ? (
                  <>
                    <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${STICKER_TINTS[i % STICKER_TINTS.length]}`}>
                      <Stethoscope className="w-7 h-7" />
                    </div>
                    <h3 className="font-semibold text-ink-900 mb-1">{d.name}</h3>
                    <p className="text-sm text-brand-700 font-medium">{d.specialty}</p>
                  </>
                ) : (
                  <div className="animate-pulse space-y-3">
                    <div className="w-16 h-16 mx-auto rounded-full bg-ink-100" />
                    <div className="h-4 bg-ink-100 rounded w-2/3 mx-auto" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ WHY DENTALCARE (editorial) ============ */}
      <section className="section">
        <div className="container-page grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative rounded-2xl overflow-hidden border border-ink-200 aspect-[4/3] bg-sand-50 order-2 lg:order-1">
            <div className="absolute inset-0 flex items-center justify-center text-ink-300">
              <HeartHandshake className="w-24 h-24" strokeWidth={1} />
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <span className="eyebrow mb-3">Why DentalCare</span>
            <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-ink-900 mb-6">
              Care built around the patient, not the paperwork.
            </h2>
            <p className="text-ink-600 leading-relaxed mb-6">
              We built {CLINIC.name} so booking, follow-up and records feel as considered as the treatment itself.
              Every appointment is confirmed by our team, every report stays private to you, and every emergency
              request reaches us with the urgency it deserves.
            </p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <CalendarCheck className="w-5 h-5 text-brand-600 mt-0.5 shrink-0" />
                <span className="text-ink-700 text-sm"><strong className="text-ink-900">Real availability.</strong> See only the time slots your dentist actually has open.</span>
              </li>
              <li className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-brand-600 mt-0.5 shrink-0" />
                <span className="text-ink-700 text-sm"><strong className="text-ink-900">Private by design.</strong> Your appointments and reports are visible only to you and your care team.</span>
              </li>
              <li className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-brand-600 mt-0.5 shrink-0" />
                <span className="text-ink-700 text-sm"><strong className="text-ink-900">Fast when it matters.</strong> Emergency requests are triaged by priority the moment they're submitted.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ============ APPOINTMENT CTA ============ */}
      <section className="section pt-0">
        <div className="container-page">
          <div className="bg-coral-600 rounded-3xl px-8 py-14 sm:px-16 sm:py-16 text-center relative overflow-hidden">
            <span className="absolute -top-8 -left-8 w-32 h-32 rounded-full bg-white/10" aria-hidden="true" />
            <span className="absolute -bottom-10 -right-6 w-40 h-40 rounded-full bg-white/10" aria-hidden="true" />
            <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-white mb-4 relative">Ready when you are.</h2>
            <p className="text-white max-w-lg mx-auto mb-8 relative">
              Create a free patient account and book your first appointment in a couple of minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center relative">
              <Link to="/signup" className="btn bg-white text-coral-700 hover:bg-coral-50 text-base px-7 py-3.5">
                Book Appointment
              </Link>
              <Link to="/login" className="btn btn-outline-invert text-base px-7 py-3.5">
                Log In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============ TESTIMONIALS ============ */}
      <section className="section bg-ink-50 border-y border-ink-200">
        <div className="container-page">
          <div className="text-center mb-12">
            <span className="eyebrow mb-3">Patient Stories</span>
            <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-ink-900">What Our Patients Say</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="card p-7">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} className="w-4 h-4 fill-warning-600 text-warning-600" />
                  ))}
                </div>
                <p className="text-ink-600 mb-5 leading-relaxed text-sm">&ldquo;{t.quote}&rdquo;</p>
                <p className="font-semibold text-ink-900 text-sm">{t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FAQ PREVIEW ============ */}
      <section className="section">
        <div className="container-page max-w-3xl">
          <div className="text-center mb-10">
            <span className="eyebrow mb-3">Questions</span>
            <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-ink-900">Frequently Asked</h2>
          </div>
          <div className="space-y-3">
            {FAQ_PREVIEW.map((item) => (
              <details key={item.q} className="card px-6 py-1 group">
                <summary className="flex items-center justify-between gap-4 py-4 cursor-pointer list-none font-medium text-ink-900 text-sm">
                  {item.q}
                  <ChevronDown className="w-4 h-4 text-ink-400 shrink-0 transition-transform group-open:rotate-180" />
                </summary>
                <p className="text-sm text-ink-500 leading-relaxed pb-4">{item.a}</p>
              </details>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/faq" className="text-sm font-semibold text-brand-700 hover:text-brand-800 inline-flex items-center gap-1.5">
              See all FAQs <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ============ CONTACT STRIP ============ */}
      <section className="section pt-0">
        <div className="container-page">
          <div className="card p-8 sm:p-12 grid sm:grid-cols-3 gap-8">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-md bg-brand-50 flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5 text-brand-700" />
              </div>
              <div>
                <p className="text-xs text-ink-500">Call Us</p>
                <p className="font-semibold text-ink-900 text-sm">{CLINIC.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-md bg-brand-50 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5 text-brand-700" />
              </div>
              <div>
                <p className="text-xs text-ink-500">Email Us</p>
                <p className="font-semibold text-ink-900 text-sm">{CLINIC.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-md bg-brand-50 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-brand-700" />
              </div>
              <div>
                <p className="text-xs text-ink-500">Visit Us</p>
                <p className="font-semibold text-ink-900 text-sm">{CLINIC.address}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
