import {
  X,
  User,
  Mail,
  Phone,
  Briefcase,
  Calendar,
  FileText,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";
import type { IStaff } from "@/types/staff.types";

import { getSignedDocmunetUrl } from "@/features/operator/staffs/service/staffService";

interface StaffDetailsModalProps {
  open: boolean;
  staff: IStaff | null;
  onClose: () => void;
}

const formatDate = (value?: string | Date | null) => {
  if (!value) return "—";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const handleDocumentView = async (objectKey?: string | null) => {
  if (!objectKey) return;
  try {
    const response = await getSignedDocmunetUrl(objectKey);
    window.open(response.data, "_blank");
  } catch (error) {
    console.log(error);
  }
};

const StaffDetailsModal = ({ open, staff, onClose }: StaffDetailsModalProps) => {
  if (!open || !staff) return null;

  const initials = staff.fullName
    ?.split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 py-8">
  
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-slate-200 bg-white">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5 sm:px-7">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
              {initials}
            </div>
            <div>
              <p className="text-xs text-slate-400">Staff Management / Staff Details</p>
              <h2 className="mt-1 text-xl font-bold text-slate-900">{staff.fullName}</h2>
              <span
                className={`mt-1 inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  staff.status === "on-duty"
                    ? "bg-blue-50 text-blue-700"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    staff.status === "on-duty" ? "bg-blue-600" : "bg-slate-400"
                  }`}
                />
                {staff.status === "on-duty" ? "On-duty" : "Off-duty"}
              </span>
            </div>
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

        {/* Scrollable body — no radius here, it inherits the clip from the parent */}
        <div className="flex flex-col gap-6 overflow-y-auto px-6 py-6 sm:px-7">
          {/* Personal Details */}
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-blue-700" />
              <h3 className="text-sm font-bold text-slate-900">Personal Details</h3>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <DetailRow icon={Mail} label="Email Address" value={staff.email} />
              <DetailRow icon={Phone} label="Mobile Number" value={staff.phone} />
              <DetailRow
                icon={Briefcase}
                label="Role"
                value={staff.role}
                className="capitalize"
              />
              <DetailRow
                icon={Calendar}
                label="Joining Date"
                value={formatDate(staff.joiningDate)}
              />
            </div>
          </div>

          {/* Documents */}
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-700" />
              <h3 className="text-sm font-bold text-slate-900">Documents</h3>
            </div>

            <div className="mt-5 flex flex-col gap-2">
              <DocumentRow
                icon={FileText}
                label="ID Proof"
                objectKey={staff.idProof}
              />
              <DocumentRow
                icon={ShieldCheck}
                label="Commercial License"
                objectKey={staff.commercialLicense}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-5 sm:px-7">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

/* ---------- Small presentational helpers ---------- */

const DetailRow = ({
  icon: Icon,
  label,
  value,
  mono,
  className = "",
}: {
  icon?: typeof User;
  label: string;
  value?: string | null;
  mono?: boolean;
  className?: string;
}) => (
  <div className="flex flex-col gap-1.5">
    <span className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
      {label}
    </span>
    <div className="flex h-[42px] items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3">
      {Icon && <Icon className="h-4 w-4 shrink-0 text-slate-400" />}
      <span
        className={`truncate text-sm font-medium text-slate-900 ${
          mono ? "font-mono text-xs" : ""
        } ${className}`}
      >
        {value || "—"}
      </span>
    </div>
  </div>
);

const DocumentRow = ({
  icon: Icon,
  label,
  objectKey,
}: {
  icon: typeof FileText;
  label: string;
  objectKey?: string | null;
}) => {
  const hasFile = Boolean(objectKey);

  return (
    <button
      type="button"
      disabled={!hasFile}
      onClick={() => handleDocumentView(objectKey)}
      className="flex w-full items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-left hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-transparent"
    >
      <div className="flex items-center gap-3">
        <Icon className="h-5 w-5 text-blue-600" />
        <div>
          <p className="text-sm font-medium text-slate-800">{label}</p>
          <p className="text-[11px] text-slate-400">
            {hasFile ? "Click to view" : "Not uploaded"}
          </p>
        </div>
      </div>
      {hasFile && <ExternalLink className="h-4 w-4 text-slate-400" />}
    </button>
  );
};

export default StaffDetailsModal;