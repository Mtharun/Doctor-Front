import { motion } from "motion/react";
import { Shield, HeartHandshake, Sparkles, Users } from "lucide-react";
import { CLINIC } from "../config/clinic.js";

const VALUES = [
  { icon: Shield, title: "Trust & Safety", text: "Every procedure follows strict sterilization and safety protocols so you can relax in the chair." },
  { icon: HeartHandshake, title: "Patient-First Care", text: "We explain every option in plain language and never recommend treatment you don't need." },
  { icon: Sparkles, title: "Modern Technology", text: "Digital records, online booking, and modern equipment keep your care fast and accurate." },
  { icon: Users, title: "Experienced Team", text: "Our dentists bring decades of combined experience across general, cosmetic, and surgical dentistry." },
];

export default function About() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl sm:text-5xl font-bold text-[#0F172A] mb-4">About {CLINIC.name}</h1>
        <p className="text-lg text-[#64748B] max-w-2xl mb-12">
          {CLINIC.name} was built to make quality dental care simple to access: easy online booking, transparent
          appointment tracking, and a fast path to help when something goes wrong.
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-2 gap-6 mb-16">
        {VALUES.map((v, i) => (
          <motion.div
            key={v.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="p-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-white shadow-lg"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0EA5E9] to-[#0284C7] flex items-center justify-center mb-4">
              <v.icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-bold text-[#0F172A] mb-2">{v.title}</h3>
            <p className="text-sm text-[#64748B] leading-relaxed">{v.text}</p>
          </motion.div>
        ))}
      </div>

      <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 border border-white shadow-lg">
        <h2 className="text-2xl font-bold text-[#0F172A] mb-3">Our Mission</h2>
        <p className="text-[#64748B] leading-relaxed">
          We believe dental care should never be confusing or intimidating. From the moment you book online to the
          moment you leave the chair, our goal is to keep you informed, comfortable, and confident in your treatment
          plan - and to be there fast if you ever have a dental emergency.
        </p>
      </div>
    </div>
  );
}
