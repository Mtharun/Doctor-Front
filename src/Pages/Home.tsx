import { Link } from "react-router";
import { motion } from "motion/react";
import { Calendar, Shield, Clock, Award, Phone, Mail, MapPin, AlertCircle, Star } from "lucide-react";
import { CLINIC } from "../config/clinic.js";

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-16 sm:py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#DBEAFE] text-[#0EA5E9] mb-6">
              <Award className="w-4 h-4" />
              <span className="text-sm font-medium">Trusted Dental Care</span>
            </div>

            <h2 className="text-4xl sm:text-6xl font-bold text-[#0F172A] mb-6 leading-tight">
              Your Smile,
              <br />
              <span className="bg-gradient-to-r from-[#0EA5E9] to-[#0284C7] bg-clip-text text-transparent">
                Our Priority
              </span>
            </h2>

            <p className="text-lg sm:text-xl text-[#64748B] mb-8 leading-relaxed">
              Book appointments, access emergency care, and manage your dental health all in one place.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/signup"
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#0EA5E9] to-[#0284C7] text-white text-lg text-center hover:shadow-2xl hover:shadow-[#0EA5E9]/30 transition-all hover:scale-105"
              >
                Book Appointment
              </Link>

              <Link
                to="/patient/emergency"
                className="group px-8 py-4 rounded-2xl bg-gradient-to-r from-[#EF4444] to-[#DC2626] text-white text-lg hover:shadow-2xl hover:shadow-[#EF4444]/30 transition-all relative overflow-hidden text-center"
              >
                <motion.div
                  className="absolute inset-0 bg-white/20"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="relative flex items-center justify-center gap-2">
                  <AlertCircle className="w-5 h-5 animate-pulse" />
                  Emergency
                </span>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <div className="aspect-[4/3] bg-gradient-to-br from-[#0EA5E9]/20 to-[#22C55E]/20 flex items-center justify-center">
                <div className="text-center p-12 bg-white/80 backdrop-blur-sm rounded-3xl">
                  <Shield className="w-24 h-24 sm:w-32 sm:h-32 mx-auto text-[#0EA5E9] mb-4" />
                  <h3 className="text-2xl sm:text-3xl font-bold text-[#0F172A]">Premium Care</h3>
                  <p className="text-[#64748B] mt-2">Advanced Dental Technology</p>
                </div>
              </div>
            </div>

            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="hidden sm:block absolute -top-6 -right-6 bg-white rounded-2xl p-6 shadow-xl"
            >
              <Calendar className="w-8 h-8 text-[#0EA5E9] mb-2" />
              <p className="font-semibold text-[#0F172A]">Easy Booking</p>
            </motion.div>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
              className="hidden sm:block absolute -bottom-6 -left-6 bg-white rounded-2xl p-6 shadow-xl"
            >
              <Clock className="w-8 h-8 text-[#22C55E] mb-2" />
              <p className="font-semibold text-[#0F172A]">24/7 Emergency Line</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-16">
          <h3 className="text-3xl sm:text-4xl font-bold text-[#0F172A] mb-4">Why Choose {CLINIC.name}?</h3>
          <p className="text-lg sm:text-xl text-[#64748B]">Modern solutions for modern dental care</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group p-8 rounded-3xl bg-white/60 backdrop-blur-sm border border-white hover:shadow-2xl transition-all hover:scale-105 hover:border-[#0EA5E9]/20"
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-2xl font-bold text-[#0F172A] mb-3">{feature.title}</h4>
              <p className="text-[#64748B] leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-16">
          <h3 className="text-3xl sm:text-4xl font-bold text-[#0F172A] mb-4">What Our Patients Say</h3>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 rounded-3xl bg-white/60 backdrop-blur-sm border border-white"
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star key={s} className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]" />
                ))}
              </div>
              <p className="text-[#64748B] mb-4 leading-relaxed">"{t.quote}"</p>
              <p className="font-semibold text-[#0F172A]">{t.name}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="bg-gradient-to-br from-[#0EA5E9] to-[#0284C7] rounded-3xl p-8 sm:p-12 text-white shadow-2xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl sm:text-4xl font-bold mb-4">Get In Touch</h3>
              <p className="text-white/90 text-lg mb-8">We're here to help</p>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-semibold">Phone</p>
                    <p className="text-white/80">{CLINIC.phone}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-semibold">Email</p>
                    <p className="text-white/80">{CLINIC.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-semibold">Location</p>
                    <p className="text-white/80">{CLINIC.address}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
              <h4 className="text-2xl font-bold mb-6">Quick Links</h4>
              <div className="grid grid-cols-2 gap-4">
                <Link to="/signup" className="px-6 py-3 rounded-xl bg-white/20 hover:bg-white/30 transition-all text-center">
                  Patient Portal
                </Link>
                <Link to="/login" className="px-6 py-3 rounded-xl bg-white/20 hover:bg-white/30 transition-all text-center">
                  Admin Login
                </Link>
                <Link to="/services" className="px-6 py-3 rounded-xl bg-white/20 hover:bg-white/30 transition-all text-center">
                  Our Services
                </Link>
                <Link to="/patient/emergency" className="px-6 py-3 rounded-xl bg-[#EF4444] hover:bg-[#DC2626] transition-all text-center">
                  Emergency
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

const features = [
  {
    icon: Calendar,
    title: "Easy Booking",
    description: "Schedule appointments in seconds with our intuitive booking system. Choose your preferred dentist and time slot instantly.",
    gradient: "from-[#0EA5E9] to-[#0284C7]",
  },
  {
    icon: AlertCircle,
    title: "Emergency Care",
    description: "Fast emergency response system. Get immediate attention when you need it most with priority alerts to our team.",
    gradient: "from-[#EF4444] to-[#DC2626]",
  },
  {
    icon: Shield,
    title: "Secure Records",
    description: "Your medical records are securely stored and access-controlled. View your reports anytime, anywhere.",
    gradient: "from-[#22C55E] to-[#16A34A]",
  },
];

const testimonials = [
  { name: "Aarav Mehta", quote: "Booking an appointment took less than two minutes. The reminders and clear status updates made the whole process stress-free." },
  { name: "Priya Nair", quote: "I used the emergency request late at night and the clinic team called me back quickly. Genuinely reassuring." },
  { name: "Rohan Das", quote: "Being able to see my reports and appointment history in one dashboard is exactly what I wanted from a dental portal." },
];
