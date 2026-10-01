import { useState } from 'react'
import { Mail, Lock } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import toast from 'react-hot-toast'
import axios from 'axios'
import type { UserLoginFormData } from '@/types/auth.types'
import { userLogin } from '@/features/auth/services/authService'
import { login } from '@/redux/slice/authSlice'
import {  passengerLoginSchema,getValidationErrors,} from '@/features/auth/passenger/validation/passengerAuthValidation'
import { GoogleLogin } from '@react-oauth/google'
import { googleLogin } from '@/features/auth/services/authService'

type FormErrors = Partial<Record<keyof UserLoginFormData, string>>

const LoginSection = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})

  const [formData, setFormData] = useState<UserLoginFormData>({
    email: '',
    password: '',
  })


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    setErrors((prev) => {
      if (!prev[name as keyof UserLoginFormData]) return prev
      const next = { ...prev }
      delete next[name as keyof UserLoginFormData]
      return next
    })
  }

  const handleSubmit = async () => {
  const result = getValidationErrors(passengerLoginSchema, formData);

  if (!result.success) {
    setErrors(result.errors as FormErrors);
    toast.error(Object.values(result.errors)[0]);
    return;
  }

  setErrors({});
  setIsSubmitting(true);

  try {
    const response = await userLogin(result.data);
    // console.log(response.data.user)

    dispatch(
      login({
        user : response.data.user,
        accessToken : response.data.accessToken
      })
    );

    toast.success(response.message);

    navigate("/");
} catch (error) {
  const message = axios.isAxiosError(error)
    ? error.response?.data?.message ?? "Login failed"
    : "Login failed";

  toast.error(message);

  } finally {
    setIsSubmitting(false);
  }
};

  const handleGoogleLogin = async (credential: string) => {
    try {
      const response = await googleLogin(credential);

      dispatch(
        login({
          user: response.data.user,
          accessToken: response.data.accessToken,
        })
      );

      toast.success(response.message);

      navigate("/");
    } catch   {

      const message ="Google login failed"
      toast.error(message);
    }
  };
  return (
    <section className="w-full min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10 sm:px-6">
      <div className="mx-auto grid w-full max-w-5xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl lg:grid-cols-2">
        {/* Left panel - brand / value prop */}
        <div className="relative hidden flex-col justify-between overflow-hidden p-8 sm:p-10 lg:flex">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-blue-800 to-indigo-900" />
          <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-blue-400/20 blur-3xl" />
          <div className="absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-indigo-500/30 blur-3xl" />

          <svg className="absolute inset-0 h-full w-full opacity-[0.12]" viewBox="0 0 400 500" fill="none">
            {Array.from({ length: 14 }).map((_, row) =>
              Array.from({ length: 11 }).map((_, col) => {
                const seed = Math.sin(row * 12.9898 + col * 78.233) * 43758.5453
                const noise = seed - Math.floor(seed)
                if (noise < 0.35) return null
                return <circle key={`${row}-${col}`} cx={20 + col * 36} cy={20 + row * 34} r="1.6" fill="white" />
              })
            )}
          </svg>

          <svg
            className="absolute inset-0 h-full w-full opacity-70"
            viewBox="0 0 400 500"
            fill="none"
            preserveAspectRatio="none"
          >
            <path
              d="M 40 110 C 140 30, 220 260, 350 190"
              stroke="#7dd3fc"
              strokeWidth="2"
              strokeDasharray="1 10"
              strokeLinecap="round"
            />
            <circle cx="40" cy="110" r="5" fill="white" />
            <circle cx="40" cy="110" r="9" stroke="white" strokeOpacity="0.4" strokeWidth="1.5" />
            <circle cx="350" cy="190" r="5" fill="#7dd3fc" />
            <circle cx="350" cy="190" r="9" stroke="#7dd3fc" strokeOpacity="0.4" strokeWidth="1.5" />
          </svg>

          <div className="relative z-10 flex items-center gap-2.5">
            <img src="/logo.png" alt="LuxeBus" className="h-30 w-100 rounded-lg object-contain" />
          </div>

          <div className="relative z-10">
            <h1 className="text-3xl font-bold leading-tight text-white sm:text-4xl">
              The height of bus travel luxury.
            </h1>

            <p className="mt-4 max-w-sm text-sm text-blue-100/90 sm:text-base">
              Experience seamless booking and premium amenities on every journey. Welcome back to the standard of
              excellence.
            </p>
          </div>

          <p className="relative z-10 text-xs text-blue-100/70">
            &copy; {new Date().getFullYear()} LuxeBus Premium Travel Partners. All rights reserved.
          </p>
        </div>

        {/* Right panel - form */}
        <div className="flex flex-col justify-center bg-white p-8 sm:p-10">
          <h2 className="text-2xl font-bold text-slate-900">Welcome Back</h2>
          <p className="mt-1 text-sm text-slate-500">Enter your details to access your luxury account.</p>

          <div className="mt-7 flex flex-col gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-[11px] font-medium uppercase tracking-wide text-slate-500">Email Address</span>
              <div
                className={`flex h-[42px] items-center gap-2 rounded-lg border bg-slate-50 px-3 ring-1 ring-transparent transition-shadow focus-within:ring-blue-100 ${
                  errors.email ? 'border-red-400 focus-within:border-red-400' : 'border-slate-200 focus-within:border-blue-400'
                }`}
              >
                <Mail className="h-4 w-4 shrink-0 text-slate-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className="w-full bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
                />
              </div>
              {errors.email && <span className="text-xs text-red-500">{errors.email}</span>}
            </label>

            <label className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium uppercase tracking-wide text-slate-500">Password</span>
                <button onClick={()=>navigate('/forgotPassword')}   className="text-xs font-semibold text-blue-700 hover:text-blue-600">
                  Forgot Password?
                </button>
              </div>
              <div
                className={`flex h-[42px] items-center gap-2 rounded-lg border bg-slate-50 px-3 ring-1 ring-transparent transition-shadow focus-within:ring-blue-100 ${
                  errors.password ? 'border-red-400 focus-within:border-red-400' : 'border-slate-200 focus-within:border-blue-400'
                }`}
              >
                <Lock className="h-4 w-4 shrink-0 text-slate-400" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••••"
                  className="w-full bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
                />
              </div>
              {errors.password && <span className="text-xs text-red-500">{errors.password}</span>}
            </label>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="mt-2 flex h-[46px] w-full items-center justify-center gap-1.5 rounded-lg bg-blue-900 text-sm font-semibold text-white shadow-md shadow-blue-900/20 transition-colors hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? 'Signing In...' : 'Sign In'}
            </button>

            <div className="my-1 flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-200" />
              <span className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                Or continue with
              </span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={(credentialResponse) => {
                  if (credentialResponse.credential) {
                    handleGoogleLogin(credentialResponse.credential);
                  }
                }}
                onError={() => {
                  toast.error("Google Login Failed");
                }}
              />
            </div>

            <p className="mt-1 text-center text-sm text-slate-500">
              New to LuxeBus?{' '}
              <Link to="/register" className="font-semibold text-blue-700 hover:text-blue-600">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default LoginSection