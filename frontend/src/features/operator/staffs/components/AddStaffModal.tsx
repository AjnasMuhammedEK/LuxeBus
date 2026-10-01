// src/features/operator/staff/components/AddStaffModal.tsx

import { useRef, useState } from "react";
import {
  X,
  User,
  Mail,
  Phone,
  Lock,
  Briefcase,
  Calendar,
  FileText,
  ShieldCheck,
  UploadCloud,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";
import type { StaffDocumentFiles, StaffDocumentKey, StaffRegisterFormData } from "@/types/staff.types";
import {
  addStaffSchema,
  getValidationErrors,
} from "@/features/operator/staffs/validation/staffValidation";
import { staffRegister } from "@/features/operator/staffs/service/staffService";

interface AddStaffModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

const emptyForm: StaffRegisterFormData = {
  fullName: "",
  mobileNumber: "",
  email: "",
  role: "driver",
  joiningDate: "",
  password: "",
  confirmPassword: "",
};

const documentSlots: {
  key: StaffDocumentKey;
  icon: typeof FileText;
  title: string;
  subtitle: string;
}[] = [
  {
    key: "idProof",
    icon: FileText,
    title: "ID Proof",
    subtitle: "Passport or National ID",
  },
  {
    key: "commercialLicense",
    icon: ShieldCheck,
    title: "Commercial License",
    subtitle: "Valid driving / operating license",
  },
];

const AddStaffModal = ({ open, onClose, onCreated }: AddStaffModalProps) => {
  const [formData, setFormData] = useState<StaffRegisterFormData>(emptyForm);
  const [documents, setDocuments] = useState<StaffDocumentFiles>({
    idProof: null,
    commercialLicense: null,
  });

  type FormErrors = Partial<Record<keyof StaffRegisterFormData, string>>;
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const fileInputRefs = useRef<Record<StaffDocumentKey, HTMLInputElement | null>>({
    idProof: null,
    commercialLicense: null,
  });

  if (!open) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange =
    (key: StaffDocumentKey) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] ?? null;
      setDocuments((prev) => ({ ...prev, [key]: file }));
    };

  const resetAndClose = () => {
    setFormData(emptyForm);
    setDocuments({ idProof: null, commercialLicense: null });
    setErrors({});
    onClose();
  };

  const handleSubmit = async () => {
  // Prevent multiple submissions
  if (isLoading) return;

  try {
    // 1. Validate form fields
    const result = getValidationErrors(addStaffSchema, formData);

    if (!result.success) {
      setErrors(result.errors);

      const firstError = Object.values(result.errors)[0];

      if (firstError) {
        toast.error(firstError);
      }

      return;
    }

     
    setErrors({});

     
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

    const allowedFileTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
    ];

    if (documents.idProof) {
      if (documents.idProof.size > MAX_FILE_SIZE) {
        toast.error("ID Proof must be less than 10MB.");
        return;
      }

      if (!allowedFileTypes.includes(documents.idProof.type)) {
        toast.error("ID Proof must be a PDF, JPG, or PNG file.");
        return;
      }
    }

    if (documents.commercialLicense) {
      if (documents.commercialLicense.size > MAX_FILE_SIZE) {
        toast.error("Commercial License must be less than 10MB.");
        return;
      }

      if (!allowedFileTypes.includes(documents.commercialLicense.type)) {
        toast.error(
          "Commercial License must be a PDF, JPG, or PNG file."
        );
        return;
      }
    }

    // 3. Start loading only after validation passes
    setIsLoading(true);

    // 4. Create FormData
    const data = new FormData();

    data.append("fullName", formData.fullName.trim());
    data.append("mobileNumber", formData.mobileNumber.trim());
    data.append("email", formData.email.trim());
    data.append("role", formData.role);
    data.append("joiningDate", formData.joiningDate);
    data.append("password", formData.password);

    // IMPORTANT:
    // Do NOT send confirmPassword to backend.
    // It is only required for frontend validation.

    // 5. Add ID proof
    if (documents.idProof) {
      data.append("idProof", documents.idProof);
    }

    // 6. Add commercial license
    if (documents.commercialLicense) {
      data.append(
        "commercialLicense",
        documents.commercialLicense
      );
    }


    console.log(data , 'From The Modal --------------')

   
    const response = await staffRegister(data);

 

     toast.success("Staff account created successfully!");

     onCreated();

     
    resetAndClose();

  } catch (error) {
    console.error("Staff registration error:", error);

      const message ="Failed to Add staff. Please try again.";

    toast.error(message);

  } finally {
    setIsLoading(false);
  }
};

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 py-8"
     >
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-200 bg-white"
       >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5 sm:px-7">
          <div>
            <p className="text-xs text-slate-400">Staff Management / Add New Staff</p>
            <h2 className="mt-1 text-xl font-bold text-slate-900">Onboard New Crew Member</h2>
            <p className="mt-1 text-sm text-slate-500">
              Register a new employee with precise roles and credentials.
            </p>
          </div>
          <button
            type="button"
            onClick={resetAndClose}
            className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col gap-6 px-6 py-6 sm:px-7">
          {/* Personal Details */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-blue-700" />
              <h3 className="text-sm font-bold text-slate-900">Personal Details</h3>
            </div>

            <div className="mt-5 flex flex-col gap-4">
              <label className="flex flex-col gap-1.5">
                <span className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                  Full Name
                </span>
                <div
                  className={`flex h-[42px] items-center gap-2 rounded-lg border bg-slate-50 px-3 ring-1 ring-transparent transition-shadow focus-within:border-blue-400 focus-within:ring-blue-100 ${
                    errors.fullName ? "border-red-400" : "border-slate-200"
                  }`}
                >
                  <User className="h-4 w-4 shrink-0 text-slate-400" />
                  <input
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="e.g. Robert Smith"
                    className="w-full bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
                  />
                </div>
                {errors.fullName && (
                  <span className="text-[11px] font-medium text-red-500">{errors.fullName}</span>
                )}
              </label>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-1.5">
                  <span className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                    Mobile Number
                  </span>
                  <div
                    className={`flex h-[42px] items-center gap-2 rounded-lg border bg-slate-50 px-3 ring-1 ring-transparent transition-shadow focus-within:border-blue-400 focus-within:ring-blue-100 ${
                      errors.mobileNumber ? "border-red-400" : "border-slate-200"
                    }`}
                  >
                    <Phone className="h-4 w-4 shrink-0 text-slate-400" />
                    <input
                      name="mobileNumber"
                      value={formData.mobileNumber}
                      onChange={handleChange}
                      placeholder="98765 43210"
                      className="w-full bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
                    />
                  </div>
                  {errors.mobileNumber && (
                    <span className="text-[11px] font-medium text-red-500">{errors.mobileNumber}</span>
                  )}
                </label>

                <label className="flex flex-col gap-1.5">
                  <span className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                    Email Address
                  </span>
                  <div
                    className={`flex h-[42px] items-center gap-2 rounded-lg border bg-slate-50 px-3 ring-1 ring-transparent transition-shadow focus-within:border-blue-400 focus-within:ring-blue-100 ${
                      errors.email ? "border-red-400" : "border-slate-200"
                    }`}
                  >
                    <Mail className="h-4 w-4 shrink-0 text-slate-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="robert.smith@luxebus.com"
                      className="w-full bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
                    />
                  </div>
                  {errors.email && (
                    <span className="text-[11px] font-medium text-red-500">{errors.email}</span>
                  )}
                </label>

                <label className="flex flex-col gap-1.5">
                <span className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                  Role
                </span>
                <div
                  className={`flex h-[42px] items-center gap-2 rounded-lg border bg-slate-50 px-3 ring-1 ring-transparent transition-shadow focus-within:border-blue-400 focus-within:ring-blue-100 ${
                    errors.role ? "border-red-400" : "border-slate-200"
                  }`}
                >
                  <Briefcase className="h-4 w-4 shrink-0 text-slate-400" />
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full bg-transparent text-sm font-medium text-slate-900 outline-none"
                  >
                    <option value="">Select a role...</option>
                    <option value="driver">Driver</option>
                    <option value="conductor">Conductor</option>
                  </select>
                </div>
                {errors.role && (
                  <span className="text-[11px] font-medium text-red-500">{errors.role}</span>
                )}
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                  Joining Date
                </span>
                <div
                  className={`flex h-[42px] items-center gap-2 rounded-lg border bg-slate-50 px-3 ring-1 ring-transparent transition-shadow focus-within:border-blue-400 focus-within:ring-blue-100 ${
                    errors.joiningDate ? "border-red-400" : "border-slate-200"
                  }`}
                >
                  <Calendar className="h-4 w-4 shrink-0 text-slate-400" />
                  <input
                    type="date"
                    name="joiningDate"
                    value={formData.joiningDate}
                    onChange={handleChange}
                    className="w-full bg-transparent text-sm font-medium text-slate-900 outline-none"
                  />
                </div>
                {errors.joiningDate && (
                  <span className="text-[11px] font-medium text-red-500">{errors.joiningDate}</span>
                )}
              </label>
              </div>
            </div>
          </div>

           
           

          {/* Credentials */}
 
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-blue-700" />
            <h3 className="text-sm font-bold text-slate-900">Credentials</h3>
        </div>
        <p className="mt-1.5 text-xs text-slate-500">Portal access settings for the employee.</p>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5">
            <span className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                Password
            </span>
            <div
                className={`flex h-[42px] items-center gap-2 rounded-lg border bg-slate-50 px-3 ring-1 ring-transparent transition-shadow focus-within:border-blue-400 focus-within:ring-blue-100 ${
                errors.password ? "border-red-400" : "border-slate-200"
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
                errors.confirmPassword ? "border-red-400" : "border-slate-200"
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

          {/* Document Upload */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-700" />
              <h3 className="text-sm font-bold text-slate-900">Document Upload</h3>
            </div>
            <p className="mt-1.5 text-xs text-slate-500">
              Please provide clear digital copies. Supported formats: PDF, JPG, PNG (Max 10MB each).
            </p>

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {documentSlots.map(({ key, icon: Icon, title, subtitle }) => {
                const file = documents[key];
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
                        fileInputRefs.current[key] = el;
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
                      {file ? "Change file" : "Choose file"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-5 sm:px-7">
          <button
            type="button"
            onClick={resetAndClose}
            className="rounded-lg px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className="flex h-[42px] min-w-[180px] items-center justify-center gap-1.5 rounded-lg bg-blue-900 px-5 text-sm font-semibold text-white shadow-md shadow-blue-900/20 transition-colors hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400 disabled:cursor-not-allowed disabled:opacity-80"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Staff Account"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddStaffModal;