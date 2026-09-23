import { Link, useNavigate } from "react-router";
import { motion } from "motion/react";
import { useState } from "react";
import { ShieldCheck, Mail, Lock, User, Phone, Calendar, Loader2, ArrowLeft } from "lucide-react";
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
    <div className="min-h-screen bg-sand-50">
      <div className="max-w-2xl mx-auto px-6 py-14">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-ink-500 hover:text-ink-900 transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>

          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-md bg-brand-50 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 text-brand-700" />
            </div>
            <div>
              <h1 className="text-3xl font-serif font-semibold text-ink-900">Create Account</h1>
              <p className="text-ink-500 text-sm">Join DentalCare today</p>
            </div>
          </div>

          <div className="card p-8">
            {serverError && (
              <div className="mb-6 p-4 rounded-md bg-danger-50 border border-danger-600/15 text-sm text-danger-600">
                {serverError}
              </div>
            )}

            <form onSubmit={handleSubmit(handleSignup)} className="space-y-5" noValidate>
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="field-label">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-ink-400" />
                    <input
                      type="text"
                      {...register("name", { required: "Name is required" })}
                      placeholder="Name"
                      className="input-field pl-10"
                    />
                  </div>
                  {errors.name && <p className="field-error">{errors.name.message}</p>}
                </div>

                <div>
                  <label className="field-label">Age</label>
                  <div className="relative">
                    <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-ink-400" />
                    <input
                      type="number"
                      {...register("age", { required: "Age is required", min: { value: 1, message: "Invalid age" }, max: { value: 120, message: "Invalid age" } })}
                      placeholder="e.g. 28"
                      className="input-field pl-10"
                    />
                  </div>
                  {errors.age && <p className="field-error">{errors.age.message}</p>}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="field-label">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-ink-400" />
                    <input
                      type="tel"
                      {...register("phone", {
                        required: "Phone is required",
                        pattern: { value: /^[0-9+\-\s]{7,15}$/, message: "Enter a valid phone number" },
                      })}
                      placeholder="9876543210"
                      className="input-field pl-10"
                    />
                  </div>
                  {errors.phone && <p className="field-error">{errors.phone.message}</p>}
                </div>

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
              </div>

              <div>
                <label className="field-label">Medical History (Optional)</label>
                <select {...register("medicalHistory")} className="input-field">
                  <option value="">Select if applicable</option>
                  <option value="diabetes">Diabetes</option>
                  <option value="hypertension">Hypertension</option>
                  <option value="heart">Heart Condition</option>
                  <option value="allergies">Allergies</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="field-label">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-ink-400" />
                    <input
                      type="password"
                      {...register("password", { required: "Password is required", minLength: { value: 6, message: "Minimum 6 characters required" } })}
                      placeholder="......"
                      className="input-field pl-10"
                    />
                  </div>
                  {errors.password && <p className="field-error">{errors.password.message}</p>}
                </div>

                <div>
                  <label className="field-label">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-ink-400" />
                    <input
                      type="password"
                      {...register("confirmPassword", {
                        required: "Confirm password required",
                        validate: (value) => value === password || "Passwords do not match",
                      })}
                      placeholder="......"
                      className="input-field pl-10"
                    />
                  </div>
                  {errors.confirmPassword && <p className="field-error">{errors.confirmPassword.message}</p>}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  {...register("terms", { required: "You must accept terms" })}
                  className="mt-1 w-4 h-4 rounded border-ink-300 text-brand-600 focus:ring-brand-500"
                />
                <p className="text-sm text-ink-500">
                  I agree to the{" "}
                  <Link to="/terms" className="text-brand-700 hover:text-brand-800">Terms of Service</Link> and{" "}
                  <Link to="/privacy" className="text-brand-700 hover:text-brand-800">Privacy Policy</Link>
                </p>
              </div>
              {errors.terms && <p className="field-error">{errors.terms.message}</p>}

              <button type="submit" disabled={!isValid || submitting} className="btn btn-primary w-full py-3.5">
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {submitting ? "Creating Account..." : "Create Account"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-ink-500">
              Already have an account?{" "}
              <Link to="/login" className="text-brand-700 hover:text-brand-800 font-semibold">Sign in</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
