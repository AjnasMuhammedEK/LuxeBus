import { useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import {
  BadgeCheck,
  Route,
  Sparkles,
  Zap,
  Mail,
  Lock,
  Phone,
  User,
  Eye,
  EyeOff,
} from 'lucide-react'
import type { UserRegisterFormData } from '@/types/auth.types'
import { registerUser } from "@/features/auth/services/authService";
import {
  passengerRegisterSchema,
  getValidationErrors,
} from '@/features/auth/passenger/validation/passengerAuthValidation'

import { useNavigate } from 'react-router-dom'

const features = [
  { icon: BadgeCheck, label: 'Premium lounges' },
  { icon: Sparkles, label: 'Priority concierge' },
  { icon: Route, label: 'Direct routes' },
  { icon: Zap, label: 'Instant booking' },
]



type FormErrors = Partial<Record<keyof UserRegisterFormData, string>>

const SignUpSection = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const navigate = useNavigate()

  const [formData, setFormData] = useState<UserRegisterFormData>({
    name: '',
    email: '',
    phone: '',
    password: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    setErrors((prev) => {
      if (!prev[name as keyof UserRegisterFormData]) return prev
      const next = { ...prev }
      delete next[name as keyof UserRegisterFormData]
      return next
    })
  }

  const handleSubmit = async () => {
    const result = getValidationErrors(passengerRegisterSchema, formData)

    if (!result.success) {
      setErrors(result.errors as FormErrors)
      const firstError = Object.values(result.errors)[0]
      toast.error(firstError)
      return
    }

    setErrors({})
    setIsSubmitting(true)

    try {
      await registerUser(result.data)
      toast.success('Registration successful!')

      setTimeout(() => {
        navigate('/login')
      },2000)
    } catch (error: any) {
      const message =
        error?.response?.data?.message ??
        error?.message ??
        'Registration failed. Please try again.'
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="w-full min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10 sm:px-6">
      <div className="mx-auto grid w-full max-w-5xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl lg:grid-cols-2">
        {/* Left panel - brand / value prop */}
        <div className="relative hidden flex-col justify-between overflow-hidden p-8 sm:p-10 lg:flex">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-blue-800 to-indigo-900" />
          <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-blue-400/20 blur-3xl" />
          <div className="absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-indigo-500/30 blur-3xl" />

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

          <div className="relative z-10">
            <span className="inline-block rounded-full border border-blue-300/30 bg-blue-300/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-blue-200">
              The gold standard
            </span>

            <h1 className="mt-5 text-3xl font-bold leading-tight text-white sm:text-4xl">
              Elevate your journey to new heights.
            </h1>

            <p className="mt-4 max-w-sm text-sm text-blue-100 sm:text-base">
              Join the elite network of premium travelers and unlock exclusive access to world-class transit,
              personalized concierge services, and unparalleled comfort.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-3">
              {features.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2.5"
                >
                  <Icon className="h-4 w-4 shrink-0 text-blue-300" />
                  <span className="text-xs font-medium text-blue-50">{label}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="relative z-10 mt-10 text-xs text-blue-300/70">
            &copy; {new Date().getFullYear()} LuxeBus Premium Travel Partners. All rights reserved.
          </p>
        </div>

        {/* Right panel - form */}
        <div className="flex flex-col justify-center bg-white p-8 sm:p-10">
          <h2 className="text-2xl font-bold text-slate-900">Create Your Account</h2>
          <p className="mt-1 text-sm text-slate-500">Join the elite network of premium travelers today.</p>

          <div className="mt-7 flex flex-col gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-[11px] font-medium uppercase tracking-wide text-slate-500">Name</span>
              <div
                className={`flex h-[42px] items-center gap-2 rounded-lg border bg-slate-50 px-3 ring-1 ring-transparent transition-shadow focus-within:ring-blue-100 ${
                  errors.name ? 'border-red-400 focus-within:border-red-400' : 'border-slate-200 focus-within:border-blue-400'
                }`}
              >
                <User className="h-4 w-4 shrink-0 text-slate-400" />
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Johnathan"
                  className="w-full bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
                />
              </div>
              {errors.name && <span className="text-xs text-red-500">{errors.name}</span>}
            </label>

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
                  placeholder="john@luxebus.com"
                  className="w-full bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
                />
              </div>
              {errors.email && <span className="text-xs text-red-500">{errors.email}</span>}
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-[11px] font-medium uppercase tracking-wide text-slate-500">Mobile Number</span>
              <div className="flex gap-2">
                <div className="flex h-[42px] items-center rounded-lg border border-slate-200 bg-slate-100 px-4 text-sm font-semibold text-slate-700">
                  +91
                </div>

                <div
                  className={`flex h-[42px] w-full items-center gap-2 rounded-lg border bg-slate-50 px-3 ${
                    errors.phone ? 'border-red-400' : 'border-slate-200'
                  }`}
                >
                  <Phone className="h-4 w-4 text-slate-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="9876543210"
                    className="w-full bg-transparent text-sm outline-none"
                  />
                </div>
              </div>
              {errors.phone && <span className="text-xs text-red-500">{errors.phone}</span>}
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-[11px] font-medium uppercase tracking-wide text-slate-500">Password</span>
              <div
                className={`flex h-[42px] items-center gap-2 rounded-lg border bg-slate-50 px-3 ring-1 ring-transparent transition-shadow focus-within:ring-blue-100 ${
                  errors.password ? 'border-red-400 focus-within:border-red-400' : 'border-slate-200 focus-within:border-blue-400'
                }`}
              >
                <Lock className="h-4 w-4 shrink-0 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Min. 8 characters"
                  className="w-full bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="shrink-0 text-slate-400 transition-colors hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <span className="text-xs text-red-500">{errors.password}</span>}
            </label>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="mt-2 flex h-[46px] w-full items-center justify-center rounded-lg bg-blue-900 text-sm font-semibold text-white shadow-md shadow-blue-900/20 transition-colors hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? 'Creating Account...' : 'Create My Account'}
            </button>

            <p className="text-center text-sm text-slate-500">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-blue-700 hover:text-blue-600">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SignUpSection