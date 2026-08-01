import { useState, useEffect, useRef } from 'react'
import { Mail, ShieldCheck, ArrowLeft } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

import {forgotPasswordSchema,getValidationErrors,} from '@/features/auth/passenger/validation/passengerAuthValidation'
import { userForgotPasswordEmailVerification , userVerifyForgotPasswordOtp} from '../../services/authService'
 

type ForgotPasswordFormData = { email: string }
type FormErrors = Partial<Record<keyof ForgotPasswordFormData, string>>

const OTP_LENGTH = 6
const RESEND_SECONDS = 120 

const ForgotPasswordSection = () => {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [sent, setSent] = useState(false)

  const [formData, setFormData] = useState<ForgotPasswordFormData>({
    email: '',
  })

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''))
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS)
  const [isVerifying, setIsVerifying] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (!sent) return
    if (secondsLeft <= 0) return

    const intervalId = setInterval(() => {
      setSecondsLeft((prev) => (prev <= 1 ? 0 : prev - 1))
    }, 1000)

    return () => clearInterval(intervalId)
  }, [sent, secondsLeft])

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    setErrors((prev) => {
      if (!prev[name as keyof ForgotPasswordFormData]) return prev
      const next = { ...prev }
      delete next[name as keyof ForgotPasswordFormData]
      return next
    })
  }

  const handleOtpChange = (index: number, value: string) => {
   
    const digit = value.replace(/[^0-9]/g, '').slice(-1)

    setOtp((prev) => {
      const next = [...prev]
      next[index] = digit
      return next
    })

    if (digit && index < OTP_LENGTH - 1) {
      otpInputRefs.current[index + 1]?.focus()
    }
  }

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus()
    }
  }

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, OTP_LENGTH)
    if (!pasted) return
    e.preventDefault()
    setOtp((prev) => {
      const next = [...prev]
      pasted.split('').forEach((char, i) => {
        next[i] = char
      })
      return next
    })
    const lastIndex = Math.min(pasted.length, OTP_LENGTH) - 1
    otpInputRefs.current[lastIndex]?.focus()
  }

  const handleSubmit = async () => {
    const result = getValidationErrors(forgotPasswordSchema , formData)

    if(!result.success){
      setErrors(result.errors as FormErrors)
      toast.error(Object.values(result.errors)[0])
      return
    }

    setErrors({})
    setIsSubmitting(true)

    try {
      const response = await userForgotPasswordEmailVerification(result.data)
      toast.success(response.message)
      setSent(true)
      setSecondsLeft(RESEND_SECONDS)
      setOtp(Array(OTP_LENGTH).fill(''))
    } catch (error : any) {
      toast.error(error?.response?.data?.message ||error?.message ||"Something went wrong");
    } finally{
      setIsSubmitting(false)
    }
  }

  const handleResend = async () => {
    if (secondsLeft > 0) return

    setIsResending(true)
    try {
      const response = await userForgotPasswordEmailVerification(formData)
      toast.success(response.message || 'Verification code resent')
      setSecondsLeft(RESEND_SECONDS)
      setOtp(Array(OTP_LENGTH).fill(''))
      otpInputRefs.current[0]?.focus()
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error?.message || 'Something went wrong')
    } finally {
      setIsResending(false)
    }
  }

  const handleVerifyOtp = async () => {
    const code = otp.join('')
    console.log(code)
    if (code.length !== OTP_LENGTH) {
      toast.error('Please enter the 6 digit verification code')
      return
    }

    setIsVerifying(true)
    try {
      const response = await userVerifyForgotPasswordOtp({ email: formData.email, otp: code })
      toast.success(response?.message || 'OTP_verified')
      navigate('/resetPassword', { state: { email: formData.email, otp: code } })
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error?.message || 'Invalid or expired code')
    } finally {
      setIsVerifying(false)
    }
  }

  return (
    <section className="w-full min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10 sm:px-6">
      <div className="mx-auto grid w-full max-w-5xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl lg:grid-cols-2">
        {/* Left panel - brand / reassurance */}
        <div className="relative hidden flex-col justify-between overflow-hidden p-8 sm:p-10 lg:flex">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-blue-800 to-indigo-900" />
          <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-blue-400/20 blur-3xl" />
          <div className="absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-indigo-500/30 blur-3xl" />

          {/* Signature element: a concentric "verification pulse" instead of a photo,
              echoing the shield icon and the idea of a code radiating out to the user */}
          <svg
            className="absolute inset-0 h-full w-full opacity-[0.14]"
            viewBox="0 0 400 500"
            fill="none"
          >
            {Array.from({ length: 14 }).map((_, row) =>
              Array.from({ length: 11 }).map((_, col) => {
                const seed = Math.sin(row * 12.9898 + col * 78.233) * 43758.5453
                const noise = seed - Math.floor(seed)
                if (noise < 0.35) return null
                return (
                  <circle key={`${row}-${col}`} cx={20 + col * 36} cy={20 + row * 34} r="1.6" fill="white" />
                )
              })
            )}
          </svg>

          <svg
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 400 500"
            fill="none"
            preserveAspectRatio="none"
          >
            <circle cx="200" cy="230" r="60" stroke="#7dd3fc" strokeOpacity="0.35" strokeWidth="1.5" />
            <circle cx="200" cy="230" r="95" stroke="#7dd3fc" strokeOpacity="0.22" strokeWidth="1.5" />
            <circle cx="200" cy="230" r="132" stroke="#7dd3fc" strokeOpacity="0.12" strokeWidth="1.5" />
          </svg>

          <div className="relative z-10 flex items-center gap-2.5">
            <img src="/logo.png" alt="LuxeBus" className="h-30 w-100 rounded-lg object-contain" />
          </div>

          <div className="relative z-10 flex flex-col items-start">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20 backdrop-blur-sm">
              <ShieldCheck className="h-7 w-7 text-blue-100" />
            </div>
            <h1 className="text-3xl font-bold leading-tight text-white sm:text-4xl">
              Secure account recovery.
            </h1>
            <p className="mt-4 max-w-sm text-sm text-blue-100/90 sm:text-base">
              Enter your email and we'll send a verification code so you can get back to booking your
              next premium journey.
            </p>
          </div>

          <p className="relative z-10 text-xs text-blue-100/70">
            &copy; {new Date().getFullYear()} LuxeBus Premium Travel Partners. All rights reserved.
          </p>
        </div>

        {/* Right panel - form */}
        <div className="flex flex-col justify-center bg-white p-8 sm:p-10">
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="mb-6 flex w-fit items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-700"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to login
          </button>

          <h2 className="text-2xl font-bold text-slate-900">Forgot Password?</h2>
          <p className="mt-1 text-sm text-slate-500">
            Enter your registered email address to receive a verification code.
          </p>

          {sent ? (
            <div className="mt-7 flex flex-col gap-4">
              <div className="flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                <div>
                  <p className="text-sm font-semibold text-emerald-900">Code sent</p>
                  <p className="mt-0.5 text-sm text-emerald-700">
                    Check <span className="font-medium">{formData.email}</span> for your verification
                    code.
                  </p>
                </div>
              </div>

              <label className="flex flex-col gap-2">
                <span className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                  Enter 6 Digit Code
                </span>
                <div className="flex items-center justify-between gap-2">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => {otpInputRefs.current[index] = el}}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      onPaste={handleOtpPaste}
                      className="h-12 w-12 rounded-lg border border-slate-200 bg-slate-50 text-center text-lg font-semibold text-slate-900 outline-none ring-1 ring-transparent transition-shadow focus:border-blue-400 focus:ring-blue-100"
                    />
                  ))}
                </div>
              </label>

              <button
                type="button"
                onClick={handleVerifyOtp}
                disabled={isVerifying}
                className="flex h-[46px] w-full items-center justify-center gap-1.5 rounded-lg bg-blue-900 text-sm font-semibold text-white shadow-md shadow-blue-900/20 transition-colors hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isVerifying ? 'Verifying...' : 'Verify Code'}
              </button>

              <div className="text-center text-sm text-slate-500">
                {secondsLeft > 0 ? (
                  <span>
                    Resend code in{' '}
                    <span className="font-semibold text-slate-700">{formatTime(secondsLeft)}</span>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={isResending}
                    className="font-semibold text-blue-700 hover:text-blue-600 disabled:opacity-60"
                  >
                    {isResending ? 'Resending...' : "Didn't get it? Resend code"}
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="mt-7 flex flex-col gap-4">
              <label className="flex flex-col gap-1.5">
                <span className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                  Email Address
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
                    placeholder="name@example.com"
                    className="w-full bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
                  />
                </div>
                {errors.email && <span className="text-xs text-red-500">{errors.email}</span>}
              </label>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="mt-2 flex h-[46px] w-full items-center justify-center gap-1.5 rounded-lg bg-blue-900 text-sm font-semibold text-white shadow-md shadow-blue-900/20 transition-colors hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? 'Sending...' : 'Send Verification Code'}
              </button>

              <p className="mt-1 text-center text-sm text-slate-500">
                Remembered it?{' '}
                <Link to="/login" className="font-semibold text-blue-700 hover:text-blue-600">
                  Return to Login
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default ForgotPasswordSection