import { useEffect, useMemo, useState } from "react";
import {
  X,
  Bus as BusIcon,
  Factory,
  Hash,
  Calendar,
  LayoutGrid,
  Sparkles,
  FileText,
  ShieldCheck,
  UploadCloud,
  CheckCircle2,
  Loader2,
  Check,
} from "lucide-react";
import toast from "react-hot-toast";

import { createBus, getSeatLayouts } from "../service/busService";
import SeatLayoutPreview from "./SeatLayoutPreview";
import {
  addBusSchema,
  busDocumentsSchema,
  getValidationErrors,
  normalizeRegistration,
} from "../validation/busValidation";

import type {
  BusAmenity,
  BusFormErrors,
  BusType,
  IBusDocumentFiles,
  ISeatLayout,
} from "@/types/fleet.types";

interface AddBusModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

const emptyForm = {
  manufacturer: "",
  model: "",
  registrationNumber: "",
  manufacturingYear: "",
};

const emptyFiles: IBusDocumentFiles = {
  rc: null,
  fitnessCertificate: null,
  insurance: null,
};

const amenitiesList: { label: string; value: BusAmenity }[] = [
  { label: "Air Conditioning", value: "AC" },
  { label: "Wi-Fi", value: "WIFI" },
  { label: "Charging Port", value: "CHARGING_PORT" },
  { label: "Water Bottle", value: "WATER_BOTTLE" },
  { label: "Reading Light", value: "READING_LIGHT" },
];

const documentSlots: {
  key: keyof IBusDocumentFiles;
  icon: typeof FileText;
  title: string;
  subtitle: string;
}[] = [
  { key: "rc", icon: FileText, title: "Registration Certificate", subtitle: "RC book copy" },
  { key: "fitnessCertificate", icon: ShieldCheck, title: "Fitness Certificate", subtitle: "Valid fitness certificate" },
  { key: "insurance", icon: ShieldCheck, title: "Insurance", subtitle: "Valid insurance policy" },
];

const inputWrap = (error?: string) =>
  `flex h-[42px] items-center gap-2 rounded-lg border bg-slate-50 px-3 ring-1 ring-transparent transition-shadow focus-within:border-blue-400 focus-within:ring-blue-100 ${
    error ? "border-red-400" : "border-slate-200"
  }`;

