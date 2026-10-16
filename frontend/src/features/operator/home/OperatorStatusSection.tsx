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
} from "lucide-react";
import { Navigate } from "react-router-dom";
import logo from "../../../../public/logo.png";
import OperatorNavbar from "@/components/layouts/operator/OperatorNavbar";

const OperatorStatusSection = () => {
  const operator = useSelector(
    (state: RootState) => state.operatorAuth.operator
  );

   
  if (!operator) {
    return <Navigate to="/operator/login" replace />;
  }

  const status = (operator?.status || "pending").toLowerCase();

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
    </>
  );
};

export default OperatorStatusSection;