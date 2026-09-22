import { useState } from "react";
import { Link, NavLink } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Shield, Menu, X, AlertCircle } from "lucide-react";
import { CLINIC } from "../../config/clinic.js";

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/doctors", label: "Doctors" },
  { to: "/faq", label: "FAQ" },
  { to: "/contact", label: "Contact" },
];

export default function PublicHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition-all ${
      isActive ? "text-[#0EA5E9] bg-[#0EA5E9]/5" : "text-[#64748B] hover:text-[#0EA5E9] hover:bg-[#0EA5E9]/5"
    }`;

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 border-b border-[#0EA5E9]/10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0EA5E9] to-[#0284C7] flex items-center justify-center shadow-lg shadow-[#0EA5E9]/20">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#0F172A] leading-tight">{CLINIC.name}</h1>
            <p className="text-xs text-[#64748B]">Professional Dental Services</p>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.to === "/"} className={linkClass}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <Link to="/login" className="px-5 py-2.5 rounded-xl text-[#0EA5E9] hover:bg-[#0EA5E9]/5 transition-all text-sm font-medium">
            Login
          </Link>
          <Link
            to="/signup"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#0EA5E9] to-[#0284C7] text-white text-sm font-semibold hover:shadow-lg hover:shadow-[#0EA5E9]/30 transition-all"
          >
            Get Started
          </Link>
        </div>

        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="lg:hidden p-2 rounded-xl hover:bg-gray-100"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X className="w-6 h-6 text-[#0F172A]" /> : <Menu className="w-6 h-6 text-[#0F172A]" />}
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden overflow-hidden border-t border-[#0EA5E9]/10 bg-white/95"
          >
            <div className="px-6 py-4 flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === "/"}
                  onClick={() => setMenuOpen(false)}
                  className={linkClass}
                >
                  {link.label}
                </NavLink>
              ))}
              <Link
                to="/patient/emergency"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-[#EF4444]"
              >
                <AlertCircle className="w-4 h-4" /> Emergency
              </Link>
              <div className="flex gap-3 mt-3 pt-3 border-t border-gray-100">
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="flex-1 text-center px-4 py-2.5 rounded-xl border-2 border-[#0EA5E9]/20 text-[#0EA5E9] font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMenuOpen(false)}
                  className="flex-1 text-center px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#0EA5E9] to-[#0284C7] text-white font-semibold"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