const AddBusModal = ({ open, onClose, onCreated }: AddBusModalProps) => {
  const [formData, setFormData] = useState(emptyForm);
  const [seatLayoutId, setSeatLayoutId] = useState("");
  const [amenities, setAmenities] = useState<BusAmenity[]>([]);
  const [files, setFiles] = useState<IBusDocumentFiles>(emptyFiles);

  const [layouts, setLayouts] = useState<ISeatLayout[]>([]);
  const [loadingLayouts, setLoadingLayouts] = useState(false);
  const [typeFilter, setTypeFilter] = useState<"ALL" | BusType>("ALL");

  const [errors, setErrors] = useState<BusFormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  // Load active layouts from the DB every time the modal opens
  useEffect(() => {
    if (!open) return;

    let cancelled = false;

    const loadLayouts = async () => {
      try {
        setLoadingLayouts(true);
        const response = await getSeatLayouts();
        if (!cancelled) setLayouts(response.data as ISeatLayout[]);
      } catch {
        if (!cancelled) toast.error("Unable to load seat layouts");
      } finally {
        if (!cancelled) setLoadingLayouts(false);
      }
    };

    void loadLayouts();

    return () => {
      cancelled = true;
    };
  }, [open]);

  const availableTypes = useMemo(
    () => Array.from(new Set(layouts.map((layout) => layout.busType))),
    [layouts]
  );

  const filteredLayouts = useMemo(
    () =>
      typeFilter === "ALL"
        ? layouts
        : layouts.filter((layout) => layout.busType === typeFilter),
    [layouts, typeFilter]
  );

  const selectedLayout = useMemo(
    () => layouts.find((layout) => layout._id === seatLayoutId) ?? null,
    [layouts, seatLayoutId]
  );

  if (!open) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange =
    (key: keyof IBusDocumentFiles) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] ?? null;
      setFiles((prev) => ({ ...prev, [key]: file }));
    };

  const toggleAmenity = (amenity: BusAmenity) => {
    setAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((item) => item !== amenity)
        : [...prev, amenity]
    );
  };

  const resetAndClose = () => {
    setFormData(emptyForm);
    setSeatLayoutId("");
    setAmenities([]);
    setFiles({ ...emptyFiles });
    setTypeFilter("ALL");
    setErrors({});
    onClose();
  };

  const handleSubmit = async () => {
    if (isLoading) return;

    try {
      // 1. Validate form fields + documents
      const basic = getValidationErrors(addBusSchema, { ...formData, seatLayoutId });
      const docs = getValidationErrors(busDocumentsSchema, files);

      const allErrors: BusFormErrors = {
        ...(basic.success ? {} : (basic.errors as BusFormErrors)),
        ...(docs.success ? {} : (docs.errors as BusFormErrors)),
      };

      if (Object.keys(allErrors).length > 0) {
        setErrors(allErrors);

        const firstError = Object.values(allErrors)[0];
        if (firstError) toast.error(firstError);

        return;
      }

      setErrors({});

      // 2. Start loading only after validation passes
      setIsLoading(true);

      // 3. Build FormData (same pattern as AddStaffModal)
      const data = new FormData();

      data.append("manufacturer", formData.manufacturer.trim());
      data.append("model", formData.model.trim());
      data.append(
        "registrationNumber",
        normalizeRegistration(formData.registrationNumber)
      );
      data.append("manufacturingYear", formData.manufacturingYear.trim());
      data.append("seatLayoutId", seatLayoutId);
      data.append("amenities", JSON.stringify(amenities));

      // busType is NOT sent. The backend takes it from the selected layout.

      if (files.rc) data.append("rc", files.rc);
      if (files.fitnessCertificate) {
        data.append("fitnessCertificate", files.fitnessCertificate);
      }
      if (files.insurance) data.append("insurance", files.insurance);

      await createBus(data);

      toast.success("Bus submitted for admin approval");

      onCreated();

      resetAndClose();
    } catch (error) {
      console.error("Add bus error:", error);

      toast.error(
        error instanceof Error ? error.message : "Failed to add bus. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 py-8">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-slate-200 bg-white">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5 sm:px-7">
          <div>
            <p className="text-xs text-slate-400">Fleet Management / Add New Bus</p>
            <h2 className="mt-1 text-xl font-bold text-slate-900">Register New Bus</h2>
            <p className="mt-1 text-sm text-slate-500">
              Submit your bus details. It will go live after admin approval.
            </p>
          </div>
          <button
            type="button"
            onClick={resetAndClose}
            disabled={isLoading}
            className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col gap-6 px-6 py-6 sm:px-7">
          {/* Bus Details */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="flex items-center gap-2">
              <BusIcon className="h-4 w-4 text-blue-700" />
              <h3 className="text-sm font-bold text-slate-900">Bus Details</h3>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Manufacturer" error={errors.manufacturer}>
                <Factory className="h-4 w-4 shrink-0 text-slate-400" />
                <input
                  name="manufacturer"
                  value={formData.manufacturer}
                  onChange={handleChange}
                  placeholder="e.g. Volvo"
                  className="w-full bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
                />
              </Field>

              <Field label="Bus Model" error={errors.model}>
                <BusIcon className="h-4 w-4 shrink-0 text-slate-400" />
                <input
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  placeholder="e.g. B11R"
                  className="w-full bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
                />
              </Field>

              <Field label="Registration Number" error={errors.registrationNumber}>
                <Hash className="h-4 w-4 shrink-0 text-slate-400" />
                <input
                  name="registrationNumber"
                  value={formData.registrationNumber}
                  onChange={handleChange}
                  placeholder="KL 10 AB 1234"
                  className="w-full bg-transparent text-sm font-medium uppercase text-slate-900 outline-none placeholder:normal-case placeholder:text-slate-400"
                />
              </Field>

              <Field label="Manufacturing Year" error={errors.manufacturingYear}>
                <Calendar className="h-4 w-4 shrink-0 text-slate-400" />
                <input
                  name="manufacturingYear"
                  inputMode="numeric"
                  maxLength={4}
                  value={formData.manufacturingYear}
                  onChange={handleChange}
                  placeholder="2024"
                  className="w-full bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
                />
              </Field>
            </div>
          </div>

          {/* Seat Layout */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="flex items-center gap-2">
              <LayoutGrid className="h-4 w-4 text-blue-700" />
              <h3 className="text-sm font-bold text-slate-900">Seat Layout</h3>
            </div>
            <p className="mt-1.5 text-xs text-slate-500">
              Choose a layout. The bus type is set automatically from the layout you pick.
            </p>

            {availableTypes.length > 1 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {(["ALL", ...availableTypes] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setTypeFilter(type)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                      typeFilter === type
                        ? "bg-blue-900 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {type === "ALL" ? "All Types" : type.replaceAll("_", " ")}
                  </button>
                ))}
              </div>
            )}

            {loadingLayouts ? (
              <div className="flex items-center justify-center py-10 text-slate-400">
                <Loader2 className="h-5 w-5 animate-spin" />
              </div>
            ) : filteredLayouts.length === 0 ? (
              <p className="mt-5 rounded-lg bg-slate-50 p-6 text-center text-sm text-slate-500">
                No active seat layouts available.
              </p>
            ) : (
              <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[260px_1fr]">
                <div className="flex max-h-[420px] flex-col gap-2 overflow-y-auto pr-1">
                  {filteredLayouts.map((layout) => {
                    const selected = layout._id === seatLayoutId;
                    return (
                      <button
                        key={layout._id}
                        type="button"
                        onClick={() => setSeatLayoutId(layout._id)}
                        className={`rounded-xl border p-4 text-left transition ${
                          selected
                            ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500"
                            : errors.seatLayoutId
                              ? "border-red-300 hover:border-red-400"
                              : "border-slate-200 hover:border-slate-400"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-slate-900">
                            {layout.name}
                          </span>
                          {selected && <Check className="h-4 w-4 text-blue-700" />}
                        </div>
                        <p className="mt-1 text-xs text-slate-500">
                          {layout.busType.replaceAll("_", " ")} · {layout.totalCapacity} seats ·{" "}
                          {layout.decks.length} deck{layout.decks.length > 1 ? "s" : ""}
                        </p>
                      </button>
                    );
                  })}
                </div>

                <div>
                  {selectedLayout ? (
                    <SeatLayoutPreview layout={selectedLayout} />
                  ) : (
                    <div className="flex h-full min-h-[200px] items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-400">
                      Select a layout to preview it here
                    </div>
                  )}
                </div>
              </div>
            )}

            {errors.seatLayoutId && (
              <span className="mt-2 block text-[11px] font-medium text-red-500">
                {errors.seatLayoutId}
              </span>
            )}
          </div>

          {/* Amenities */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-blue-700" />
              <h3 className="text-sm font-bold text-slate-900">Amenities</h3>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {amenitiesList.map((amenity) => (
                <label
                  key={amenity.value}
                  className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3"
                >
                  <input
                    type="checkbox"
                    checked={amenities.includes(amenity.value)}
                    onChange={() => toggleAmenity(amenity.value)}
                    className="h-4 w-4 accent-blue-800"
                  />
                  <span className="text-sm font-medium text-slate-700">{amenity.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Documents */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-700" />
              <h3 className="text-sm font-bold text-slate-900">Document Upload</h3>
            </div>
            <p className="mt-1.5 text-xs text-slate-500">
              All three documents are required. Supported formats: PDF, JPG, PNG (Max 10MB each).
            </p>

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {documentSlots.map(({ key, icon: Icon, title, subtitle }) => {
                const file = files[key];
                return (
                  <div key={key}>
                    <label
                      className={`flex cursor-pointer flex-col items-center gap-2 rounded-xl border border-dashed bg-slate-50 px-4 py-6 text-center ${
                        errors[key] ? "border-red-400" : "border-slate-300"
                      }`}
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100">
                        {file ? (
                          <CheckCircle2 className="h-4 w-4 text-blue-700" />
                        ) : (
                          <Icon className="h-4 w-4 text-blue-700" />
                        )}
                      </div>
                      <p className="text-xs font-semibold text-slate-800">{title}</p>
                      <p className="max-w-full truncate text-[11px] text-slate-500">
                        {file ? file.name : subtitle}
                      </p>
                      <span className="mt-1 inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700">
                        <UploadCloud className="h-3.5 w-3.5" />
                        {file ? "Change file" : "Choose file"}
                      </span>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleFileChange(key)}
                        className="hidden"
                      />
                    </label>
                    {errors[key] && (
                      <span className="mt-1 block text-[11px] font-medium text-red-500">
                        {errors[key]}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <p className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            After submission, your bus will be sent to the admin for approval.
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-5 sm:px-7">
          <button
            type="button"
            onClick={resetAndClose}
            disabled={isLoading}
            className="rounded-lg px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className="flex h-[42px] min-w-[160px] items-center justify-center gap-1.5 rounded-lg bg-blue-900 px-5 text-sm font-semibold text-white shadow-md shadow-blue-900/20 transition-colors hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-80"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Bus"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const Field = ({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) => (
  <label className="flex flex-col gap-1.5">
    <span className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
      {label}
    </span>
    <div className={inputWrap(error)}>{children}</div>
    {error && <span className="text-[11px] font-medium text-red-500">{error}</span>}
  </label>
);

export default AddBusModal;