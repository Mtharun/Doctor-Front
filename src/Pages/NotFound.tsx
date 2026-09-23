import { Link } from "react-router";
import { motion } from "motion/react";
import { Home, ShieldCheck } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-sand-50 flex items-center justify-center px-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-md">
        <div className="w-14 h-14 mx-auto mb-6 rounded-md bg-brand-50 flex items-center justify-center">
          <ShieldCheck className="w-7 h-7 text-brand-700" />
        </div>
        <h1 className="text-6xl font-serif font-semibold text-ink-900 mb-2">404</h1>
        <h2 className="text-xl font-semibold text-ink-900 mb-3">Page Not Found</h2>
        <p className="text-ink-500 mb-8">
          The page you're looking for doesn't exist or may have been moved.
        </p>
        <Link to="/" className="btn btn-primary">
          <Home className="w-4 h-4" />
          Back to Home
        </Link>
      </motion.div>
    </div>
  );
}
