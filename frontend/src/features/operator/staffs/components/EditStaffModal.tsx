import { useRef, useState } from "react";
import {
  X,
  User,
  Mail,
  Phone,
  Briefcase,
  Calendar,
  Save,
  Loader2,
  FileText,
  ShieldCheck,
  UploadCloud,
} from "lucide-react";
import toast from "react-hot-toast";
import type { IStaff } from "@/types/staff.types";
import { editStaff } from "../service/staffService";
import { getValidationErrors, editStaffSchema } from "../validation/staffValidation";

interface EditStaffModalProps {
  open: boolean;
  staff: IStaff | null;
  onClose: () => void;
  onUpdated?: (updated: IStaff) => void;
}

type EditFormData = {
  fullName: string;
  email: string;
  phone: string;
  role: IStaff["role"];
  joiningDate: string;
};

type FormErrors = Partial<Record<keyof EditFormData, string>>;

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const ALLOWED_FILE_TYPES = ["application/pdf", "image/jpeg", "image/png"];


const toDateInputValue = (value?: string | Date | null) => {
  if (!value) return "";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
};

const EditStaffModal = ({ open, staff, onClose, onUpdated }: EditStaffModalProps) => {
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState<EditFormData>(() => ({
    fullName: staff?.fullName ?? "",
    email: staff?.email ?? "",
    phone: staff?.phone ?? "",
    role: staff?.role ?? "driver",
    joiningDate: toDateInputValue(staff?.joiningDate),
  }));

  const [errors, setErrors] = useState<FormErrors>({});

  const [idProofFile, setIdProofFile] = useState<File | null>(null);
  const [licenseFile, setLicenseFile] = useState<File | null>(null);
  const [isBlocked, setIsBlocked] = useState(staff?.isBlocked ?? false);

  const idProofInputRef = useRef<HTMLInputElement>(null);
  const licenseInputRef = useRef<HTMLInputElement>(null);


 
    

  if (!open || !staff) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateDocument = (file: File | null, label: string) => {
    if (!file) return true; // no new file picked, keep existing one — nothing to validate

    if (file.size > MAX_FILE_SIZE) {
      toast.error(`${label} must be less than 10MB.`);
      return false;
    }

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      toast.error(`${label} must be a PDF, JPG, or PNG file.`);
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (isSaving) return;
 
    const result = getValidationErrors(editStaffSchema, formData);

    if (!result.success) {
      setErrors(result.errors);

      const firstError = Object.values(result.errors)[0];
      if (firstError) {
        toast.error(firstError);
      }
      return;
    }

    setErrors({});

 
    if (!validateDocument(idProofFile, "ID Proof")) return;
    if (!validateDocument(licenseFile, "Commercial License")) return;

 
    const payload = new FormData();
    payload.append("fullName", formData.fullName.trim());
    payload.append("email", formData.email.trim());
    payload.append("phone", formData.phone.trim());
    payload.append("role", formData.role);
    payload.append("joiningDate", formData.joiningDate);
    payload.append("isBlocked", isBlocked ? "true" : "false");

 
    if (idProofFile) payload.append("idProof", idProofFile);
    if (licenseFile) payload.append("commercialLicense", licenseFile);

    try {
      setIsSaving(true);

      const response = await editStaff(staff._id, payload);

      toast.success("Staff details updated successfully");
      onUpdated?.(response.data.staff);
      onClose();
    } catch (error) {
      console.error("Failed to update staff:", error);

      const message  ="Failed to update staff. Please try again.";
         

      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 py-8"
      onClick={onClose}
    >
      <div
        className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-slate-200 bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5 sm:px-7">
          <div>
            <p className="text-xs text-slate-400">Staff Management / Edit Staff</p>
            <h2 className="mt-1 text-xl font-bold text-slate-900">Edit {staff.fullName}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex flex-col gap-6 overflow-y-auto px-6 py-6 sm:px-7">
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-blue-700" />
              <h3 className="text-sm font-bold text-slate-900">Personal Details</h3>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <EditableField
                icon={User}
                label="Full Name"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                error={errors.fullName}
              />
              <EditableField
                icon={Mail}
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
              />
              <EditableField
                icon={Phone}
                label="Mobile Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                error={errors.phone}
              />

              <label className="flex flex-col gap-1.5">
                <span className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                  Role
                </span>
                <div
                  className={`flex h-[42px] items-center gap-2 rounded-xl border bg-slate-50 px-3 ring-1 ring-transparent transition-shadow focus-within:border-blue-400 focus-within:ring-blue-100 ${
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
                    <option value="driver">Driver</option>
                    <option value="conductor">Conductor</option>
                  </select>
                </div>
                {errors.role && (
                  <span className="text-[11px] font-medium text-red-500">{errors.role}</span>
                )}
              </label>

              <EditableField
                icon={Calendar}
                label="Joining Date"
                name="joiningDate"
                type="date"
                value={formData.joiningDate}
                onChange={handleChange}
                error={errors.joiningDate}
              />
            </div>
          </div>
          

          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-blue-700" />
              <h3 className="text-sm font-bold text-slate-900">Account Access</h3>
            </div>

            <div className="mt-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-slate-800">
                  {isBlocked ? "This staff member is blocked" : "This staff member is active"}
                </p>
                <p className="mt-0.5 text-xs text-slate-500">
                  {isBlocked
                    ? "They cannot log in until you unblock them."
                    : "Block to stop them from logging in."}
                </p>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={isBlocked}
                onClick={() => setIsBlocked((prev) => !prev)}
                className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
                  isBlocked ? "bg-red-500" : "bg-slate-300"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                    isBlocked ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {isBlocked !== (staff.isBlocked ?? false) && (
              <p className="mt-3 text-xs font-medium text-amber-600">
                Click "Save Changes" to apply.
              </p>
            )}
</div>

          {/* Documents */}
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-700" />
              <h3 className="text-sm font-bold text-slate-900">Documents</h3>
            </div>
            <p className="mt-1.5 text-xs text-slate-500">
              Only pick a file here if you want to replace the existing one. Supported formats: PDF, JPG, PNG (Max 10MB each).
            </p>

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <DocumentUploadField
                icon={FileText}
                label="ID Proof"
                currentFileName={staff.idProof}
                newFile={idProofFile}
                onPick={() => idProofInputRef.current?.click()}
                onClear={() => setIdProofFile(null)}
              />
              <input
                ref={idProofInputRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
                onChange={(e) => setIdProofFile(e.target.files?.[0] ?? null)}
              />

              

              <DocumentUploadField
                icon={ShieldCheck}
                label="Commercial License"
                currentFileName={staff.commercialLicense}
                newFile={licenseFile}
                onPick={() => licenseInputRef.current?.click()}
                onClear={() => setLicenseFile(null)}
              />
              <input
                ref={licenseInputRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
                onChange={(e) => setLicenseFile(e.target.files?.[0] ?? null)}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-5 sm:px-7">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="rounded-xl px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex h-[42px] min-w-[140px] items-center justify-center gap-1.5 rounded-xl bg-blue-900 px-5 text-sm font-semibold text-white shadow-md shadow-blue-900/20 hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-80"
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

const EditableField = ({
  icon: Icon,
  label,
  name,
  value,
  onChange,
  type = "text",
  error,
}: {
  icon?: typeof User;
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  error?: string;
}) => (
  <label className="flex flex-col gap-1.5">
    <span className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
      {label}
    </span>
    <div
      className={`flex h-[42px] items-center gap-2 rounded-xl border bg-slate-50 px-3 ring-1 ring-transparent transition-shadow focus-within:border-blue-400 focus-within:ring-blue-100 ${
        error ? "border-red-400" : "border-slate-200"
      }`}
    >
      {Icon && <Icon className="h-4 w-4 shrink-0 text-slate-400" />}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
      />
    </div>
    {error && <span className="text-[11px] font-medium text-red-500">{error}</span>}
  </label>
);

const DocumentUploadField = ({
  icon: Icon,
  label,
  currentFileName,
  newFile,
  onPick,
  onClear,
}: {
  icon: typeof FileText;
  label: string;
  currentFileName?: string | null;
  newFile: File | null;
  onPick: () => void;
  onClear: () => void;
}) => {
  const existingName = currentFileName ? currentFileName.split("/").pop() : null;

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
        {label}
      </span>
      <div className="flex flex-col gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-3 py-3">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 shrink-0 text-slate-400" />
          <span className="truncate text-sm font-medium text-slate-800">
            {newFile ? newFile.name : existingName || "Not uploaded"}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onPick}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 hover:text-blue-600"
          >
            <UploadCloud className="h-3.5 w-3.5" />
            {newFile || existingName ? "Replace file" : "Upload file"}
          </button>

          {newFile && (
            <button
              type="button"
              onClick={onClear}
              className="text-xs font-medium text-slate-400 hover:text-slate-600"
            >
              Undo
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditStaffModal;