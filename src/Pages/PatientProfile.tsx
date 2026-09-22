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
    <div className="max-w-3xl mx-auto px-6 py-8 sm:py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-[#0F172A] mb-2">My Profile</h1>
        <p className="text-[#64748B]">Update your personal information</p>
      </motion.div>

      <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-xl border border-white mb-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0EA5E9] to-[#0284C7] flex items-center justify-center">
            <User className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-[#0F172A] text-lg">{user?.name}</h3>
            <p className="text-sm text-[#64748B]">{user?.email}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSaveProfile)} className="space-y-5" noValidate>
          <div>
            <label className="block text-sm font-medium text-[#0F172A] mb-2">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748B]" />
              <input {...register("name", { required: "Name is required" })} className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]" />
            </div>
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-[#0F172A] mb-2">Phone</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748B]" />
                <input {...register("phone", { pattern: { value: /^[0-9+\-\s]{7,15}$/, message: "Enter a valid phone number" } })} className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]" />
              </div>
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-[#0F172A] mb-2">Age</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748B]" />
                <input type="number" {...register("age", { min: { value: 1, message: "Invalid age" }, max: { value: 120, message: "Invalid age" } })} className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]" />
              </div>
              {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#0F172A] mb-2">Medical History</label>
            <select {...register("medicalHistory")} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]">
              <option value="">None</option>
              <option value="diabetes">Diabetes</option>
              <option value="hypertension">Hypertension</option>
              <option value="heart">Heart Condition</option>
              <option value="allergies">Allergies</option>
              <option value="other">Other</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={savingProfile || !isDirty}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#0EA5E9] to-[#0284C7] text-white font-semibold hover:shadow-lg transition-all disabled:opacity-50"
          >
            {savingProfile && <Loader2 className="w-4 h-4 animate-spin" />}
            {savingProfile ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>

      <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-xl border border-white">
        <h3 className="font-bold text-[#0F172A] text-lg mb-6 flex items-center gap-2">
          <Lock className="w-5 h-5 text-[#0EA5E9]" /> Change Password
        </h3>
        <form onSubmit={handlePwSubmit(onChangePassword)} className="space-y-5" noValidate>
          <div>
            <label className="block text-sm font-medium text-[#0F172A] mb-2">Current Password</label>
            <input type="password" {...registerPw("currentPassword", { required: "Current password is required" })} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]" />
            {pwErrors.currentPassword && <p className="text-red-500 text-sm mt-1">{pwErrors.currentPassword.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-[#0F172A] mb-2">New Password</label>
            <input type="password" {...registerPw("newPassword", { required: "New password is required", minLength: { value: 6, message: "Minimum 6 characters" } })} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]" />
            {pwErrors.newPassword && <p className="text-red-500 text-sm mt-1">{pwErrors.newPassword.message}</p>}
          </div>
          <button
            type="submit"
            disabled={savingPassword}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 border-[#0EA5E9] text-[#0EA5E9] font-semibold hover:bg-[#0EA5E9]/5 transition-all disabled:opacity-50"
          >
            {savingPassword && <Loader2 className="w-4 h-4 animate-spin" />}
            {savingPassword ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
