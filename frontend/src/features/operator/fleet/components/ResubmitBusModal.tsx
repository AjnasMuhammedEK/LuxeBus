
import { useEffect, useState } from "react";
import { X, Upload, Loader2, FileText } from "lucide-react";
import toast from "react-hot-toast";

import {
  getSeatLayouts,
  resubmitBus,
} from "../service/busService";

import type {
  IBus,
  ISeatLayout,
  BusAmenity,
} from "@/types/fleet.types";

interface ResubmitBusModalProps {
  open: boolean;
  bus: IBus | null;
  onClose: () => void;
  onSuccess: () => void;
}

interface ResubmitFormData {
  manufacturer: string;
  model: string;
  registrationNumber: string;
  manufacturingYear: string;
  seatLayoutId: string;
  amenities: BusAmenity[];
}

const AMENITIES: {
  label: string;
  value: BusAmenity;
}[] = [
  { label: "Air Conditioning", value: "AC" },
  { label: "Wi-Fi", value: "WIFI" },
  { label: "Charging Port", value: "CHARGING_PORT" },
  { label: "Water Bottle", value: "WATER_BOTTLE" },
  { label: "Reading Light", value: "READING_LIGHT" },
];

const DOCUMENT_FIELDS = [
  { label: "Registration Certificate", key: "rc" },
  { label: "Fitness Certificate", key: "fitnessCertificate" },
  { label: "Insurance", key: "insurance" },
] as const;

// Wrapper component
const ResubmitBusModal = (props: ResubmitBusModalProps) => {
  const { open, bus } = props;

  if (!open || !bus) return null;

  return (
    <ResubmitBusModalContent
      key={bus._id}
      {...props}
      bus={bus}
    />
  );
};

