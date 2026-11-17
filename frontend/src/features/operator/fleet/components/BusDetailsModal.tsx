
import { useState } from "react";
import {
  X,
  FileText,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";
import toast from "react-hot-toast";

import SeatLayoutPreview from "./SeatLayoutPreview";
import ResubmitBusModal from "./ResubmitBusModal";

import { getSignedDocmunetUrl } from "@/features/operator/fleet/service/busService";
import type { IBus } from "@/types/fleet.types";

interface BusDetailsModalProps {
  open: boolean;
  bus: IBus | null;
  onClose: () => void;
  onUpdated: () => void;
}

const BusDetailsModal = ({
  open,
  bus,
  onClose,
  onUpdated,
}: BusDetailsModalProps) => {
  const [documentUrl, setDocumentUrl] = useState<string | null>(null);
  const [isDocumentLoading, setIsDocumentLoading] = useState(false);
  const [resubmitOpen, setResubmitOpen] = useState(false);

  const handleDocumentView = async (objectKey?: string | null) => {
    if (!objectKey) return;

    try {
      setIsDocumentLoading(true);

      const response = await getSignedDocmunetUrl(objectKey);

      setDocumentUrl(response.data.signedUrl);
    } catch (error) {
      console.error(error);
      toast.error("Unable to open document");
    } finally {
      setIsDocumentLoading(false);
    }
  };

  if (!open || !bus) return null;

  const info: [string, string | number][] = [
    ["Manufacturer", bus.manufacturer],
    ["Model", bus.model],
    ["Registration", bus.registrationNumber],
    ["Year", bus.manufacturingYear],
    ["Bus Type", bus.busType.replaceAll("_", " ")],
    ["Capacity", bus.seatLayoutSnapshot.totalCapacity],
  ];

  const documents = [
    {
      label: "Registration Certificate",
      icon: FileText,
      key: bus.documents?.rc,
    },
    {
      label: "Fitness Certificate",
      icon: ShieldCheck,
      key: bus.documents?.fitnessCertificate,
    },
    {
      label: "Insurance",
      icon: ShieldCheck,
      key: bus.documents?.insurance,
    },
  ];

  return (
    <>
      {/* Bus Details Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 py-8">
        <div className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-slate-200 bg-white">

          {/* Header */}
          <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5 sm:px-7">
            <div>
              <p className="text-xs text-slate-400">
                Fleet Management / Bus Details
              </p>

              <h2 className="mt-1 text-xl font-bold text-slate-900">
                {bus.manufacturer} {bus.model}
              </h2>

              <p className="mt-0.5 text-sm text-slate-500">
                {bus.registrationNumber}
              </p>
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

          {/* Content */}
          <div className="flex flex-col gap-6 overflow-y-auto px-6 py-6 sm:px-7">

            {/* Rejection Reason */}
            {bus.approvalStatus === "REJECTED" && bus.rejectReason && (
              <p className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                <span className="font-semibold">Rejected: </span>
                {bus.rejectReason}
              </p>
            )}

            {/* Bus Information */}
            <div className="rounded-xl border border-slate-200 p-6">
              <h3 className="text-sm font-bold text-slate-900">
                Bus Information
              </h3>

              <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3">
                {info.map(([label, value]) => (
                  <div key={label} className="flex flex-col gap-1">
                    <span className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                      {label}
                    </span>

                    <span className="text-sm font-medium text-slate-900">
                      {value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Amenities */}
              <div className="mt-5 flex flex-wrap gap-2">
                {bus.amenities.length === 0 ? (
                  <span className="text-xs text-slate-400">
                    No amenities
                  </span>
                ) : (
                  bus.amenities.map((item) => (
                    <span
                      key={item}
                      className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700"
                    >
                      {item.replaceAll("_", " ")}
                    </span>
                  ))
                )}
              </div>
            </div>

            {/* Seat Layout */}
            <SeatLayoutPreview layout={bus.seatLayoutSnapshot} />

            {/* Documents */}
            <div className="rounded-xl border border-slate-200 p-6">
              <h3 className="text-sm font-bold text-slate-900">
                Documents
              </h3>

              <div className="mt-5 flex flex-col gap-2">
                {documents.map(({ label, icon: Icon, key }) => (
                  <button
                    key={label}
                    type="button"
                    disabled={!key || isDocumentLoading}
                    onClick={() => handleDocumentView(key)}
                    className="flex w-full items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-left hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5 text-blue-600" />

                      <div>
                        <p className="text-sm font-medium text-slate-800">
                          {label}
                        </p>

                        <p className="text-[11px] text-slate-400">
                          {isDocumentLoading
                            ? "Loading document..."
                            : key
                              ? "Click to preview"
                              : "Not uploaded"}
                        </p>
                      </div>
                    </div>

                    {key && (
                      <ExternalLink className="h-4 w-4 text-slate-400" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-between border-t border-slate-200 px-6 py-5 sm:px-7">

            {bus.approvalStatus === "REJECTED" ? (
              <button
                type="button"
                onClick={() => setResubmitOpen(true)}
                className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Resubmit Bus
              </button>
            ) : (
              <div />
            )}

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100"
            >
              Close
            </button>
          </div>
        </div>

        {/* Document Preview */}
        {documentUrl && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/70 p-4">
            <div className="flex h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl">

              <div className="flex items-center justify-between border-b px-5 py-4">
                <h3 className="font-semibold text-slate-800">
                  Document Preview
                </h3>

                <button
                  type="button"
                  onClick={() => setDocumentUrl(null)}
                  className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <iframe
                src={documentUrl}
                title="Bus Document"
                className="h-full w-full flex-1"
              />
            </div>
          </div>
        )}
      </div>

      {/* Resubmit Bus Modal */}
      <ResubmitBusModal
        open={resubmitOpen}
        bus={bus}
        onClose={() => setResubmitOpen(false)}
        onSuccess={() => {
          setResubmitOpen(false);
          onUpdated();
        }}
      />
    </>
  );
};

export default BusDetailsModal;
