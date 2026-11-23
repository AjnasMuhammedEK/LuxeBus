
import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";

import { updateMyProfile } from "@/features/passenger/services/passengerService";
import type { IUser } from "@/types/user.types";

interface Props {
  profile: IUser;
  onClose: () => void;
  onUpdated: (updated: IUser) => void;
}

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500";

const EditProfileModal = ({ profile, onClose, onUpdated }: Props) => {
  const [form, setForm] = useState({
    name: profile.name,
    phone: profile.phone,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  // Close modal when Escape is pressed
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !saving) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, saving]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validate = () => {
    const nextErrors: Record<string, string> = {};

    if (form.name.trim().length < 2) {
      nextErrors.name = "Enter your full name";
    }

    const phone = form.phone.trim();
    const digitsOnly = phone.replace(/\D/g, "");

    if (
      !/^\+?[0-9\s-]+$/.test(phone) ||
      digitsOnly.length < 10 ||
      digitsOnly.length > 15
    ) {
      nextErrors.phone = "Enter a valid phone number";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setSaving(true);

      const response = await updateMyProfile({
        name: form.name.trim(),
        phone: form.phone.trim(),
      });

      if (!response.success) {
        toast.error(response.message || "Profile update failed");
        return;
      }

      toast.success(response.message || "Profile updated successfully");

      // Send updated user details to the parent component
      onUpdated(response.data);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          "Unable to update profile. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !saving) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between bg-blue-950 px-6 py-4">
          <h2 className="text-base font-semibold text-white">
            Edit Profile
          </h2>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-full p-1 text-blue-200 hover:bg-white/10 hover:text-white disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6">
          {/* Full Name */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-500">
              Full Name
            </label>

            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className={inputClass}
              placeholder="Your full name"
              disabled={saving}
            />

            {errors.name && (
              <p className="mt-1 text-xs text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-500">
              Email Address (cannot be changed)
            </label>

            <input
              value={profile.email}
              disabled
              className={inputClass}
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-500">
              Phone Number
            </label>

            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className={inputClass}
              placeholder="+91 98765 43210"
              disabled={saving}
            />

            {errors.phone && (
              <p className="mt-1 text-xs text-red-600">{errors.phone}</p>
            )}
          </div>

          {/* Actions */}
          <div className="mt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-blue-950 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-900 disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