// Actual modal component
const ResubmitBusModalContent = ({
  bus,
  onClose,
  onSuccess,
}: Omit<ResubmitBusModalProps, "bus" | "open"> & {
  bus: IBus;
}) => {
  const [layouts, setLayouts] = useState<ISeatLayout[]>([]);
  const [isLoadingLayouts, setIsLoadingLayouts] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form directly from the selected bus
  const [formData, setFormData] = useState<ResubmitFormData>(() => ({
    manufacturer: bus.manufacturer,
    model: bus.model,
    registrationNumber: bus.registrationNumber,
    manufacturingYear: String(bus.manufacturingYear),
    seatLayoutId: bus.seatLayoutId,
    amenities: [...bus.amenities],
  }));

  const [documents, setDocuments] = useState({
    rc: null as File | null,
    fitnessCertificate: null as File | null,
    insurance: null as File | null,
  });

  // Fetch seat layouts when the modal mounts
  useEffect(() => {
    let cancelled = false;

    getSeatLayouts()
      .then((response) => {
        if (!cancelled) {
          setLayouts(response.data || []);
        }
      })
      .catch((error) => {
        if (!cancelled) {
          console.error(error);
          toast.error("Unable to load seat layouts");
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoadingLayouts(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleChange = (
    field: keyof ResubmitFormData,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAmenityChange = (amenity: BusAmenity) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((item) => item !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const handleDocumentChange = (
    key: keyof typeof documents,
    file: File | null
  ) => {
    setDocuments((prev) => ({
      ...prev,
      [key]: file,
    }));
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!formData.manufacturer.trim()) {
      toast.error("Manufacturer is required");
      return;
    }

    if (!formData.model.trim()) {
      toast.error("Model is required");
      return;
    }

    if (!formData.registrationNumber.trim()) {
      toast.error("Registration number is required");
      return;
    }

    if (
      !formData.manufacturingYear ||
      Number(formData.manufacturingYear) < 1900 ||
      Number(formData.manufacturingYear) > new Date().getFullYear()
    ) {
      toast.error("Please enter a valid manufacturing year");
      return;
    }

    if (!formData.seatLayoutId) {
      toast.error("Please select a seat layout");
      return;
    }

    try {
      setIsSubmitting(true);

      const payload = new FormData();

      payload.append("manufacturer", formData.manufacturer.trim());
      payload.append("model", formData.model.trim());

      payload.append(
        "registrationNumber",
        formData.registrationNumber.trim().toUpperCase()
      );

      payload.append(
        "manufacturingYear",
        formData.manufacturingYear
      );

      payload.append("seatLayoutId", formData.seatLayoutId);

      payload.append(
        "amenities",
        JSON.stringify(formData.amenities)
      );

      // Upload only replacement documents
      if (documents.rc) {
        payload.append("rc", documents.rc);
      }

      if (documents.fitnessCertificate) {
        payload.append(
          "fitnessCertificate",
          documents.fitnessCertificate
        );
      }

      if (documents.insurance) {
        payload.append("insurance", documents.insurance);
      }

      await resubmitBus(bus._id, payload);

      toast.success("Bus resubmitted successfully");

      onSuccess();
    } catch (error) {
      console.error("Bus resubmission failed:", error);
      toast.error("Unable to resubmit bus");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4">
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl bg-white shadow-xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-5">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Resubmit Bus
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Update the rejected bus details and resubmit for approval.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="overflow-y-auto p-5"
        >
          {/* Rejection Reason */}
          {bus.rejectReason && (
            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4">
              <p className="text-sm font-semibold text-red-700">
                Admin Rejection Reason
              </p>

              <p className="mt-1 text-sm text-red-600">
                {bus.rejectReason}
              </p>
            </div>
          )}

          {/* Basic Information */}
          <h3 className="mb-4 font-semibold text-gray-800">
            Bus Information
          </h3>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Manufacturer
              </label>

              <input
                type="text"
                value={formData.manufacturer}
                onChange={(e) =>
                  handleChange("manufacturer", e.target.value)
                }
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Model
              </label>

              <input
                type="text"
                value={formData.model}
                onChange={(e) =>
                  handleChange("model", e.target.value)
                }
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Registration Number
              </label>

              <input
                type="text"
                value={formData.registrationNumber}
                onChange={(e) =>
                  handleChange("registrationNumber", e.target.value)
                }
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2 uppercase outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Manufacturing Year
              </label>

              <input
                type="number"
                value={formData.manufacturingYear}
                onChange={(e) =>
                  handleChange("manufacturingYear", e.target.value)
                }
                min="1900"
                max={new Date().getFullYear()}
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Seat Layout */}
          <div className="mt-6">
            <h3 className="mb-3 font-semibold text-gray-800">
              Seat Layout
            </h3>

            <select
              value={formData.seatLayoutId}
              onChange={(e) =>
                handleChange("seatLayoutId", e.target.value)
              }
              required
              disabled={isLoadingLayouts}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
            >
              <option value="">
                {isLoadingLayouts
                  ? "Loading layouts..."
                  : "Select seat layout"}
              </option>

              {layouts.map((layout) => (
                <option key={layout._id} value={layout._id}>
                  {layout.name} - {layout.totalCapacity} Seats
                </option>
              ))}
            </select>
          </div>

          {/* Amenities */}
          <div className="mt-6">
            <h3 className="mb-3 font-semibold text-gray-800">
              Amenities
            </h3>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {AMENITIES.map((amenity) => (
                <label
                  key={amenity.value}
                  className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 p-3 text-sm"
                >
                  <input
                    type="checkbox"
                    checked={formData.amenities.includes(amenity.value)}
                    onChange={() =>
                      handleAmenityChange(amenity.value)
                    }
                    className="h-4 w-4 accent-blue-600"
                  />

                  {amenity.label}
                </label>
              ))}
            </div>
          </div>

          {/* Documents */}
          <div className="mt-6">
            <h3 className="mb-1 font-semibold text-gray-800">
              Bus Documents
            </h3>

            <p className="mb-4 text-xs text-gray-500">
              Existing documents will be retained unless you upload replacements.
            </p>

            <div className="space-y-4">
              {DOCUMENT_FIELDS.map((document) => {
                const selectedFile = documents[document.key];

                return (
                  <div
                    key={document.key}
                    className="rounded-lg border border-gray-200 p-4"
                  >
                    <div className="mb-3 flex items-center gap-2">
                      <FileText
                        size={18}
                        className="text-gray-500"
                      />

                      <span className="text-sm font-medium text-gray-800">
                        {document.label}
                      </span>
                    </div>

                    <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-gray-300 p-3 text-sm text-gray-600 hover:bg-gray-50">
                      <Upload size={16} />

                      {selectedFile
                        ? selectedFile.name
                        : "Choose replacement document"}

                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="hidden"
                        onChange={(e) =>
                          handleDocumentChange(
                            document.key,
                            e.target.files?.[0] || null
                          )
                        }
                      />
                    </label>

                    <p className="mt-2 text-xs text-green-600">
                      {selectedFile
                        ? "New document selected"
                        : "Current document will be retained"}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-7 flex flex-col-reverse justify-end gap-3 border-t border-gray-200 pt-5 sm:flex-row">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting || isLoadingLayouts}
              className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Resubmitting...
                </>
              ) : (
                "Resubmit for Approval"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResubmitBusModal;
