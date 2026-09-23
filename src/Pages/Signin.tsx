import { Link, useNavigate, useLocation } from "react-router";
import { motion } from "motion/react";
import { useState } from "react";
import { ShieldCheck, Mail, Lock, Loader2, ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { AuthApi } from "../api/auth.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { CLINIC } from "../config/clinic.js";

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
      <div className="hidden lg:flex flex-col justify-center bg-ink-900 p-16 relative">
        <div className="max-w-sm">
          <span className="w-2.5 h-2.5 rounded-full bg-brand-400 inline-block mb-6" aria-hidden="true" />
          <h1 className="font-serif text-4xl font-semibold text-white mb-4 leading-tight">{CLINIC.name}</h1>
          <p className="text-lg text-ink-300 mb-10">Your Health, Our Mission.</p>

          <div className="flex items-start gap-4 p-5 rounded-lg bg-white/5 border border-white/10">
            <ShieldCheck className="w-6 h-6 text-brand-400 shrink-0 mt-0.5" />
            <div className="text-left">
              <p className="font-semibold text-white text-sm">Secure &amp; Private</p>
              <p className="text-sm text-ink-400 mt-1">Passwords are hashed and your medical records stay visible to you and your care team only.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <Link to="/" className="inline-flex items-center gap-2 text-sm text-ink-500 hover:text-ink-900 transition-colors mb-6">
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Link>
            <h2 className="text-3xl font-serif font-semibold text-ink-900 mb-2">Welcome Back</h2>
            <p className="text-ink-500 text-sm">Sign in as a patient or clinic admin &mdash; your role is detected from your account.</p>
          </div>

          {serverError && (
            <div className="mb-6 p-4 rounded-md bg-danger-50 border border-danger-600/15 text-sm text-danger-600">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(handleLogin)} className="space-y-5" noValidate>
            <div>
              <label className="field-label">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-ink-400" />
                <input
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: { value: /^\S+@\S+$/i, message: "Invalid email format" },
                  })}
                  placeholder="your@email.com"
                  className="input-field pl-10"
                />
              </div>
              {errors.email && <p className="field-error">{errors.email.message}</p>}
            </div>

            <div>
              <label className="field-label">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-ink-400" />
                <input
                  type="password"
                  {...register("password", { required: "Password is required" })}
                  placeholder="••••••••"
                  className="input-field pl-10"
                />
              </div>
              {errors.password && <p className="field-error">{errors.password.message}</p>}
            </div>

            <button type="submit" disabled={submitting} className="btn btn-primary w-full py-3.5">
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {submitting ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-ink-500">
            Don't have an account?{" "}
            <Link to="/signup" className="text-brand-700 hover:text-brand-800 font-semibold">
              Sign up
            </Link>
          </p>

          <div className="mt-6 p-4 rounded-md bg-ink-50 border border-ink-200 text-xs text-ink-500">
            Demo admin login: <span className="font-mono">admin@dentalcare.com</span> / <span className="font-mono">Admin@123</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
