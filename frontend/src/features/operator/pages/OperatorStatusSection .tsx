import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store/store";
import { Clock, Building2, User, Mail, Phone, BadgeCheck } from "lucide-react";
import logo from "../../../../public/logo.png";
import OperatorNavbar from "@/components/layouts/operator/OperatorNavbar";
const OperatorStatusSection = () => {
  const operator = useSelector(
    (state: RootState) => state.operatorAuth.operator
  );

  return (
    <>
    <OperatorNavbar/>
    <section className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-3xl rounded-2xl bg-white shadow-xl border border-slate-200">

        {/* Header */}

        <div className="border-b border-slate-200 p-8 text-center">

          <img
            src={logo}
            alt="LuxeBus"
            className="mx-auto h-20 object-contain"
          />

          <h1 className="mt-4 text-3xl font-bold text-slate-900">
            Registration Under Review
          </h1>

          <p className="mt-2 text-slate-500">
            Your company registration has been submitted successfully.
          </p>

        </div>

        {/* Body */}

        <div className="space-y-5 p-8">

          <div className="flex items-center gap-3">
            <Building2 className="text-blue-700" />
            <div>
              <p className="text-xs text-slate-500">Company</p>
              <p className="font-semibold">
                {operator?.legalEntityName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <User className="text-blue-700" />
            <div>
              <p className="text-xs text-slate-500">Owner</p>
              <p className="font-semibold">
                {operator?.ownerName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Mail className="text-blue-700" />
            <div>
              <p className="text-xs text-slate-500">Email</p>
              <p className="font-semibold">
                {operator?.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Phone className="text-blue-700" />
            <div>
              <p className="text-xs text-slate-500">Phone</p>
              <p className="font-semibold">
                {operator?.phone}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <BadgeCheck className="text-blue-700" />
            <div>
              <p className="text-xs text-slate-500">GST Number</p>
              <p className="font-semibold">
                {operator?.gstNumber}
              </p>
            </div>
          </div>

          <div className="rounded-xl bg-yellow-50 border border-yellow-300 p-5">

            <div className="flex items-center gap-3">

              <Clock className="text-yellow-700" />

              <div>

                <h3 className="font-semibold text-yellow-800">
                  Status : {operator?.status?.toUpperCase()}
                </h3>

                <p className="mt-1 text-sm text-yellow-700">
                  Our team is currently reviewing your company documents.
                  Approval usually takes between <b>24–48 hours.</b>
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
    </>
  );
};

export default OperatorStatusSection;