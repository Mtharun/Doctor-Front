import { useEffect, useState } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import { Stethoscope, Clock, ArrowRight } from "lucide-react";
import { ServicesApi } from "../api/services.js";
import LoadingState from "../components/ui/LoadingState.jsx";
import ErrorState from "../components/ui/ErrorState.jsx";

export default function Services() {
  const [services, setServices] = useState(null);
  const [error, setError] = useState(null);

  const load = () => {
    ServicesApi.list()
      .then((res) => {
        setServices(res.services);
        setError(null);
      })
      .catch((err) => setError(err.message));
  };

  useEffect(load, []);

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold text-[#0F172A] mb-4">Our Dental Services</h1>
        <p className="text-lg text-[#64748B]">Comprehensive care for every stage of your dental health</p>
      </div>

      {error && <ErrorState message={error} onRetry={load} />}
      {!error && !services && <LoadingState label="Loading services..." />}

      {services && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="p-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-white shadow-lg hover:shadow-2xl transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0EA5E9] to-[#0284C7] flex items-center justify-center mb-4">
                <Stethoscope className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-[#0F172A] mb-2">{s.name}</h3>
              <p className="text-sm text-[#64748B] mb-4 leading-relaxed">{s.description}</p>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1 text-[#64748B]">
                  <Clock className="w-4 h-4" /> {s.durationMinutes} min
                </span>
                {s.price != null && <span className="font-bold text-[#0EA5E9]">${s.price}</span>}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <div className="mt-14 text-center">
        <Link
          to="/signup"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#0EA5E9] to-[#0284C7] text-white font-semibold hover:shadow-2xl hover:shadow-[#0EA5E9]/30 transition-all"
        >
          Book a Service <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
