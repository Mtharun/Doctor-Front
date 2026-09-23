import { motion } from "motion/react";
import { ShieldCheck, HeartHandshake, Sparkles, Users } from "lucide-react";
import { CLINIC } from "../config/clinic.js";

const VALUES = [
  { icon: ShieldCheck, title: "Trust & Safety", text: "Every procedure follows strict sterilization and safety protocols so you can relax in the chair." },
  { icon: HeartHandshake, title: "Patient-First Care", text: "We explain every option in plain language and never recommend treatment you don't need." },
  { icon: Sparkles, title: "Modern Technology", text: "Digital records, online booking, and modern equipment keep your care fast and accurate." },
  { icon: Users, title: "Experienced Team", text: "Our dentists bring real, hands-on experience across general, cosmetic, and surgical dentistry." },
];

export default function About() {
  return (
    <div>
      {/* Editorial intro */}
      <section className="bg-sand-50 border-b border-ink-200">
        <div className="container-page py-16 sm:py-24 max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <span className="eyebrow mb-4">About {CLINIC.name}</span>
            <h1 className="text-4xl sm:text-5xl font-serif font-semibold text-ink-900 mb-6 leading-tight">
              Care that puts the patient first, not the paperwork.
            </h1>
            <p className="text-lg text-ink-600 leading-relaxed">
              {CLINIC.name} was built to make quality dental care simple to access: easy online booking,
              transparent appointment tracking, private medical records, and a fast path to help when something
              goes wrong.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story + mission, image + text editorial split */}
      <section className="section">
        <div className="container-page grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative rounded-2xl overflow-hidden border border-ink-200 aspect-[4/3] bg-ink-50">
            <div className="absolute inset-0 flex items-center justify-center text-ink-300">
              <Sparkles className="w-24 h-24" strokeWidth={1} />
            </div>
          </div>
          <div>
            <span className="eyebrow mb-3">Our Mission</span>
            <h2 className="text-3xl font-serif font-semibold text-ink-900 mb-5">
              Dental care shouldn't feel confusing or intimidating.
            </h2>
            <p className="text-ink-600 leading-relaxed mb-4">
              From the moment you book online to the moment you leave the chair, our goal is to keep you informed,
              comfortable, and confident in your treatment plan.
            </p>
            <p className="text-ink-600 leading-relaxed">
              And if you ever have a dental emergency, we want to be reachable fast &mdash; with a clear priority
              queue that gets urgent cases in front of our team immediately.
            </p>
          </div>
        </div>
      </section>

      {/* Values - editorial list, not a repeated card grid */}
      <section className="section bg-ink-50 border-y border-ink-200">
        <div className="container-page">
          <div className="max-w-xl mb-14">
            <span className="eyebrow mb-3">What Guides Us</span>
            <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-ink-900">Our values in practice</h2>
          </div>
          <div className="grid sm:grid-cols-2 divide-y sm:divide-y-0 divide-ink-200">
            {VALUES.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className={`flex gap-5 py-8 sm:py-10 px-2 sm:px-8 ${i % 2 === 0 ? "sm:border-r sm:border-ink-200" : ""} ${i < 2 ? "sm:border-b sm:border-ink-200" : ""}`}
              >
                <v.icon className="w-6 h-6 text-brand-600 shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-ink-900 mb-1.5">{v.title}</h3>
                  <p className="text-sm text-ink-500 leading-relaxed">{v.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
