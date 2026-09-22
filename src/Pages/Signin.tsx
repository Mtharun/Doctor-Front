import { Link, useNavigate, useLocation } from "react-router";
import { motion } from "motion/react";
import { useState } from "react";
import { Shield, Mail, Lock, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { AuthApi } from "../api/auth.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";

type LoginFormData = {
  email: string;
  password: string;
};

export default function Signin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const toast = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const handleLogin = async (data: LoginFormData) => {
    setServerError("");
    setSubmitting(true);
    try {
      const res = await AuthApi.login(data);
      login(res.token, res.user);
      toast.success(`Welcome back, ${res.user.name.split(" ")[0]}!`);
      const fallback = `/${res.user.role}/dashboard`;
      navigate(location.state?.from || fallback, { replace: true });
    } catch (err) {
      setServerError(err.message || "Unable to sign in. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Side - Branding */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        className="hidden lg:flex flex-col justify-center items-center bg-gradient-to-br from-[#0EA5E9] via-[#0284C7] to-[#0369A1] p-12 relative overflow-hidden"
      >
        <div className="absolute top-20 left-20 w-32 h-32 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-20 right-20 w-48 h-48 rounded-full bg-white/10 blur-3xl" />

        <div className="relative z-10 text-center">
          <motion.div
            animate={{ rotate: [0, 5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="w-32 h-32 mx-auto mb-8 rounded-3xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-2xl"
          >
            <Shield className="w-16 h-16 text-white" />
          </motion.div>

          <h1 className="text-5xl font-bold text-white mb-4">DentalCare</h1>
          <p className="text-2xl text-white/90 mb-8">Your Health, Our Mission</p>

          <div className="space-y-4 max-w-md mx-auto">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/10 backdrop-blur-sm">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-white">Secure &amp; Private</p>
                <p className="text-sm text-white/80">Your data is encrypted end to end</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Right Side - Login Form */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center justify-center p-8 bg-gradient-to-br from-[#F8FAFC] to-[#EFF6FF]"
      >
        <div className="w-full max-w-md">
          <div className="mb-8">
            <Link to="/" className="inline-flex items-center gap-2 text-[#0EA5E9] hover:text-[#0284C7] transition-colors mb-6">
              <span>← Back to Home</span>
            </Link>
            <h2 className="text-4xl font-bold text-[#0F172A] mb-2">Welcome Back</h2>
            <p className="text-[#64748B]">Sign in as a patient or clinic admin - your role is detected from your account.</p>
          </div>

          {serverError && (
            <div className="mb-6 p-4 rounded-xl bg-[#FEF2F2] border border-[#EF4444]/20 text-sm text-[#EF4444]">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(handleLogin)} className="space-y-6" noValidate>
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
                  className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] focus:border-transparent transition-all"
                />
              </div>
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0F172A] mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748B]" />
                <input
                  type="password"
                  {...register("password", { required: "Password is required" })}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] focus:border-transparent transition-all"
                />
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-[#0EA5E9] to-[#0284C7] text-white font-semibold hover:shadow-lg hover:shadow-[#0EA5E9]/30 transition-all hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {submitting ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="mt-8 text-center text-[#64748B]">
            Don't have an account?{" "}
            <Link to="/signup" className="text-[#0EA5E9] hover:text-[#0284C7] font-semibold">
              Sign up
            </Link>
          </p>

          <div className="mt-6 p-4 rounded-xl bg-[#0EA5E9]/5 text-xs text-[#64748B]">
            Demo admin login: <span className="font-mono">admin@dentalcare.com</span> / <span className="font-mono">Admin@123</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
