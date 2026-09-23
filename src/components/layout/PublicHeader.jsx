import { useState } from "react";
import { Link, NavLink } from "react-router";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X, AlertCircle } from "lucide-react";
import { CLINIC } from "../../config/clinic.js";

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/doctors", label: "Doctors" },
  { to: "/services", label: "Services" },
  { to: "/faq", label: "FAQ" },
  { to: "/contact", label: "Contact" },
];

export default function PublicHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  const linkClass = ({ isActive }) =>
    `px-3 py-2 text-sm font-medium transition-colors border-b-2 ${
      isActive ? "text-ink-900 border-brand-600" : "text-ink-500 border-transparent hover:text-ink-900"
    }`;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-saturate-150 border-b border-ink-200">
      <div className="container-page flex items-center justify-between h-20">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <span className="w-2.5 h-2.5 rounded-full bg-brand-600" aria-hidden="true" />
          <span className="font-serif text-2xl font-semibold text-ink-900 leading-none">{CLINIC.name}</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.to === "/"} className={linkClass}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-4">
          <Link
            to="/patient/emergency"
            className="flex items-center gap-1.5 text-sm font-semibold text-danger-600 hover:text-[#8f1e18]"
          >
            <AlertCircle className="w-4 h-4" /> Emergency
          </Link>
          <Link to="/login" className="text-sm font-medium text-ink-700 hover:text-ink-900">
            Log In
          </Link>
          <Link to="/signup" className="btn btn-primary btn-sm">
            Book Appointment
          </Link>
        </div>

        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="lg:hidden p-2 rounded-md hover:bg-ink-100"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X className="w-6 h-6 text-ink-900" /> : <Menu className="w-6 h-6 text-ink-900" />}
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="lg:hidden overflow-hidden border-t border-ink-200 bg-white"
          >
            <div className="px-6 py-4 flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === "/"}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `px-3 py-2.5 rounded-md text-sm font-medium ${isActive ? "text-ink-900 bg-ink-100" : "text-ink-600"}`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              <Link
                to="/patient/emergency"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2.5 rounded-md text-sm font-semibold text-danger-600"
              >
                <AlertCircle className="w-4 h-4" /> Emergency
              </Link>
              <div className="flex gap-3 mt-3 pt-3 border-t border-ink-200">
                <Link to="/login" onClick={() => setMenuOpen(false)} className="btn btn-outline flex-1">
                  Log In
                </Link>
                <Link to="/signup" onClick={() => setMenuOpen(false)} className="btn btn-primary flex-1">
                  Book Appointment
                </Link>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
