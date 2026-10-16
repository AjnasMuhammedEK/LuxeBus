import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import toast from 'react-hot-toast'
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react'
import axios from 'axios'
import logo from '../../../../../public/logo.png'
import { LoginStaff } from '@/redux/slice/staffAuthSlice'
import { staffLogin } from '../../services/authService'

type StaffLoginFormData = {
  email: string
  password: string
}

type FormErrors = Partial<Record<keyof StaffLoginFormData, string>>

const stats = [
  { value: '24/7', label: 'Operations Support' },
  { value: '99.9%', label: 'Uptime Reliability' },
]

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const validate = (data: StaffLoginFormData): FormErrors => {
  const errors: FormErrors = {}

  if (!data.email.trim()) errors.email = 'Email is required'
  else if (!EMAIL_REGEX.test(data.email.trim())) errors.email = 'Enter a valid email address'

  if (!data.password) errors.password = 'Password is required'
  else if (data.password.length < 6) errors.password = 'Password must be at least 6 characters'

  return errors
}

const StaffLoginSection = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [formData, setFormData] = useState<StaffLoginFormData>({
    email: '',
    password: '',
  })

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setFormData((prev) => ({ ...prev, [name]: value }))

    setErrors((prev) => {
      if (!prev[name as keyof StaffLoginFormData]) return prev
      const next = { ...prev }
      delete next[name as keyof StaffLoginFormData]
      return next
    })
  }

  const handleSubmit = async () => {
    if (isSubmitting) return

    const validationErrors = validate(formData)

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      toast.error(Object.values(validationErrors)[0] as string)
      return
    }

    setErrors({})
    setIsSubmitting(true)

    try {

      const response = await staffLogin({email : formData.email, password:formData.password})
      
      console.log('Response from StaffLogin Tsx login page ',response)

      dispatch (
        LoginStaff({
          staff : response.data.staff,
          accessToken : response.data.accessToken
        })
      )

 

      toast.success(response.message)
      navigate('/staff/dashboard')
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message ?? 'Login failed'
        : 'Login failed'

      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSubmit()
  }

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

          {/* Logo */}
          <div className="relative z-10 flex items-center gap-2.5">
            <img src={logo} alt="LuxeBus Logo" className="h-20 w-40 object-contain ml-30" />
          </div>

          <div className="relative z-10">
            <h1 className="text-3xl font-bold leading-tight text-white sm:text-4xl">
              Smooth Operations.
              <br />
              Happy Passengers.
            </h1>

            <p className="mt-4 max-w-sm text-sm text-blue-100/90 sm:text-base">
              Sign in to handle bookings, assist passengers, and keep every trip running on schedule from your
              staff workspace.
            </p>

            <div className="mt-8 flex items-center gap-6">
              {stats.map(({ value, label }, i) => (
                <div key={label} className="flex items-center gap-6">
                  {i > 0 && <div className="h-8 w-px bg-white/20" />}
                  <div>
                    <p className="text-xl font-bold text-white">{value}</p>
                    <p className="text-[11px] uppercase tracking-wide text-blue-200/80">{label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="relative z-10 text-xs text-blue-100/70">
            &copy; {new Date().getFullYear()} LuxeBus Travel Systems v2.4.0
          </p>
        </div>

        {/* Right panel - form */}
        <div className="flex flex-col justify-between bg-white p-8 sm:p-10">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Staff Login</h2>
            <p className="mt-1 text-sm text-slate-500">Access your staff dashboard and daily tasks.</p>

            <div className="mt-7 flex flex-col gap-4">
              {/* Email */}
              <label className="flex flex-col gap-1.5">
                <span className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                  Staff Email
                </span>
                <div
                  className={`flex h-[42px] items-center gap-2 rounded-lg border bg-slate-50 px-3 ring-1 ring-transparent transition-shadow focus-within:ring-blue-100 ${
                    errors.email
                      ? 'border-red-400 focus-within:border-red-400'
                      : 'border-slate-200 focus-within:border-blue-400'
                  }`}
                >
                  <Mail className="h-4 w-4 shrink-0 text-slate-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    autoComplete="email"
                    placeholder="e.g. staff@luxebus.com"
                    className="w-full bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
                  />
                </div>
                {errors.email && <span className="text-xs text-red-500">{errors.email}</span>}
              </label>

              {/* Password with show / hide */}
              <label className="flex flex-col gap-1.5">
                <span className="text-[11px] font-medium uppercase tracking-wide text-slate-500">Password</span>
                <div
                  className={`flex h-[42px] items-center gap-2 rounded-lg border bg-slate-50 px-3 ring-1 ring-transparent transition-shadow focus-within:ring-blue-100 ${
                    errors.password
                      ? 'border-red-400 focus-within:border-red-400'
                      : 'border-slate-200 focus-within:border-blue-400'
                  }`}
                >
                  <Lock className="h-4 w-4 shrink-0 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    autoComplete="current-password"
                    placeholder="••••••••"
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
                className="mt-2 flex h-[46px] w-full items-center justify-center gap-1.5 rounded-lg bg-blue-900 text-sm font-semibold text-white shadow-md shadow-blue-900/20 transition-colors hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? (
                  'Signing In...'
                ) : (
                  <>
                    Sign In to Staff Portal
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

              <p className="text-center text-sm text-slate-500">
                Are you an operator?{' '}
                <Link to="/operator/login" className="font-semibold text-blue-700 hover:text-blue-600">
                  Operator Login
                </Link>
              </p>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-between text-xs text-slate-400">
            <span>&copy; {new Date().getFullYear()} LuxeBus Travel Systems v2.4.0</span>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-slate-600">
                Help Center
              </a>
              <a href="#" className="hover:text-slate-600">
                Privacy
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default StaffLoginSection