import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store/store";
import {
  Clock,
  Building2,
  User,
  Mail,
  Phone,
  BadgeCheck,
  CheckCircle2,
  XCircle,
  X,
  RefreshCw,
  UploadCloud,
  Loader2,
} from "lucide-react";
import { Navigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import logo from "../../../../public/logo.png";
import OperatorNavbar from "@/components/layouts/operator/OperatorNavbar";
// operatorResubmit is a placeholder name: point it to your real resubmit API
import { operatorResubmit } from "../service/operatorService";
import { useDispatch } from "react-redux";
import { updateOperatorStatus } from "@/redux/slice/operatorAuthSlice";

const OperatorStatusSection = () => {
  const operator = useSelector(
    (state: RootState) => state.operatorAuth.operator
  );

   const [showResubmitModal, setShowResubmitModal] = useState(false);
   const [isResubmitting, setIsResubmitting] = useState(false);

   const [resubmitData, setResubmitData] = useState({
    ownerName: "",
    phone: "",
    legalEntityName: "",
    gstNumber: "",
    panNumber: "",
    yearOfIncorporation: "",
    authorisedRepresentative: "",
  });

  
  const [newDocuments, setNewDocuments] = useState<{
    registrationCertificate: File | null;
    taxCertificate: File | null;
    transportLicense: File | null;
  }>({
    registrationCertificate: null,
    taxCertificate: null,
    transportLicense: null,
  });

  const registrationRef = useRef<HTMLInputElement | null>(null);
  const taxRef = useRef<HTMLInputElement | null>(null);
  const transportRef = useRef<HTMLInputElement | null>(null);

  if (!operator) {
    return <Navigate to="/operator/login" replace />;
  }

  const status = (operator?.status || "pending").toLowerCase();

   
  const openResubmitModal = () => {
    setResubmitData({
      ownerName: operator?.ownerName || "",
      phone: operator?.phone || "",
      legalEntityName: operator?.legalEntityName || "",
      gstNumber: operator?.gstNumber || "",
      panNumber: operator?.panNumber || "",
      yearOfIncorporation: operator?.yearOfIncorporation
        ? String(operator.yearOfIncorporation)
        : "",
      authorisedRepresentative: operator?.authorisedRepresentative || "",
    });
    setNewDocuments({
      registrationCertificate: null,
      taxCertificate: null,
      transportLicense: null,
    });
    setShowResubmitModal(true);
  };

  const dispatch = useDispatch();

  const handleResubmitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setResubmitData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDocumentChange =
    (key: keyof typeof newDocuments) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] ?? null;
      setNewDocuments((prev) => ({ ...prev, [key]: file }));
    };

  const handleResubmit = async () => {
    // simple check: no field should be empty
    const emptyField = Object.entries(resubmitData).find(
      ([, value]) => !value.trim()
    );
    if (emptyField) {
      toast.error("Please fill all the fields");
      return;
    }

    setIsResubmitting(true);
    try {
      const data = new FormData();
      data.append("email", operator.email); // email is only used to identify the operator
      data.append("ownerName", resubmitData.ownerName);
      data.append("phone", resubmitData.phone);
      data.append("legalEntityName", resubmitData.legalEntityName);
      data.append("gstNumber", resubmitData.gstNumber);
      data.append("panNumber", resubmitData.panNumber);
      data.append("yearOfIncorporation", resubmitData.yearOfIncorporation);
      data.append(
        "authorisedRepresentative",
        resubmitData.authorisedRepresentative
      );

      // add the documents only if the operator selected new ones
      if (newDocuments.registrationCertificate) {
        data.append(
          "registrationCertificate",
          newDocuments.registrationCertificate
        );
      }
      if (newDocuments.taxCertificate) {
        data.append("taxCertificate", newDocuments.taxCertificate);
      }
      if (newDocuments.transportLicense) {
        data.append("transportLicense", newDocuments.transportLicense);
      }

      await operatorResubmit(data);

      dispatch(updateOperatorStatus("pending"));

      toast.success("Details resubmitted successfully!");
      setShowResubmitModal(false);

  
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Something went wrong");
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setIsResubmitting(false);
    }
  };

  const statusConfig = {
    pending: {
      title: "Registration Under Review",
      subtitle: "Your company registration has been submitted successfully.",
      label: "Pending",
      text: "text-amber-600",
      box: "bg-amber-50 border-amber-200",
      icon: <Clock className="h-6 w-6 text-amber-600" />,
      message:
        "Our team is reviewing your company documents. Approval usually takes between 24–48 hours.",
    },
    approved: {
      title: "Registration Approved",
      subtitle: "Your company has been verified successfully.",
      label: "Approved",
      text: "text-green-600",
      box: "bg-green-50 border-green-200",
      icon: <CheckCircle2 className="h-6 w-6 text-green-600" />,
      message:
        "Your registration is approved. You can now log in and start managing your buses and trips.",
    },
    rejected: {
      title: "Registration Rejected",
      subtitle: "We could not approve your registration.",
      label: "Rejected",
      text: "text-red-600",
      box: "bg-red-50 border-red-200",
      icon: <XCircle className="h-6 w-6 text-red-600" />,
      message:
        "Please check the reason below and contact our support team to get your registration reconsidered.",
    },
  } as const;

  const config =
    statusConfig[status as keyof typeof statusConfig] ?? statusConfig.pending;

  const details = [
    {
      icon: <Building2 className="h-5 w-5" />,
      label: "Company",
      value: operator?.legalEntityName,
    },
    {
      icon: <User className="h-5 w-5" />,
      label: "Owner",
      value: operator?.ownerName,
    },
    {
      icon: <Mail className="h-5 w-5" />,
      label: "Email",
      value: operator?.email,
    },
    {
      icon: <Phone className="h-5 w-5" />,
      label: "Phone",
      value: operator?.phone,
    },
    {
      icon: <BadgeCheck className="h-5 w-5" />,
      label: "GST Number",
      value: operator?.gstNumber,
    },
  ];

  // the input boxes inside the resubmit modal (label, field name, placeholder)
  const resubmitFields: {
    label: string;
    name: keyof typeof resubmitData;
    placeholder: string;
  }[] = [
    { label: "Name of Owner", name: "ownerName", placeholder: "Owner name" },
    { label: "Phone Number", name: "phone", placeholder: "Phone number" },
    {
      label: "Legal Entity Name",
      name: "legalEntityName",
      placeholder: "Company name",
    },
    {
      label: "GST / Tax Identification Number",
      name: "gstNumber",
      placeholder: "22AAAAA0000A1Z5",
    },
    {
      label: "Business PAN Number",
      name: "panNumber",
      placeholder: "ABCDE1234F",
    },
    {
      label: "Year of Incorporation",
      name: "yearOfIncorporation",
      placeholder: "e.g. 2018",
    },
    {
      label: "Authorised Representative",
      name: "authorisedRepresentative",
      placeholder: "Representative name",
    },
  ];

  // the optional document upload rows inside the modal
  const documentRows = [
    {
      key: "registrationCertificate" as const,
      title: "Registration Certificate",
      inputRef: registrationRef,
    },
    {
      key: "taxCertificate" as const,
      title: "Tax / GST Certificate",
      inputRef: taxRef,
    },
    {
      key: "transportLicense" as const,
      title: "Transport License",
      inputRef: transportRef,
    },
  ];

  return (
    <>
      <OperatorNavbar />
      <section className="min-h-screen bg-slate-100 px-4 py-10 sm:px-6">
        <div className="mx-auto w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
          {/* Header */}
          <div className="border-b border-slate-200 px-6 py-8 text-center">
            <img
              src={logo}
              alt="LuxeBus"
              className="mx-auto h-16 object-contain sm:h-20"
            />
            <h1 className="mt-4 text-2xl font-bold text-slate-900 sm:text-3xl">
              {config.title}
            </h1>
            <p className="mt-2 text-sm text-slate-500 sm:text-base">
              {config.subtitle}
            </p>
          </div>

          <div className="space-y-6 p-6 sm:p-8">
            {/* Status */}
            <div className={`rounded-xl border p-5 ${config.box}`}>
              <div className="flex items-center gap-3">
                {config.icon}
                <p className="text-lg font-semibold text-slate-800">
                  Status :{" "}
                  <span className={`font-bold uppercase ${config.text}`}>
                    {config.label}
                  </span>
                </p>
              </div>

              <p className="mt-3 text-sm text-slate-600">{config.message}</p>

              {status === "rejected" && operator?.rejectReason && (
                <p className="mt-3 text-sm">
                  <span className="font-semibold text-slate-800">
                    Reason :{" "}
                  </span>
                  <span className="font-medium text-red-600">
                    {operator.rejectReason}
                  </span>
                </p>
              )}

              {/* Resubmit button (only when rejected) */}
              {status === "rejected" && (
                <button
                  type="button"
                  onClick={openResubmitModal}
                  className="mt-4 flex h-[42px] w-full items-center justify-center gap-2 rounded-lg bg-blue-900 text-sm font-semibold text-white shadow-md shadow-blue-900/20 transition-colors hover:bg-blue-800"
                >
                  <RefreshCw className="h-4 w-4" />
                  Edit & Resubmit Details
                </button>
              )}
            </div>

            {/* Details */}
            <div className="divide-y divide-slate-100 rounded-xl border border-slate-200">
              {details.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-4 px-4 py-3"
                >
                  <div className="text-blue-700">{item.icon}</div>
                  <div className="min-w-0">
                    <p className="text-xs text-slate-500">{item.label}</p>
                    <p className="truncate font-semibold text-slate-900">
                      {item.value || "—"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Resubmit Modal ---------- */}
      {showResubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 py-6">
          <div className="relative flex max-h-full w-full max-w-lg flex-col rounded-2xl bg-white shadow-xl">
            {/* Modal header */}
            <div className="border-b border-slate-200 p-6 pr-12">
              <button
                type="button"
                onClick={() => setShowResubmitModal(false)}
                className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
              <h3 className="text-xl font-bold text-slate-900">
                Edit & Resubmit Details
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Correct the details below and submit again for review.
              </p>

              {operator?.rejectReason && (
                <p className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                  <span className="font-semibold">Reject reason: </span>
                  {operator.rejectReason}
                </p>
              )}
            </div>

            {/* Modal body (scrolls if the screen is small) */}
            <div className="flex flex-col gap-4 overflow-y-auto p-6">
              {/* Email is shown but cannot be changed */}
              <label className="flex flex-col gap-1.5">
                <span className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                  Email Address (cannot be changed)
                </span>
                <input
                  value={operator?.email || ""}
                  disabled
                  className="h-[42px] w-full cursor-not-allowed rounded-lg border border-slate-200 bg-slate-100 px-3 text-sm font-medium text-slate-500 outline-none"
                />
              </label>

              {/* All editable fields */}
              {resubmitFields.map((field) => (
                <label key={field.name} className="flex flex-col gap-1.5">
                  <span className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                    {field.label}
                  </span>
                  <input
                    name={field.name}
                    value={resubmitData[field.name]}
                    onChange={handleResubmitChange}
                    placeholder={field.placeholder}
                    className="h-[42px] w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-900 outline-none ring-1 ring-transparent transition-shadow placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-100"
                  />
                </label>
              ))}

              {/* Optional new documents */}
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                  Documents (optional)
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Upload a file only if you want to replace the old one. PDF,
                  JPG, PNG.
                </p>

                <div className="mt-3 flex flex-col gap-2">
                  {documentRows.map(({ key, title, inputRef }) => {
                    const file = newDocuments[key];
                    return (
                      <div
                        key={key}
                        className="flex items-center justify-between gap-3 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-3 py-2.5"
                      >
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-slate-800">
                            {title}
                          </p>
                          <p className="truncate text-[11px] text-slate-500">
                            {file ? file.name : "Keep existing file"}
                          </p>
                        </div>

                        <input
                          ref={inputRef}
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={handleDocumentChange(key)}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => inputRef.current?.click()}
                          className="inline-flex shrink-0 items-center gap-1.5 text-xs font-semibold text-blue-700 hover:text-blue-600"
                        >
                          <UploadCloud className="h-3.5 w-3.5" />
                          {file ? "Change" : "Replace"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Modal footer */}
            <div className="flex gap-3 border-t border-slate-200 p-6">
              <button
                type="button"
                onClick={() => setShowResubmitModal(false)}
                className="flex h-[46px] w-full items-center justify-center rounded-lg border border-slate-200 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleResubmit}
                disabled={isResubmitting}
                className="flex h-[46px] w-full items-center justify-center gap-1.5 rounded-lg bg-blue-900 text-sm font-semibold text-white shadow-md shadow-blue-900/20 transition-colors hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isResubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Resubmit"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OperatorStatusSection;