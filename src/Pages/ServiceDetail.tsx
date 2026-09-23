import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { ArrowLeft, Clock, Stethoscope, CheckCircle, DollarSign } from "lucide-react";
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
      <div className="container-page max-w-3xl py-16">
        <ErrorState message={error} onRetry={load} />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="container-page max-w-3xl py-16 text-center">
        <h1 className="text-2xl font-semibold text-ink-900 mb-3">Service not found</h1>
        <Link to="/services" className="text-brand-700 font-semibold">&larr; Back to Services</Link>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="container-page max-w-3xl py-16">
        <LoadingState label="Loading service..." />
      </div>
    );
  }

  return (
    <div>
      <section className="bg-sand-50 border-b border-ink-200">
        <div className="container-page py-14 max-w-3xl">
          <Link to="/services" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700 mb-8">
            <ArrowLeft className="w-4 h-4" /> Back to Services
          </Link>
          <div className="w-14 h-14 rounded-md bg-brand-50 flex items-center justify-center mb-6">
            <Stethoscope className="w-7 h-7 text-brand-700" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-serif font-semibold text-ink-900 mb-4">{service.name}</h1>
          <p className="text-lg text-ink-600 leading-relaxed max-w-2xl">{service.description}</p>
        </div>
      </section>

      <div className="container-page max-w-3xl py-14">
        <div className="grid sm:grid-cols-3 gap-4 mb-10">
          <div className="card p-5 flex items-center gap-3">
            <Clock className="w-5 h-5 text-brand-600 shrink-0" />
            <div>
              <p className="text-xs text-ink-500">Duration</p>
              <p className="font-semibold text-ink-900 text-sm">{service.durationMinutes} minutes</p>
            </div>
          </div>
          {service.price != null && (
            <div className="card p-5 flex items-center gap-3">
              <DollarSign className="w-5 h-5 text-brand-600 shrink-0" />
              <div>
                <p className="text-xs text-ink-500">Starting At</p>
                <p className="font-semibold text-ink-900 text-sm">${service.price}</p>
              </div>
            </div>
          )}
          <div className="card p-5 flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-success-600 shrink-0" />
            <div>
              <p className="text-xs text-ink-500">Availability</p>
              <p className="font-semibold text-ink-900 text-sm">Open for booking</p>
            </div>
          </div>
        </div>

        <Link to="/signup" className="btn btn-primary text-base px-7 py-3.5">
          Book This Service
        </Link>
      </div>
    </div>
  );
}
