import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import logo from '../../../../../public/logo.png'
import {
  Building2,
  User,
  Mail,
  Phone,
  Lock,
  Hash,
  Calendar,
  UserCheck,
  FileText,
  ShieldCheck,
  Truck,
  UploadCloud,
  ArrowRight,
  CheckCircle2,
  Loader2,
  X,
} from 'lucide-react'
import type {
  OperatorRegisterFormData,
  OperatorDocumentFiles,
  OperatorDocumentKey,
} from '@/types/auth.types'
import {
  operatorRegisterSchema,
  getValidationErrors,
} from "@/features/auth/operator/validation/operatorAuthValidation";
import toast from 'react-hot-toast'
import { operatorRegister } from '../../services/authService'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
// verifyOperatorOTP is a placeholder name: point it to your real verify OTP API
import { genrateOperatorOTPverify , verifyOperatorOtp} from '../../services/authService'

const documentSlots: {
  key: OperatorDocumentKey
  icon: typeof FileText
  title: string
  subtitle: string
}[] = [
  {
    key: 'registrationCertificate',
    icon: FileText,
    title: 'Registration Certificate',
    subtitle: 'Proof of business registration',
  },
  {
    key: 'taxCertificate',
    icon: ShieldCheck,
    title: 'Tax / GST Certificate',
    subtitle: 'Proof of tax identification',
  },
  {
    key: 'transportLicense',
    icon: Truck,
    title: 'Transport License',
    subtitle: 'Commercial operating permit',
  },
]

