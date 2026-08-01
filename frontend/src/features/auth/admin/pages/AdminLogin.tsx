import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck } from "lucide-react";
import type { UserLoginFormData } from "@/types/auth.types";
import {
  AdminLoginSchema,
  getValidationErrors,
} from "@/features/auth/admin/validation/AdminAuthValidation";
import { adminLogin } from "../../services/authService";
import { setAdmin } from "@/redux/slice/adminAuthSlice";  

type FormErrors = Partial<Record<keyof UserLoginFormData, string>>;

const SuperAdminLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState<UserLoginFormData>({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => {
      if (!prev[name as keyof UserLoginFormData]) return prev;

      const next = { ...prev };
      delete next[name as keyof UserLoginFormData];
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = getValidationErrors(AdminLoginSchema, formData);

    if (!result.success) {
      setErrors(result.errors as FormErrors);
      toast.error(Object.values(result.errors)[0] as string);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const response = await adminLogin(result.data);

      dispatch(
        setAdmin({
          admin: response.user,
          token: response.token,
        })
      );

      toast.success(response.message);

      navigate("/admin/dashboard");
    } catch (error: any) {
      const message =
        error?.response?.data?.message ?? error?.message ?? "Login failed";

      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="flex min-h-screen w-full items-center justify-center bg-slate-50 px-4 py-10 sm:px-6">
      <div className="mx-auto grid w-full max-w-4xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl lg:grid-cols-2">
        {/* Left panel - brand / value prop, hidden on mobile */}
        <div className="relative hidden flex-col justify-between overflow-hidden bg-[#0b1437] p-10 lg:flex">
          <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />
          <div className="absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-purple-500/20 blur-3xl" />

          <div className="relative z-10">
            <img src="/logo.png" alt="LuxeBus" className="h-10 w-auto object-contain" />
          </div>

          <div className="relative z-10">
            <ShieldCheck className="h-8 w-8 text-emerald-400" />
            <h1 className="mt-4 text-3xl font-bold leading-tight text-white">
              Global operations,
              <br />
              one dashboard.
            </h1>
            <p className="mt-4 max-w-sm text-sm text-blue-100/80">
              Monitor fleets, operators, and bookings across every region from a
              single, secure control center.
            </p>
          </div>

          <p className="relative z-10 text-xs text-blue-100/60">
            &copy; {new Date().getFullYear()} LuxeBus Global Operations. Version 2.4.0-admin
          </p>
        </div>

        {/* Right panel - form */}
        <div className="flex flex-col justify-center p-8 sm:p-10">
          <h2 className="text-lg font-semibold text-gray-900">Super Admin Login</h2>
          <p className="mt-1 text-sm text-gray-500">
            Access the global operations dashboard
          </p>

          <form onSubmit={handleSubmit} className="mt-7 flex flex-col gap-4" noValidate>
            {/* Email */}
            <label className="flex flex-col gap-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                Email Address
              </span>
              <div className="flex h-[42px] items-center gap-2 rounded-lg border border-gray-200 bg-slate-50 px-3 ring-1 ring-transparent transition-shadow focus-within:border-[#0b1437] focus-within:ring-indigo-100">
                <Mail className="h-4 w-4 shrink-0 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="admin@luxebus.com"
                  className="w-full bg-transparent text-sm font-medium text-gray-900 outline-none placeholder:text-gray-400"
                />
              </div>
              {errors.email && (
                <span className="text-xs text-red-500">{errors.email}</span>
              )}
            </label>

            {/* Password */}
            <label className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                  Password
                </span>
                <Link
                  to="/forgot-password"
                  className="text-xs font-semibold text-emerald-700 hover:underline"
                >
                  Forget Password?
                </Link>
              </div>
              <div className="flex h-[42px] items-center gap-2 rounded-lg border border-gray-200 bg-slate-50 px-3 ring-1 ring-transparent transition-shadow focus-within:border-[#0b1437] focus-within:ring-indigo-100">
                <Lock className="h-4 w-4 shrink-0 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full bg-transparent text-sm font-medium text-gray-900 outline-none placeholder:text-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <span className="text-xs text-red-500">{errors.password}</span>
              )}
            </label>

            {/* Remember device */}
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={rememberDevice}
                onChange={(e) => setRememberDevice(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-[#0b1437] focus:ring-[#0b1437]"
              />
              Remember this device
            </label>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 flex h-[46px] w-full items-center justify-center gap-2 rounded-lg bg-[#0b1437] text-sm font-semibold text-white shadow-md shadow-[#0b1437]/20 transition-colors hover:bg-[#111c4d] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Logging in..." : "Login"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="mt-6 flex justify-center gap-3 text-xs text-gray-400">
            <Link to="/privacy-policy" className="hover:text-gray-600">
              Privacy Policy
            </Link>
            <span>·</span>
            <Link to="/support" className="hover:text-gray-600">
              Support
            </Link>
          </div>

          {/* Footer, mobile only since left panel is hidden below lg */}
          <p className="mt-4 text-center text-xs text-gray-400 lg:hidden">
            &copy; {new Date().getFullYear()} LuxeBus Global Operations. Version 2.4.0-admin
          </p>
        </div>
      </div>
    </section>
  );
};

export default SuperAdminLogin;