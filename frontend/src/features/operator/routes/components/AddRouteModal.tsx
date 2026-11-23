import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import {
  X,
  Plus,
  Trash2,
  MapPin,
  Route as RouteIcon,
  Clock,
  Ruler,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";

import { createRoute } from "../service/routeService";

interface LocationForm {
  name: string;
  address: string;
  placeId: string;
  latitude: string;
  longitude: string;
}

interface StopForm extends LocationForm {
  order: number;
  isBoardingPoint: boolean;
  isDroppingPoint: boolean;
}

interface AddRouteModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

const emptyLocation: LocationForm = {
  name: "",
  address: "",
  placeId: "",
  latitude: "",
  longitude: "",
};

const inputClass =
  "h-[42px] w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100";

const textareaClass =
  "w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100";

interface FieldProps {
  label: string;
  required?: boolean;
  children: ReactNode;
}

const Field = ({ label, required, children }: FieldProps) => {
  return (
    <div className="space-y-1.5">
      <label className="block text-[11px] font-semibold uppercase tracking-wide text-slate-500">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
};

interface LocationFieldsProps {
  title: string;
  location: LocationForm;
  onChange: (field: keyof LocationForm, value: string) => void;
  accent: "blue" | "red" | "amber";
}

const LocationFields = ({
  title,
  location,
  onChange,
  accent,
}: LocationFieldsProps) => {
  const accentClasses = {
    blue: "bg-blue-50 text-blue-600",
    red: "bg-red-50 text-red-600",
    amber: "bg-amber-50 text-amber-600",
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
      <div className="mb-4 flex items-center gap-3">
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-lg ${accentClasses[accent]}`}
        >
          <MapPin size={18} />
        </div>

        <div>
          <h4 className="text-sm font-semibold text-slate-800">{title}</h4>
          <p className="text-xs text-slate-400">
            Enter the location details
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Location Name" required>
          <input
            className={inputClass}
            placeholder="e.g. Kozhikode"
            value={location.name}
            onChange={(e) => onChange("name", e.target.value)}
          />
        </Field>

        <Field label="Google Place ID" required>
          <input
            className={inputClass}
            placeholder="Enter place ID"
            value={location.placeId}
            onChange={(e) => onChange("placeId", e.target.value)}
          />
        </Field>

        <div className="sm:col-span-2">
          <Field label="Full Address" required>
            <textarea
              rows={2}
              className={textareaClass}
              placeholder="Enter the complete address"
              value={location.address}
              onChange={(e) => onChange("address", e.target.value)}
            />
          </Field>
        </div>

        <Field label="Latitude" required>
          <input
            type="number"
            step="any"
            className={inputClass}
            placeholder="e.g. 11.2588"
            value={location.latitude}
            onChange={(e) => onChange("latitude", e.target.value)}
          />
        </Field>

        <Field label="Longitude" required>
          <input
            type="number"
            step="any"
            className={inputClass}
            placeholder="e.g. 75.7804"
            value={location.longitude}
            onChange={(e) => onChange("longitude", e.target.value)}
          />
        </Field>
      </div>
    </div>
  );
};

const AddRouteModal = ({
  open,
  onClose,
  onCreated,
}: AddRouteModalProps) => {
  const [routeName, setRouteName] = useState("");
  const [origin, setOrigin] = useState<LocationForm>(emptyLocation);
  const [destination, setDestination] =
    useState<LocationForm>(emptyLocation);

  const [stops, setStops] = useState<StopForm[]>([]);
  const [distanceKm, setDistanceKm] = useState("");
  const [durationMinutes, setDurationMinutes] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;

    setRouteName("");
    setOrigin({ ...emptyLocation });
    setDestination({ ...emptyLocation });
    setStops([]);
    setDistanceKm("");
    setDurationMinutes("");
    setIsSubmitting(false);
  }, [open]);

  if (!open) return null;

  const updateOrigin = (field: keyof LocationForm, value: string) => {
    setOrigin((prev) => ({ ...prev, [field]: value }));
  };

  const updateDestination = (field: keyof LocationForm, value: string) => {
    setDestination((prev) => ({ ...prev, [field]: value }));
  };

  const updateStop = (
    index: number,
    field: keyof StopForm,
    value: string | boolean,
  ) => {
    setStops((prev) =>
      prev.map((stop, i) =>
        i === index ? { ...stop, [field]: value } : stop,
      ),
    );
  };

  const addStop = () => {
    setStops((prev) => [
      ...prev,
      {
        ...emptyLocation,
        order: prev.length + 1,
        isBoardingPoint: false,
        isDroppingPoint: false,
      },
    ]);
  };

  const removeStop = (index: number) => {
    setStops((prev) =>
      prev
        .filter((_, i) => i !== index)
        .map((stop, i) => ({ ...stop, order: i + 1 })),
    );
  };

  const convertLocation = (location: LocationForm) => ({
    name: location.name.trim(),
    address: location.address.trim(),
    placeId: location.placeId.trim(),
    latitude: Number(location.latitude),
    longitude: Number(location.longitude),
  });

  const validateLocation = (
    location: LocationForm,
    label: string,
  ): boolean => {
    if (
      !location.name.trim() ||
      !location.address.trim() ||
      !location.placeId.trim() ||
      location.latitude.trim() === "" ||
      location.longitude.trim() === ""
    ) {
      toast.error(`Please complete all ${label} location fields`);
      return false;
    }

    const latitude = Number(location.latitude);
    const longitude = Number(location.longitude);

    if (
      !Number.isFinite(latitude) ||
      latitude < -90 ||
      latitude > 90
    ) {
      toast.error(`Please enter a valid ${label} latitude`);
      return false;
    }

    if (
      !Number.isFinite(longitude) ||
      longitude < -180 ||
      longitude > 180
    ) {
      toast.error(`Please enter a valid ${label} longitude`);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (routeName.trim().length < 3) {
      toast.error("Route name must contain at least 3 characters");
      return;
    }

    if (!validateLocation(origin, "origin")) return;
    if (!validateLocation(destination, "destination")) return;

    if (origin.placeId.trim() === destination.placeId.trim()) {
      toast.error("Origin and destination cannot be the same location");
      return;
    }

    const distance = Number(distanceKm);
    const duration = Number(durationMinutes);

    if (!Number.isFinite(distance) || distance <= 0) {
      toast.error("Please enter a valid route distance");
      return;
    }

    if (!Number.isFinite(duration) || duration <= 0) {
      toast.error("Please enter a valid estimated duration");
      return;
    }

    for (let i = 0; i < stops.length; i++) {
      const stop = stops[i];

      if (!validateLocation(stop, `stop ${i + 1}`)) return;

      if (!stop.isBoardingPoint && !stop.isDroppingPoint) {
        toast.error(
          `Select boarding or dropping point for stop ${i + 1}`,
        );
        return;
      }

      const existingPlaceIds = [
        origin.placeId.trim(),
        destination.placeId.trim(),
        ...stops
          .filter((_, index) => index !== i)
          .map((item) => item.placeId.trim()),
      ];

      if (existingPlaceIds.includes(stop.placeId.trim())) {
        toast.error(`Stop ${i + 1} is already added to this route`);
        return;
      }
    }

    const payload = {
      routeName: routeName.trim(),
      origin: convertLocation(origin),
      destination: convertLocation(destination),
      stops: stops.map((stop, index) => ({
        ...convertLocation(stop),
        order: index + 1,
        isBoardingPoint: stop.isBoardingPoint,
        isDroppingPoint: stop.isDroppingPoint,
      })),
      distanceInMeters: Math.round(distance * 1000),
      estimatedDurationInSeconds: Math.round(duration * 60),
    };

    try {
      setIsSubmitting(true);

      await createRoute(payload);

      toast.success("Route created successfully");
      onCreated();
      onClose();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create route",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 py-8"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) onClose();
      }}
    >
      <div className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">
              Add New Route
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Create a route with origin, destination and intermediate stops
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Content */}
        <form
          onSubmit={handleSubmit}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="space-y-6 overflow-y-auto px-6 py-6">
            {/* Basic Information */}
            <section className="rounded-2xl border border-slate-200 p-5">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <RouteIcon size={18} />
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-slate-800">
                    Basic Information
                  </h3>
                  <p className="text-xs text-slate-400">
                    Give your route a recognizable name
                  </p>
                </div>
              </div>

              <Field label="Route Name" required>
                <input
                  className={inputClass}
                  placeholder="e.g. Kozhikode - Bangalore"
                  value={routeName}
                  onChange={(e) => setRouteName(e.target.value)}
                  maxLength={100}
                />
              </Field>
            </section>

            {/* Route Locations */}
            <section className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-slate-800">
                  Route Locations
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Define where the journey starts and ends
                </p>
              </div>

              <LocationFields
                title="Origin"
                location={origin}
                onChange={updateOrigin}
                accent="blue"
              />

              <LocationFields
                title="Destination"
                location={destination}
                onChange={updateDestination}
                accent="red"
              />
            </section>

            {/* Intermediate Stops */}
            <section className="rounded-2xl border border-slate-200 p-5">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-semibold text-slate-800">
                    Intermediate Stops
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    Add boarding and dropping points along the route
                  </p>
                </div>

                <button
                  type="button"
                  onClick={addStop}
                  className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-600 transition hover:bg-blue-100"
                >
                  <Plus size={15} />
                  Add Stop
                </button>
              </div>

              {stops.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center">
                  <MapPin className="mx-auto mb-2 text-slate-400" size={22} />
                  <p className="text-sm font-medium text-slate-600">
                    No intermediate stops added
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Add stops if passengers can board or drop off between the
                    origin and destination
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {stops.map((stop, index) => (
                    <div
                      key={index}
                      className="rounded-xl border border-slate-200 bg-slate-50/70 p-4"
                    >
                      <div className="mb-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700">
                            {index + 1}
                          </span>

                          <h4 className="text-sm font-semibold text-slate-700">
                            Stop {index + 1}
                          </h4>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeStop(index)}
                          className="rounded-lg p-2 text-red-500 transition hover:bg-red-50"
                          title="Remove stop"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <Field label="Location Name" required>
                          <input
                            className={inputClass}
                            placeholder="e.g. Thrissur"
                            value={stop.name}
                            onChange={(e) =>
                              updateStop(index, "name", e.target.value)
                            }
                          />
                        </Field>

                        <Field label="Google Place ID" required>
                          <input
                            className={inputClass}
                            placeholder="Enter place ID"
                            value={stop.placeId}
                            onChange={(e) =>
                              updateStop(index, "placeId", e.target.value)
                            }
                          />
                        </Field>

                        <div className="sm:col-span-2">
                          <Field label="Full Address" required>
                            <textarea
                              rows={2}
                              className={textareaClass}
                              placeholder="Enter the complete address"
                              value={stop.address}
                              onChange={(e) =>
                                updateStop(index, "address", e.target.value)
                              }
                            />
                          </Field>
                        </div>

                        <Field label="Latitude" required>
                          <input
                            type="number"
                            step="any"
                            className={inputClass}
                            placeholder="Latitude"
                            value={stop.latitude}
                            onChange={(e) =>
                              updateStop(index, "latitude", e.target.value)
                            }
                          />
                        </Field>

                        <Field label="Longitude" required>
                          <input
                            type="number"
                            step="any"
                            className={inputClass}
                            placeholder="Longitude"
                            value={stop.longitude}
                            onChange={(e) =>
                              updateStop(index, "longitude", e.target.value)
                            }
                          />
                        </Field>
                      </div>

                      <div className="mt-4 border-t border-slate-200 pt-4">
                        <p className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                          Passenger Access
                        </p>

                        <div className="flex flex-wrap gap-4">
                          <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
                            <input
                              type="checkbox"
                              checked={stop.isBoardingPoint}
                              onChange={(e) =>
                                updateStop(
                                  index,
                                  "isBoardingPoint",
                                  e.target.checked,
                                )
                              }
                              className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                            />
                            Boarding Point
                          </label>

                          <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
                            <input
                              type="checkbox"
                              checked={stop.isDroppingPoint}
                              onChange={(e) =>
                                updateStop(
                                  index,
                                  "isDroppingPoint",
                                  e.target.checked,
                                )
                              }
                              className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                            />
                            Dropping Point
                          </label>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Distance and Duration */}
            <section className="rounded-2xl border border-slate-200 p-5">
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-slate-800">
                  Route Details
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Provide the estimated journey distance and duration
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Distance (KM)" required>
                  <div className="relative">
                    <Ruler
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type="number"
                      min="0.1"
                      step="any"
                      className={`${inputClass} pl-9 pr-12`}
                      placeholder="e.g. 350"
                      value={distanceKm}
                      onChange={(e) => setDistanceKm(e.target.value)}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                      KM
                    </span>
                  </div>
                </Field>

                <Field label="Estimated Duration (Minutes)" required>
                  <div className="relative">
                    <Clock
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type="number"
                      min="1"
                      step="1"
                      className={`${inputClass} pl-9 pr-16`}
                      placeholder="e.g. 480"
                      value={durationMinutes}
                      onChange={(e) => setDurationMinutes(e.target.value)}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                      MINS
                    </span>
                  </div>
                </Field>
              </div>
            </section>
          </div>

          {/* Footer */}
          <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-white px-6 py-4 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus size={16} />
                  Create Route
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRouteModal;