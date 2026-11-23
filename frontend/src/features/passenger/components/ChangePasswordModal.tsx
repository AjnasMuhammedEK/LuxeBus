import { useEffect, useState } from "react";
import { X, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { changeMyPassword } from "@/features/passenger/services/passengerService";

interface Props {
  onClose: () => void;
  onChanged: () => void;
}

type FieldName = "currentPassword" | "newPassword" | "confirmPassword";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-3.5 pr-10 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100";

const FIELDS: { name: FieldName; label: string; placeholder: string }[] = [
  {
    name: "currentPassword",
    label: "Current Password",
    placeholder: "Enter current password",
  },
  {
    name: "newPassword",
    label: "New Password",
    placeholder: "Enter new password",
  },
  {
    name: "confirmPassword",
    label: "Confirm New Password",
    placeholder: "Re-enter new password",
  },
];

const ChangePasswordModal = ({ onClose, onChanged }: Props) => {
  const [form, setForm] = useState<Record<FieldName, string>>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [visible, setVisible] = useState<Record<FieldName, boolean>>({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name as FieldName;
    setForm((f) => ({ ...f, [name]: e.target.value }));
    setErrors((er) => ({ ...er, [name]: "" }));
  };

  const validate = () => {
    const next: Partial<Record<FieldName, string>> = {};

    if (!form.currentPassword) next.currentPassword = "Enter your current password";

    if (form.newPassword.length < 8)
      next.newPassword = "Password must be at least 8 characters";
    else if (!/[A-Za-z]/.test(form.newPassword) || !/[0-9]/.test(form.newPassword))
      next.newPassword = "Use both letters and numbers";
    else if (form.newPassword === form.currentPassword)
      next.newPassword = "New password must be different from current";

    if (form.confirmPassword !== form.newPassword)
      next.confirmPassword = "Passwords do not match";

    setErrors(next);
    return Object.keys(next).length === 0;
  };

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  if (!validate()) return;

  try {
    setSaving(true);

    const response = await changeMyPassword({
      currentPassword: form.currentPassword,
      newPassword: form.newPassword,
    });

    if (!response.success) {
      toast.error(response.message || "Password change failed");
      return;
    }

    toast.success(response.message || "Password changed successfully");

    onChanged();
    onClose();

  } catch (error: any) {
    toast.error(
      error.response?.data?.message ||
      "Unable to change password. Please try again."
    );
  } finally {
    setSaving(false);
  }
};
 

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between bg-blue-950 px-6 py-4">
          <h2 className="text-base font-semibold text-white">
            Change Password
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-blue-200 hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6">
          {FIELDS.map((f) => (
            <div key={f.name}>
              <label className="mb-1.5 block text-xs font-medium text-slate-500">
                {f.label}
              </label>
              <div className="relative">
                <input
                  name={f.name}
                  type={visible[f.name] ? "text" : "password"}
                  value={form[f.name]}
                  onChange={handleChange}
                  placeholder={f.placeholder}
                  autoComplete={
                    f.name === "currentPassword"
                      ? "current-password"
                      : "new-password"
                  }
                  className={inputClass}
                />
                <button
                  type="button"
                  onClick={() =>
                    setVisible((v) => ({ ...v, [f.name]: !v[f.name] }))
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  aria-label={visible[f.name] ? "Hide password" : "Show password"}
                >
                  {visible[f.name] ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors[f.name] && (
                <p className="mt-1 text-xs text-red-600">{errors[f.name]}</p>
              )}
            </div>
          ))}

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
              {saving ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;