import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Stethoscope, Clock } from "lucide-react";
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
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold text-[#0F172A] mb-4">Meet Our Dentists</h1>
        <p className="text-lg text-[#64748B]">Experienced professionals dedicated to your care</p>
      </div>

      {error && <ErrorState message={error} onRetry={load} />}
      {!error && !dentists && <LoadingState label="Loading our team..." />}

      {dentists && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {dentists.map((d, i) => (
            <motion.div
              key={d.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="p-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-white shadow-lg text-center"
            >
              <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-[#0EA5E9] to-[#0284C7] flex items-center justify-center mb-4">
                <Stethoscope className="w-10 h-10 text-white" />
              </div>
              <h3 className="font-bold text-[#0F172A] mb-1">{d.name}</h3>
              <p className="text-sm text-[#0EA5E9] font-medium mb-3">{d.specialty}</p>
              {d.bio && <p className="text-xs text-[#64748B] leading-relaxed mb-3">{d.bio}</p>}
              <p className="flex items-center justify-center gap-1 text-xs text-[#64748B]">
                <Clock className="w-3 h-3" /> {d.startTime} - {d.endTime}
              </p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
