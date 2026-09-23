import { useState } from "react";
import { motion } from "motion/react";
import { User, Phone, Calendar, Loader2, Lock } from "lucide-react";
import { useForm } from "react-hook-form";
import { AuthApi } from "../api/auth.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";

export default function PatientProfile() {
  const { user, updateUser } = useAuth();
  const toast = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: {
      name: user?.name || "",
      phone: user?.phone || "",
      age: user?.age || "",
      medicalHistory: user?.medicalHistory || "",
    },
  });

  const [savingProfile, setSavingProfile] = useState(false);

  const onSaveProfile = async (data) => {
    setSavingProfile(true);
    try {
      const res = await AuthApi.updateProfile(data);
      updateUser(res.user);
      toast.success("Profile updated.");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSavingProfile(false);
    }
  };

  const {
    register: registerPw,
    handleSubmit: handlePwSubmit,
    reset: resetPw,
    formState: { errors: pwErrors },
  } = useForm();
  const [savingPassword, setSavingPassword] = useState(false);

  const onChangePassword = async (data) => {
    setSavingPassword(true);
    try {
      await AuthApi.changePassword(data);
      toast.success("Password updated.");
      resetPw();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="container-page max-w-3xl py-8 sm:py-12">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-serif font-semibold text-ink-900 mb-1">My Profile</h1>
        <p className="text-ink-500">Update your personal information</p>
      </motion.div>

      <div className="card p-6 sm:p-8 mb-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-full bg-brand-100 flex items-center justify-center shrink-0">
            <User className="w-6 h-6 text-brand-700" />
          </div>
          <div>
            <h3 className="font-semibold text-ink-900">{user?.name}</h3>
            <p className="text-sm text-ink-500">{user?.email}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSaveProfile)} className="space-y-5" noValidate>
          <div>
            <label className="field-label">Full Name</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-ink-400" />
              <input {...register("name", { required: "Name is required" })} className="input-field pl-10" />
            </div>
            {errors.name && <p className="field-error">{errors.name.message}</p>}
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="field-label">Phone</label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-ink-400" />
                <input {...register("phone", { pattern: { value: /^[0-9+\-\s]{7,15}$/, message: "Enter a valid phone number" } })} className="input-field pl-10" />
              </div>
              {errors.phone && <p className="field-error">{errors.phone.message}</p>}
            </div>
            <div>
              <label className="field-label">Age</label>
              <div className="relative">
                <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-ink-400" />
                <input type="number" {...register("age", { min: { value: 1, message: "Invalid age" }, max: { value: 120, message: "Invalid age" } })} className="input-field pl-10" />
              </div>
              {errors.age && <p className="field-error">{errors.age.message}</p>}
            </div>
          </div>

          <div>
            <label className="field-label">Medical History</label>
            <select {...register("medicalHistory")} className="input-field">
              <option value="">None</option>
              <option value="diabetes">Diabetes</option>
              <option value="hypertension">Hypertension</option>
              <option value="heart">Heart Condition</option>
              <option value="allergies">Allergies</option>
              <option value="other">Other</option>
            </select>
          </div>

          <button type="submit" disabled={savingProfile || !isDirty} className="btn btn-primary">
            {savingProfile && <Loader2 className="w-4 h-4 animate-spin" />}
            {savingProfile ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>

      <div className="card p-6 sm:p-8">
        <h3 className="font-semibold text-ink-900 mb-6 flex items-center gap-2">
          <Lock className="w-5 h-5 text-brand-600" /> Change Password
        </h3>
        <form onSubmit={handlePwSubmit(onChangePassword)} className="space-y-5" noValidate>
          <div>
            <label className="field-label">Current Password</label>
            <input type="password" {...registerPw("currentPassword", { required: "Current password is required" })} className="input-field" />
            {pwErrors.currentPassword && <p className="field-error">{pwErrors.currentPassword.message}</p>}
          </div>
          <div>
            <label className="field-label">New Password</label>
            <input type="password" {...registerPw("newPassword", { required: "New password is required", minLength: { value: 6, message: "Minimum 6 characters" } })} className="input-field" />
            {pwErrors.newPassword && <p className="field-error">{pwErrors.newPassword.message}</p>}
          </div>
          <button type="submit" disabled={savingPassword} className="btn btn-outline">
            {savingPassword && <Loader2 className="w-4 h-4 animate-spin" />}
            {savingPassword ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
