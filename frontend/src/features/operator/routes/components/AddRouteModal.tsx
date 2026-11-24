
import { useEffect, useState } from "react";
import type { ReactNode, FormEvent } from "react";

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
import RouteLocationPicker from "./RouteLocationPicker";

import type { IRouteLocation } from "@/types/route.types";

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

const toLocationForm = (
  location: IRouteLocation | null,
): LocationForm => {
  if (!location) {
    return { ...emptyLocation };
  }

  return {
    name: location.name,
    address: location.address,
    placeId: location.placeId,
    latitude: String(location.latitude),
    longitude: String(location.longitude),
  };
};

const toPickerLocation = (
  location: LocationForm,
): IRouteLocation | null => {
  if (
    !location.name ||
    !location.address ||
    !location.placeId ||
    location.latitude === "" ||
    location.longitude === ""
  ) {
    return null;
  }

  return {
    name: location.name,
    address: location.address,
    placeId: location.placeId,
    latitude: Number(location.latitude),
    longitude: Number(location.longitude),
  };
};

const AddRouteModal = ({
  open,
  onClose,
  onCreated,
}: AddRouteModalProps) => {
  const [routeName, setRouteName] = useState("");

  const [origin, setOrigin] =
    useState<LocationForm>({ ...emptyLocation });

  const [destination, setDestination] =
    useState<LocationForm>({ ...emptyLocation });

  const [stops, setStops] = useState<StopForm[]>([]);

  const [distanceKm, setDistanceKm] = useState("");
  const [durationHours, setDurationHours] = useState("");
  const [durationMinutes, setDurationMinutes] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;

    setRouteName("");
    setOrigin({ ...emptyLocation });
    setDestination({ ...emptyLocation });
    setStops([]);
    setDistanceKm("");
    setDurationHours("");
    setDurationMinutes("");
    setIsSubmitting(false);
  }, [open]);

  const updateOrigin = (location: IRouteLocation | null) => {
    setOrigin(toLocationForm(location));
  };

  const updateDestination = (location: IRouteLocation | null) => {
    setDestination(toLocationForm(location));
  };

  const updateStopLocation = (
    index: number,
    location: IRouteLocation | null,
  ) => {
    const updatedLocation = toLocationForm(location);

    setStops((prev) =>
      prev.map((stop, i) =>
        i === index
          ? {
              ...stop,
              ...updatedLocation,
            }
          : stop,
      ),
    );
  };

  const updateStopAccess = (
    index: number,
    field: "isBoardingPoint" | "isDroppingPoint",
    value: boolean,
  ) => {
    setStops((prev) =>
      prev.map((stop, i) =>
        i === index
          ? {
              ...stop,
              [field]: value,
            }
          : stop,
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
        .map((stop, i) => ({
          ...stop,
          order: i + 1,
        })),
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
      toast.error(`Please select a valid ${label} location`);
      return false;
    }

    const latitude = Number(location.latitude);
    const longitude = Number(location.longitude);

    if (
      !Number.isFinite(latitude) ||
      latitude < -90 ||
      latitude > 90
    ) {
      toast.error(`Invalid ${label} latitude`);
      return false;
    }

    if (
      !Number.isFinite(longitude) ||
      longitude < -180 ||
      longitude > 180
    ) {
      toast.error(`Invalid ${label} longitude`);
      return false;
    }

    return true;
  };

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    if (isSubmitting) return;

    if (routeName.trim().length < 3) {
      toast.error("Route name must contain at least 3 characters");
      return;
    }

    if (!validateLocation(origin, "origin")) return;

    if (!validateLocation(destination, "destination")) return;

    if (origin.placeId === destination.placeId) {
      toast.error(
        "Origin and destination cannot be the same location",
      );
      return;
    }

    const distance = Number(distanceKm);

    if (!Number.isFinite(distance) || distance <= 0) {
      toast.error("Please enter a valid route distance");
      return;
    }

    const hours = Number(durationHours || 0);
    const minutes = Number(durationMinutes || 0);

    if (
      !Number.isInteger(hours) ||
      !Number.isInteger(minutes) ||
      hours < 0 ||
      minutes < 0 ||
      minutes > 59 ||
      hours + minutes === 0
    ) {
      toast.error("Please enter a valid estimated duration");
      return;
    }

    const durationInSeconds = (hours * 60 + minutes) * 60;

    for (let i = 0; i < stops.length; i++) {
      const stop = stops[i];

      if (!validateLocation(stop, `stop ${i + 1}`)) {
        return;
      }

      if (!stop.isBoardingPoint && !stop.isDroppingPoint) {
        toast.error(
          `Select boarding or dropping point for stop ${i + 1}`,
        );
        return;
      }

      const existingPlaceIds = [
        origin.placeId,
        destination.placeId,
        ...stops
          .filter((_, index) => index !== i)
          .map((item) => item.placeId),
      ];

      if (existingPlaceIds.includes(stop.placeId)) {
        toast.error(
          `Stop ${i + 1} is already added to this route`,
        );
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

      estimatedDurationInSeconds: durationInSeconds,
    };

    try {
      setIsSubmitting(true);

      await createRoute(payload);

      toast.success("Route created successfully");

      onCreated();
      onClose();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to create route",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 py-8"
      onMouseDown={(e) => {
        if (
          e.target === e.currentTarget &&
          !isSubmitting
        ) {
          onClose();
        }
      }}
    >
      <div className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
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
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="space-y-6 overflow-y-auto px-6 py-6">
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

            <section className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-slate-800">
                  Route Locations
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  Search and select your starting and ending locations
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <MapPin size={18} />
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-slate-800">
                      Origin
                    </h4>

                    <p className="text-xs text-slate-400">
                      Starting location
                    </p>
                  </div>
                </div>

                <RouteLocationPicker
                  label="Search Origin"
                  value={toPickerLocation(origin)}
                  onChange={updateOrigin}
                  placeholder="Search starting location..."
                />
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-600">
                    <MapPin size={18} />
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-slate-800">
                      Destination
                    </h4>

                    <p className="text-xs text-slate-400">
                      Ending location
                    </p>
                  </div>
                </div>

                <RouteLocationPicker
                  label="Search Destination"
                  value={toPickerLocation(destination)}
                  onChange={updateDestination}
                  placeholder="Search destination..."
                />
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 p-5">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-semibold text-slate-800">
                    Intermediate Stops
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    Add passenger boarding and dropping locations
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
                  <MapPin
                    className="mx-auto mb-2 text-slate-400"
                    size={22}
                  />

                  <p className="text-sm font-medium text-slate-600">
                    No intermediate stops added
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Add stops where passengers can board or drop off
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

                      <RouteLocationPicker
                        label={`Search Stop ${index + 1}`}
                        value={toPickerLocation(stop)}
                        onChange={(location) =>
                          updateStopLocation(index, location)
                        }
                        placeholder={`Search stop ${index + 1} location...`}
                      />

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
                                updateStopAccess(
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
                                updateStopAccess(
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

            <section className="rounded-2xl border border-slate-200 p-5">
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-slate-800">
                  Route Details
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  Enter estimated journey distance and duration
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
                      onChange={(e) =>
                        setDistanceKm(e.target.value)
                      }
                    />

                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                      KM
                    </span>
                  </div>
                </Field>

                <Field label="Estimated Duration" required>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="relative">
                      <Clock
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <input
                        type="number"
                        min="0"
                        step="1"
                        className={`${inputClass} pl-9 pr-14`}
                        placeholder="Hours"
                        value={durationHours}
                        onChange={(e) =>
                          setDurationHours(e.target.value)
                        }
                      />

                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                        HRS
                      </span>
                    </div>

                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        max="59"
                        step="1"
                        className={`${inputClass} pr-14`}
                        placeholder="Minutes"
                        value={durationMinutes}
                        onChange={(e) =>
                          setDurationMinutes(e.target.value)
                        }
                      />

                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                        MINS
                      </span>
                    </div>
                  </div>
                </Field>
              </div>
            </section>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-white px-6 py-4 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
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