const OperatorRegisterSection = () => {
  const [formData, setFormData] = useState<OperatorRegisterFormData>({
    ownerName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    legalEntityName: '',
    gstNumber: '',
    yearOfIncorporation: '',
    panNumber: '',
    authorisedRepresentative: '',
  })

  const navigate = useNavigate()

  type FormErrors = Partial<Record<keyof OperatorRegisterFormData, string>>;

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false)
  const [otpSent , setOtpSent] = useState(true)

  // ---------- OTP modal state ----------
  const [showOtpModal, setShowOtpModal] = useState(false)
  const OTP_LENGTH = 6
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''))
  const [isVerifying, setIsVerifying] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [resendTimer, setResendTimer] = useState(120) // 2 minutes
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([])
  const pendingFormData = useRef<FormData | null>(null)

  // countdown for resend
  useEffect(() => {
    if (!showOtpModal || resendTimer <= 0) return
    const t = setTimeout(() => setResendTimer((s) => s - 1), 1000)
    return () => clearTimeout(t)
  }, [showOtpModal, resendTimer])

  const formatTimer = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

  const [documents, setDocuments] = useState<OperatorDocumentFiles>({
    registrationCertificate: null,
    taxCertificate: null,
    transportLicense: null,
  })

  const fileInputRefs = useRef<Record<OperatorDocumentKey, HTMLInputElement | null>>({
    registrationCertificate: null,
    taxCertificate: null,
    transportLicense: null,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (key: OperatorDocumentKey) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    setDocuments((prev) => ({ ...prev, [key]: file }))
  }


  const handleOperatorOtp = async () => {
    setOtpSent(true)

    try {
      console.log(formData.email)
      await genrateOperatorOTPverify(formData.email)
      toast.success(`OTP sent to ${formData.email}`)
      return true
    } catch (error) {
      console.log('Error in handle operator OTP:', error)

      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || 'Something went wrong'

        toast.error(message)
      } else {
        toast.error('Something went wrong')
      }

      return false
    }
  }

  // ---------- OTP modal handlers ----------
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

  const handleResendOtp = async () => {
    if (resendTimer > 0) return
    setIsResending(true)
    const sent = await handleOperatorOtp()
    if (sent) {
      setOtp(Array(OTP_LENGTH).fill(''))
      setResendTimer(120)
      otpInputRefs.current[0]?.focus()
    }
    setIsResending(false)
  }

  const handleVerifyOtp = async () => {
    const code = otp.join('')
    if (code.length !== OTP_LENGTH) {
      toast.error('Please enter the 6 digit verification code')
      return
    }

    setIsVerifying(true)
    try {
      await verifyOperatorOtp(formData.email, code)

      if (pendingFormData.current) {
        await operatorRegister(pendingFormData.current)
      }

      toast.success('Registration successful!')
      setShowOtpModal(false)

      setTimeout(() => {
        navigate('/operator/login')
      }, 2000)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || 'Invalid or expired code')
      } else {
        toast.error('Invalid or expired code')
      }
    } finally {
      setIsVerifying(false)
    }
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      const data = new FormData();

      data.append("ownerName", formData.ownerName);
      data.append("email", formData.email);
      data.append("phone", formData.phone);
      data.append("password", formData.password);
      data.append("legalEntityName", formData.legalEntityName);
      data.append("gstNumber", formData.gstNumber);
      data.append("yearOfIncorporation", formData.yearOfIncorporation);
      data.append("panNumber", formData.panNumber);
      data.append(
        "authorisedRepresentative",
        formData.authorisedRepresentative
      );

      if (documents.registrationCertificate) {
        data.append(
          "registrationCertificate",
          documents.registrationCertificate
        );
      }

      if (documents.taxCertificate) {
        data.append(
          "taxCertificate",
          documents.taxCertificate
        );
      }

      if (documents.transportLicense) {
        data.append(
          "transportLicense",
          documents.transportLicense
        );
      }

      const result = getValidationErrors(operatorRegisterSchema, formData);

      if (!result.success) {
        setErrors(result.errors);
        toast.error(Object.values(result.errors)[0]);
        return;
      }

      setErrors({});

      // save the form data, send OTP, then open the modal
      pendingFormData.current = data
      const sent = await handleOperatorOtp()
      if (sent) {
        setOtp(Array(OTP_LENGTH).fill(''))
        setResendTimer(120)
        setShowOtpModal(true)
      }
    } catch (error) {
      console.log(error);
      if (axios.isAxiosError(error)) {
          toast.error(
              error.response?.data?.message || "Something went wrong"
          );
      } else {
          toast.error("Something went wrong");
      }
    } finally {
      setIsLoading(false)
    }
  };

  return (
    <section className="min-h-screen w-full bg-slate-50">
       <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">

              <img
                src={logo}
                alt="LuxeBus Logo"
                className="h-20 w-40 object-contain"
              />
            </div>

          </div>

          <p className="text-sm text-slate-500 flex items-center justify-center gap-2">
            <span>Already have an account?</span>

            <Link
              to="/operator/login"
              className="font-semibold text-blue-700 hover:text-blue-600"
            >
              Log in
            </Link>

            <span className="font-bold text-slate-400">|</span>

            <Link
              to="/"
              className="font-semibold text-blue-700 hover:text-blue-600"
            >
              Home
            </Link>
          </p>

        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Operator Registration</h1>
          <p className="mt-2 text-sm text-slate-500">
            Partner with LuxeBus to reach premium travelers and expand your fleet operations.
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-6">
           <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-blue-700" />
              <h2 className="text-sm font-bold text-slate-900">Personal Information</h2>
            </div>

            <div className="mt-5 flex flex-col gap-4">
              <label className="flex flex-col gap-1.5">
                <span className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                  Name of Owner
                </span>
                <div
                  className={`flex h-[42px] items-center gap-2 rounded-lg border bg-slate-50 px-3 ring-1 ring-transparent transition-shadow focus-within:border-blue-400 focus-within:ring-blue-100 ${
                    errors.ownerName ? 'border-red-400' : 'border-slate-200'
                  }`}
                >
                  <User className="h-4 w-4 shrink-0 text-slate-400" />
                  <input
                    name="ownerName"
                    value={formData.ownerName}
                    onChange={handleChange}
                    placeholder="As it appears on your identity document"
                    className="w-full bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
                  />
                </div>
                {errors.ownerName && (
                  <span className="text-[11px] font-medium text-red-500">{errors.ownerName}</span>
                )}
              </label>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-1.5">
                  <span className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                    Email Address
                  </span>
                  <div
                    className={`flex h-[42px] items-center gap-2 rounded-lg border bg-slate-50 px-3 ring-1 ring-transparent transition-shadow focus-within:border-blue-400 focus-within:ring-blue-100 ${
                      errors.email ? 'border-red-400' : 'border-slate-200'
                    }`}
                  >
                    <Mail className="h-4 w-4 shrink-0 text-slate-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="name@company.com"
                      className="w-full bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
                    />
                  </div>
                  {errors.email && (
                    <span className="text-[11px] font-medium text-red-500">{errors.email}</span>
                  )}
                </label>

                <label className="flex flex-col gap-1.5">
                  <span className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                    Phone Number
                  </span>
                  <div
                    className={`flex h-[42px] items-center gap-2 rounded-lg border bg-slate-50 px-3 ring-1 ring-transparent transition-shadow focus-within:border-blue-400 focus-within:ring-blue-100 ${
                      errors.phone ? 'border-red-400' : 'border-slate-200'
                    }`}
                  >
                    <Phone className="h-4 w-4 shrink-0 text-slate-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+1 (555) 000-0000"
                      className="w-full bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
                    />
                  </div>
                  {errors.phone && (
                    <span className="text-[11px] font-medium text-red-500">{errors.phone}</span>
                  )}
                </label>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-1.5">
                  <span className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                    Create Password
                  </span>
                  <div
                    className={`flex h-[42px] items-center gap-2 rounded-lg border bg-slate-50 px-3 ring-1 ring-transparent transition-shadow focus-within:border-blue-400 focus-within:ring-blue-100 ${
                      errors.password ? 'border-red-400' : 'border-slate-200'
                    }`}
                  >
                    <Lock className="h-4 w-4 shrink-0 text-slate-400" />
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Minimum 8 characters"
                      className="w-full bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
                    />
                  </div>
                  {errors.password && (
                    <span className="text-[11px] font-medium text-red-500">{errors.password}</span>
                  )}
                </label>

                <label className="flex flex-col gap-1.5">
                  <span className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                    Confirm Password
                  </span>
                  <div
                    className={`flex h-[42px] items-center gap-2 rounded-lg border bg-slate-50 px-3 ring-1 ring-transparent transition-shadow focus-within:border-blue-400 focus-within:ring-blue-100 ${
                      errors.confirmPassword ? 'border-red-400' : 'border-slate-200'
                    }`}
                  >
                    <Lock className="h-4 w-4 shrink-0 text-slate-400" />
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Re-enter password"
                      className="w-full bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
                    />
                  </div>
                  {errors.confirmPassword && (
                    <span className="text-[11px] font-medium text-red-500">{errors.confirmPassword}</span>
                  )}
                </label>
              </div>
            </div>
          </div>

           <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-blue-700" />
              <h2 className="text-sm font-bold text-slate-900">Company Details</h2>
            </div>

            <div className="mt-5 flex flex-col gap-4">
              <label className="flex flex-col gap-1.5">
                <span className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                  Legal Entity Name
                </span>
                <div
                  className={`flex h-[42px] items-center gap-2 rounded-lg border bg-slate-50 px-3 ring-1 ring-transparent transition-shadow focus-within:border-blue-400 focus-within:ring-blue-100 ${
                    errors.legalEntityName ? 'border-red-400' : 'border-slate-200'
                  }`}
                >
                  <Building2 className="h-4 w-4 shrink-0 text-slate-400" />
                  <input
                    name="legalEntityName"
                    value={formData.legalEntityName}
                    onChange={handleChange}
                    placeholder="e.g. LuxeBus Travels Pvt Ltd"
                    className="w-full bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
                  />
                </div>
                {errors.legalEntityName && (
                  <span className="text-[11px] font-medium text-red-500">{errors.legalEntityName}</span>
                )}
              </label>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-1.5">
                  <span className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                    GST / Tax Identification Number
                  </span>
                  <div
                    className={`flex h-[42px] items-center gap-2 rounded-lg border bg-slate-50 px-3 ring-1 ring-transparent transition-shadow focus-within:border-blue-400 focus-within:ring-blue-100 ${
                      errors.gstNumber ? 'border-red-400' : 'border-slate-200'
                    }`}
                  >
                    <Hash className="h-4 w-4 shrink-0 text-slate-400" />
                    <input
                      name="gstNumber"
                      value={formData.gstNumber}
                      onChange={handleChange}
                      placeholder="22AAAAA0000A1Z5"
                      className="w-full bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
                    />
                  </div>
                  {errors.gstNumber && (
                    <span className="text-[11px] font-medium text-red-500">{errors.gstNumber}</span>
                  )}
                </label>

                <label className="flex flex-col gap-1.5">
                  <span className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                    Year of Incorporation
                  </span>
                  <div
                    className={`flex h-[42px] items-center gap-2 rounded-lg border bg-slate-50 px-3 ring-1 ring-transparent transition-shadow focus-within:border-blue-400 focus-within:ring-blue-100 ${
                      errors.yearOfIncorporation ? 'border-red-400' : 'border-slate-200'
                    }`}
                  >
                    <Calendar className="h-4 w-4 shrink-0 text-slate-400" />
                    <input
                      name="yearOfIncorporation"
                      value={formData.yearOfIncorporation}
                      onChange={handleChange}
                      placeholder="e.g. 2018"
                      className="w-full bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
                    />
                  </div>
                  {errors.yearOfIncorporation && (
                    <span className="text-[11px] font-medium text-red-500">{errors.yearOfIncorporation}</span>
                  )}
                </label>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-1.5">
                  <span className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                    Business PAN Number
                  </span>
                  <div
                    className={`flex h-[42px] items-center gap-2 rounded-lg border bg-slate-50 px-3 ring-1 ring-transparent transition-shadow focus-within:border-blue-400 focus-within:ring-blue-100 ${
                      errors.panNumber ? 'border-red-400' : 'border-slate-200'
                    }`}
                  >
                    <Hash className="h-4 w-4 shrink-0 text-slate-400" />
                    <input
                      name="panNumber"
                      value={formData.panNumber}
                      onChange={handleChange}
                      placeholder="ABCDE1234F"
                      className="w-full bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
                    />
                  </div>
                  {errors.panNumber && (
                    <span className="text-[11px] font-medium text-red-500">{errors.panNumber}</span>
                  )}
                </label>

                <label className="flex flex-col gap-1.5">
                  <span className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                    Authorised Representative
                  </span>
                  <div
                    className={`flex h-[42px] items-center gap-2 rounded-lg border bg-slate-50 px-3 ring-1 ring-transparent transition-shadow focus-within:border-blue-400 focus-within:ring-blue-100 ${
                      errors.authorisedRepresentative ? 'border-red-400' : 'border-slate-200'
                    }`}
                  >
                    <UserCheck className="h-4 w-4 shrink-0 text-slate-400" />
                    <input
                      name="authorisedRepresentative"
                      value={formData.authorisedRepresentative}
                      onChange={handleChange}
                      placeholder="e.g. Ajay Manager"
                      className="w-full bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
                    />
                  </div>
                  {errors.authorisedRepresentative && (
                    <span className="text-[11px] font-medium text-red-500">{errors.authorisedRepresentative}</span>
                  )}
                </label>
              </div>
            </div>
          </div>

           <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-700" />
              <h2 className="text-sm font-bold text-slate-900">Business Documents</h2>
            </div>
            <p className="mt-1.5 text-xs text-slate-500">
              Please provide high-resolution digital copies of your official documents. Supported formats: PDF,
              JPG, PNG (Max 10MB each).
            </p>

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {documentSlots.map(({ key, icon: Icon, title, subtitle }) => {
                const file = documents[key]
                return (
                  <div
                    key={key}
                    className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100">
                      {file ? (
                        <CheckCircle2 className="h-4 w-4 text-blue-700" />
                      ) : (
                        <Icon className="h-4 w-4 text-blue-700" />
                      )}
                    </div>
                    <p className="text-xs font-semibold text-slate-800">{title}</p>
                    <p className="text-[11px] text-slate-500">{file ? file.name : subtitle}</p>

                    <input
                      ref={(el) => {
                        fileInputRefs.current[key] = el
                      }}
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileChange(key)}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRefs.current[key]?.click()}
                      className="mt-1 inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 hover:text-blue-600"
                    >
                      <UploadCloud className="h-3.5 w-3.5" />
                      {file ? 'Change file' : 'Choose file'}
                    </button>
                  </div>
                )
              })}
            </div>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className="mt-2 flex h-[46px] w-full items-center justify-center gap-1.5 rounded-lg bg-blue-900 text-sm font-semibold text-white shadow-md shadow-blue-900/20 transition-colors hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400 disabled:cursor-not-allowed disabled:opacity-80"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Registering...
              </>
            ) : (
              <>
                Complete Registration
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* ---------- OTP Modal ---------- */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4">
          <div className="relative flex w-full max-w-md flex-col gap-4 rounded-2xl bg-white p-6 shadow-xl sm:p-8">
            <button
              type="button"
              onClick={() => setShowOtpModal(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>

            <div>
              <h3 className="text-2xl font-bold text-slate-900">Verify your email</h3>
              <p className="mt-1 text-sm text-slate-500">
                Enter the verification code to complete your registration.
              </p>
            </div>

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
                    ref={(el) => {
                      otpInputRefs.current[index] = el
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    autoFocus={index === 0}
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
              {resendTimer > 0 ? (
                <span>
                  Resend code in{' '}
                  <span className="font-semibold text-slate-700">{formatTimer(resendTimer)}</span>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={isResending}
                  className="font-semibold text-blue-700 hover:text-blue-600 disabled:opacity-60"
                >
                  {isResending ? 'Resending...' : "Didn't get it? Resend code"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default OperatorRegisterSection