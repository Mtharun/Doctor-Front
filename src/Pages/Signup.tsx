import { Link, useNavigate } from "react-router";
import { motion } from "motion/react";
import { useState } from "react";
import { Shield, Mail, Lock, User, Phone, Calendar, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { AuthApi } from "../api/auth.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";

type SignupFormData = {
  name: string;
  age: number;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
  medicalHistory: string;
  terms: boolean;
};

export default function Signup() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const toast = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<SignupFormData>({
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: { terms: false },
  });

  const password = watch("password");

  const handleSignup = async (data: SignupFormData) => {
    setServerError("");
    setSubmitting(true);
    try {
      const res = await AuthApi.register({
        name: data.name,
        email: data.email,
        password: data.password,
        phone: data.phone,
        age: data.age,
        medicalHistory: data.medicalHistory || undefined,
      });
      login(res.token, res.user);
      toast.success(`Welcome to DentalCare, ${res.user.name.split(" ")[0]}!`);
      navigate("/patient/dashboard", { replace: true });
    } catch (err) {
      setServerError(err.message || "Unable to create your account. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8FAFC] via-[#EFF6FF] to-[#F0F9FF]">
      <div className="max-w-2xl mx-auto px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Link to="/" className="inline-flex items-center gap-2 text-[#0EA5E9] hover:text-[#0284C7] transition-colors mb-6">
            <span>← Back to Home</span>
          </Link>

          <div className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0EA5E9] to-[#0284C7] flex items-center justify-center shadow-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-[#0F172A]">Create Account</h1>
                <p className="text-[#64748B]">Join DentalCare today</p>
              </div>
            </div>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white">
            {serverError && (
              <div className="mb-6 p-4 rounded-xl bg-[#FEF2F2] border border-[#EF4444]/20 text-sm text-[#EF4444]">
                {serverError}
              </div>
            )}

            <form onSubmit={handleSubmit(handleSignup)} className="space-y-6" noValidate>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#0F172A] mb-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748B]" />
                    <input
                      type="text"
                      {...register("name", { required: "Name is required" })}
                      placeholder="Name"
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] focus:border-transparent transition-all"
                    />
                  </div>
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#0F172A] mb-2">Age</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748B]" />
                    <input
                      type="number"
                      {...register("age", { required: "Age is required", min: { value: 1, message: "Invalid age" }, max: { value: 120, message: "Invalid age" } })}
                      placeholder="e.g. 28"
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] focus:border-transparent transition-all"
                    />
                  </div>
                  {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age.message}</p>}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#0F172A] mb-2">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748B]" />
                    <input
                      type="tel"
                      {...register("phone", {
                        required: "Phone is required",
                        pattern: { value: /^[0-9+\-\s]{7,15}$/, message: "Enter a valid phone number" },
                      })}
                      placeholder="9876543210"
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] focus:border-transparent transition-all"
                    />
                  </div>
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#0F172A] mb-2">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748B]" />
                    <input
                      type="email"
                      {...register("email", {
                        required: "Email is required",
                        pattern: { value: /^\S+@\S+$/i, message: "Invalid email format" },
                      })}
                      placeholder="your@email.com"
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] focus:border-transparent transition-all"
                    />
                  </div>
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0F172A] mb-2">Medical History (Optional)</label>
                <select
                  {...register("medicalHistory")}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] focus:border-transparent transition-all"
                >
                  <option value="">Select if applicable</option>
                  <option value="diabetes">Diabetes</option>
                  <option value="hypertension">Hypertension</option>
                  <option value="heart">Heart Condition</option>
                  <option value="allergies">Allergies</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#0F172A] mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748B]" />
                    <input
                      type="password"
                      {...register("password", { required: "Password is required", minLength: { value: 6, message: "Minimum 6 characters required" } })}
                      placeholder="......"
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] focus:border-transparent transition-all"
                    />
                  </div>
                  {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#0F172A] mb-2">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748B]" />
                    <input
                      type="password"
                      {...register("confirmPassword", {
                        required: "Confirm password required",
                        validate: (value) => value === password || "Passwords do not match",
                      })}
                      placeholder="......"
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] focus:border-transparent transition-all"
                    />
                  </div>
                  {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  {...register("terms", { required: "You must accept terms" })}
                  className="mt-1 w-4 h-4 rounded border-gray-300 text-[#0EA5E9] focus:ring-[#0EA5E9]"
                />
                <p className="text-sm text-[#64748B]">
                  I agree to the{" "}
                  <Link to="/terms" className="text-[#0EA5E9] hover:text-[#0284C7]">Terms of Service</Link> and{" "}
                  <Link to="/privacy" className="text-[#0EA5E9] hover:text-[#0284C7]">Privacy Policy</Link>
                </p>
              </div>
              {errors.terms && <p className="text-red-500 text-xs">{errors.terms.message}</p>}

              <button
                type="submit"
                disabled={!isValid || submitting}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-[#0EA5E9] to-[#0284C7] text-white font-semibold hover:shadow-lg hover:shadow-[#0EA5E9]/30 transition-all hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100 flex items-center justify-center gap-2"
              >
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {submitting ? "Creating Account..." : "Create Account"}
              </button>
            </form>

            <p className="mt-6 text-center text-[#64748B]">
              Already have an account?{" "}
              <Link to="/login" className="text-[#0EA5E9] hover:text-[#0284C7] font-semibold">Sign in</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
