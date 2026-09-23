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
    <div>
      <section className="bg-sand-50 border-b border-ink-200">
        <div className="container-page py-16 sm:py-20 text-center">
          <span className="eyebrow mb-4 justify-center">What We Offer</span>
          <h1 className="text-4xl sm:text-5xl font-serif font-semibold text-ink-900 mb-4">Our Dental Services</h1>
          <p className="text-lg text-ink-600 max-w-xl mx-auto">
            Comprehensive care for every stage of your dental health.
          </p>
        </div>
      </section>

      <div className="container-page py-14 sm:py-20">
        {error && <ErrorState message={error} onRetry={load} />}
        {!error && !services && <LoadingState label="Loading services..." />}

        {services && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s, i) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Link to={`/services/${s.id}`} className="card card-hover p-7 flex flex-col h-full">
                  <div className="w-11 h-11 rounded-md bg-brand-50 flex items-center justify-center mb-5">
                    <Stethoscope className="w-5 h-5 text-brand-700" />
                  </div>
                  <h3 className="text-lg font-semibold text-ink-900 mb-2">{s.name}</h3>
                  <p className="text-sm text-ink-500 mb-5 leading-relaxed flex-1">{s.description}</p>
                  <div className="flex items-center justify-between text-sm border-t border-ink-100 pt-4">
                    <span className="flex items-center gap-1.5 text-ink-500">
                      <Clock className="w-4 h-4" /> {s.durationMinutes} min
                    </span>
                    {s.price != null && <span className="font-semibold text-ink-900">${s.price}</span>}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        <div className="mt-16 text-center">
          <Link to="/signup" className="btn btn-primary text-base px-7 py-3.5">
            Book a Service <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
