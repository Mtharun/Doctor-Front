import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { ArrowLeft, Clock, Stethoscope, CheckCircle } from "lucide-react";
import { ServicesApi } from "../api/services.js";
import LoadingState from "../components/ui/LoadingState.jsx";
import ErrorState from "../components/ui/ErrorState.jsx";

export default function ServiceDetail() {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [error, setError] = useState(null);
  const [notFound, setNotFound] = useState(false);

  const load = () => {
    ServicesApi.list()
      .then((res) => {
        const found = res.services.find((s) => String(s.id) === id);
        setError(null);
        if (!found) setNotFound(true);
        else {
          setNotFound(false);
          setService(found);
        }
      })
      .catch((err) => setError(err.message));
  };

  useEffect(load, [id]);

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-16">
        <ErrorState message={error} onRetry={load} />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-16 text-center">
        <h1 className="text-2xl font-bold text-[#0F172A] mb-3">Service not found</h1>
        <Link to="/services" className="text-[#0EA5E9] font-semibold">← Back to Services</Link>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-16">
        <LoadingState label="Loading service..." />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <Link to="/services" className="inline-flex items-center gap-2 text-[#0EA5E9] mb-8">
        <ArrowLeft className="w-4 h-4" /> Back to Services
      </Link>

      <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 border border-white shadow-lg">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0EA5E9] to-[#0284C7] flex items-center justify-center mb-6">
          <Stethoscope className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-[#0F172A] mb-3">{service.name}</h1>
        <p className="text-[#64748B] leading-relaxed mb-6">{service.description}</p>

        <div className="flex flex-wrap gap-6 mb-8 text-sm">
          <span className="flex items-center gap-2 text-[#64748B]">
            <Clock className="w-4 h-4 text-[#0EA5E9]" /> {service.durationMinutes} minutes
          </span>
          {service.price != null && (
            <span className="flex items-center gap-2 font-bold text-[#0EA5E9]">Starting at ${service.price}</span>
          )}
          <span className="flex items-center gap-2 text-[#22C55E]">
            <CheckCircle className="w-4 h-4" /> Available for booking
          </span>
        </div>

        <Link
          to="/signup"
          className="inline-block px-8 py-4 rounded-2xl bg-gradient-to-r from-[#0EA5E9] to-[#0284C7] text-white font-semibold hover:shadow-2xl hover:shadow-[#0EA5E9]/30 transition-all"
        >
          Book This Service
        </Link>
      </div>
    </div>
  );
}
