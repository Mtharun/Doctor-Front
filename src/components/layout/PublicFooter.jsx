import { Link } from "react-router";
import { Shield, Phone, Mail, MapPin } from "lucide-react";
import { CLINIC } from "../../config/clinic.js";

export default function PublicFooter() {
  return (
    <footer className="border-t border-[#0EA5E9]/10 bg-white/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 py-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0EA5E9] to-[#0284C7] flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-bold text-[#0F172A]">{CLINIC.name}</h3>
          </div>
          <p className="text-sm text-[#64748B]">{CLINIC.tagline}. Modern, trustworthy dental care for the whole family.</p>
        </div>

        <div>
          <h4 className="font-semibold text-[#0F172A] mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm text-[#64748B]">
            <li><Link to="/about" className="hover:text-[#0EA5E9]">About Us</Link></li>
            <li><Link to="/services" className="hover:text-[#0EA5E9]">Services</Link></li>
            <li><Link to="/doctors" className="hover:text-[#0EA5E9]">Our Dentists</Link></li>
            <li><Link to="/faq" className="hover:text-[#0EA5E9]">FAQ</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-[#0F172A] mb-4">Legal</h4>
          <ul className="space-y-2 text-sm text-[#64748B]">
            <li><Link to="/privacy" className="hover:text-[#0EA5E9]">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-[#0EA5E9]">Terms &amp; Conditions</Link></li>
            <li><Link to="/contact" className="hover:text-[#0EA5E9]">Contact Us</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-[#0F172A] mb-4">Contact</h4>
          <ul className="space-y-3 text-sm text-[#64748B]">
            <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-[#0EA5E9]" /> {CLINIC.phone}</li>
            <li className="flex items-center gap-2"><Mail className="w-4 h-4 text-[#0EA5E9]" /> {CLINIC.email}</li>
            <li className="flex items-start gap-2"><MapPin className="w-4 h-4 text-[#0EA5E9] mt-0.5 flex-shrink-0" /> {CLINIC.address}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-[#0EA5E9]/10">
        <p className="max-w-7xl mx-auto px-6 py-6 text-center text-sm text-[#64748B]">
          © {new Date().getFullYear()} {CLINIC.name}. All rights reserved. | Professional Dental Services
        </p>
      </div>
    </footer>
  );
}
