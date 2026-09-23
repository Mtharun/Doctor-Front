import { useEffect, useState } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import { Stethoscope, Clock, ArrowRight, CalendarDays } from "lucide-react";
import { DentistsApi } from "../api/dentists.js";
import LoadingState from "../components/ui/LoadingState.jsx";
import ErrorState from "../components/ui/ErrorState.jsx";

export default function Doctors() {
  const [dentists, setDentists] = useState(null);
  const [error, setError] = useState(null);

  const load = () => {
    DentistsApi.list()
      .then((res) => {
        setDentists(res.dentists);
        setError(null);
      })
      .catch((err) => setError(err.message));
  };

  useEffect(load, []);

  return (
    <div>
      <section className="bg-sand-50 border-b border-ink-200">
        <div className="container-page py-16 sm:py-20 text-center">
          <span className="eyebrow mb-4 justify-center">Our Team</span>
          <h1 className="text-4xl sm:text-5xl font-serif font-semibold text-ink-900 mb-4">Meet Our Dentists</h1>
          <p className="text-lg text-ink-600 max-w-xl mx-auto">
            A team of experienced, licensed dental professionals dedicated to your care.
          </p>
        </div>
      </section>

      <div className="container-page py-14 sm:py-20">
        {error && <ErrorState message={error} onRetry={load} />}
        {!error && !dentists && <LoadingState label="Loading our team..." />}

        {dentists && dentists.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {dentists.map((d, i) => (
              <motion.div
                key={d.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="card card-hover p-6 text-center flex flex-col"
              >
                <div className="w-20 h-20 mx-auto rounded-full bg-ink-900 flex items-center justify-center mb-5">
                  <Stethoscope className="w-9 h-9 text-white" />
                </div>
                <h3 className="font-semibold text-ink-900 mb-1">{d.name}</h3>
                <p className="text-sm text-brand-700 font-medium mb-3">{d.specialty}</p>
                {d.bio && <p className="text-xs text-ink-500 leading-relaxed mb-4 flex-1">{d.bio}</p>}
                <div className="text-xs text-ink-500 space-y-1.5 border-t border-ink-100 pt-4 mt-auto">
                  <p className="flex items-center justify-center gap-1.5">
                    <CalendarDays className="w-3.5 h-3.5" /> {d.workingDays?.join(", ")}
                  </p>
                  <p className="flex items-center justify-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" /> {d.startTime} &ndash; {d.endTime}
                  </p>
                </div>
                <Link to="/signup" className="btn btn-outline btn-sm mt-5 w-full">
                  Book Appointment
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {dentists && dentists.length > 0 && (
          <div className="mt-16 text-center">
            <Link to="/signup" className="btn btn-primary text-base px-7 py-3.5">
              Book an Appointment <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
