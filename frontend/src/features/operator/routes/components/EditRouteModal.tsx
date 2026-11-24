
import { useEffect, useState } from "react";
import type { FormEvent, ReactNode } from "react";

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

import {
  getRouteById,
  updateRoute,
} from "../service/routeService";

import RouteLocationPicker from "./RouteLocationPicker";

import type {
  IRoute,
  IRouteLocation,
  IRouteStop,
} from "@/types/route.types";

interface LocationForm {
  name: string;
  address: string;
  placeId: string;
  latitude: string;
  longitude: string;
}

interface StopForm extends LocationForm {
  isBoardingPoint: boolean;
  isDroppingPoint: boolean;
}

interface EditRouteModalProps {
  open: boolean;
  routeId: string | null;
  onClose: () => void;
  onUpdated: () => void;
}

interface FieldProps {
  label: string;
  required?: boolean;
  children: ReactNode;
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

const Field = ({ label, required, children }: FieldProps) => (
  <div className="space-y-1.5">
    <label className="block text-[11px] font-semibold uppercase tracking-wide text-slate-500">
      {label}
      {required && <span className="ml-1 text-red-500">*</span>}
    </label>
    {children}
  </div>
);

const toLocationForm = (
  location?: IRouteLocation | null,
): LocationForm => {
  if (!location) return { ...emptyLocation };

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

const convertLocation = (location: LocationForm): IRouteLocation => ({
  name: location.name.trim(),
  address: location.address.trim(),
  placeId: location.placeId.trim(),
  latitude: Number(location.latitude),
  longitude: Number(location.longitude),
});

const EditRouteModal = ({
  open,
  routeId,
  onClose,
  onUpdated,
}: EditRouteModalProps) => {
  const [routeName, setRouteName] = useState("");
  const [origin, setOrigin] = useState<LocationForm>({ ...emptyLocation });
  const [destination, setDestination] = useState<LocationForm>({
    ...emptyLocation,
  });
  const [stops, setStops] = useState<StopForm[]>([]);
  const [distanceKm, setDistanceKm] = useState("");
  const [durationMinutes, setDurationMinutes] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load the latest route details whenever the modal opens.
  useEffect(() => {
    if (!open || !routeId) return;

    let cancelled = false;

    const loadRoute = async () => {
      try {
        setIsLoading(true);

        const response = await getRouteById(routeId);

        // routeService returns Axios response.data.
        // The backend common response is expected to contain data.
        const result = response?.data;
        const route: IRoute | undefined =
          result?.route ?? result;

        if (!route?._id) {
          throw new Error("Invalid route details response");
        }

        if (cancelled) return;

        setRouteName(route.routeName);
        setOrigin(toLocationForm(route.origin));
        setDestination(toLocationForm(route.destination));

        setStops(
          [...(route.stops ?? [])]
            .sort((a, b) => a.order - b.order)
            .map((stop: IRouteStop) => ({
              ...toLocationForm(stop),
              isBoardingPoint: stop.isBoardingPoint,
              isDroppingPoint: stop.isDroppingPoint,
            })),
        );

        setDistanceKm(String(route.distanceInMeters / 1000));
        setDurationMinutes(
          String(Math.round(route.estimatedDurationInSeconds / 60)),
        );
      } catch (error) {
        if (cancelled) return;

        console.error("Failed to load route:", error);

        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to load route details",
        );
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    void loadRoute();

    return () => {
      cancelled = true;
    };
  }, [open, routeId]);

  const updateStopLocation = (
    index: number,
    location: IRouteLocation | null,
  ) => {
    const updatedLocation = toLocationForm(location);

    setStops((previous) =>
      previous.map((stop, currentIndex) =>
        currentIndex === index
          ? { ...stop, ...updatedLocation }
          : stop,
      ),
    );
  };

  const updateStopAccess = (
    index: number,
    field: "isBoardingPoint" | "isDroppingPoint",
    value: boolean,
  ) => {
    setStops((previous) =>
      previous.map((stop, currentIndex) =>
        currentIndex === index
          ? { ...stop, [field]: value }
          : stop,
      ),
    );
  };

  const addStop = () => {
    setStops((previous) => [
      ...previous,
      {
        ...emptyLocation,
        isBoardingPoint: false,
        isDroppingPoint: false,
      },
    ]);
  };

  const removeStop = (index: number) => {
    setStops((previous) =>
      previous.filter((_, currentIndex) => currentIndex !== index),
    );
  };

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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!routeId || isSubmitting || isLoading) return;

    if (routeName.trim().length < 3) {
      toast.error("Route name must contain at least 3 characters");
      return;
    }

    if (!validateLocation(origin, "origin")) return;
    if (!validateLocation(destination, "destination")) return;

    if (origin.placeId === destination.placeId) {
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

    const usedPlaceIds = new Set([
      origin.placeId,
      destination.placeId,
    ]);

    for (let index = 0; index < stops.length; index++) {
      const stop = stops[index];

      if (!validateLocation(stop, `stop ${index + 1}`)) return;

      if (!stop.isBoardingPoint && !stop.isDroppingPoint) {
        toast.error(
          `Select boarding or dropping point for stop ${index + 1}`,
        );
        return;
      }

      if (usedPlaceIds.has(stop.placeId)) {
        toast.error(
          `Stop ${index + 1} is already added to this route`,
        );
        return;
      }

      usedPlaceIds.add(stop.placeId);
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

      await updateRoute(routeId, payload);

      toast.success("Route updated successfully");
      onUpdated();
      onClose();
    } catch (error) {
      console.error("Failed to update route:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update route",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 py-8"
      onMouseDown={(event) => {
        if (
          event.target === event.currentTarget &&
          !isSubmitting
        ) {
          onClose();
        }
      }}
    >
      <div className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">
              Edit Route
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Update route locations, stops and journey details
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        {isLoading ? (
          <div className="flex min-h-72 flex-1 items-center justify-center gap-3 text-sm text-slate-500">
            <Loader2 className="animate-spin text-blue-600" size={20} />
            Loading route details...
          </div>
        ) : (
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
                      Update the route name
                    </p>
                  </div>
                </div>

                <Field label="Route Name" required>
                  <input
                    className={inputClass}
                    value={routeName}
                    onChange={(event) => setRouteName(event.target.value)}
                    maxLength={100}
                    placeholder="e.g. Kozhikode - Bangalore"
                  />
                </Field>
              </section>

              {/* Origin and Destination */}
              <section className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-slate-800">
                    Route Locations
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    Update the starting and ending locations
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 p-4 sm:p-5">
                  <div className="mb-4 flex items-center gap-3">
                    <MapPin className="text-blue-600" size={18} />
                    <h4 className="text-sm font-semibold text-slate-800">
                      Origin
                    </h4>
                  </div>

                  <RouteLocationPicker
                    label="Search Origin"
                    value={toPickerLocation(origin)}
                    onChange={(location) =>
                      setOrigin(toLocationForm(location))
                    }
                    placeholder="Search starting location..."
                    disabled={isSubmitting}
                  />
                </div>

                <div className="rounded-xl border border-slate-200 p-4 sm:p-5">
                  <div className="mb-4 flex items-center gap-3">
                    <MapPin className="text-red-600" size={18} />
                    <h4 className="text-sm font-semibold text-slate-800">
                      Destination
                    </h4>
                  </div>

                  <RouteLocationPicker
                    label="Search Destination"
                    value={toPickerLocation(destination)}
                    onChange={(location) =>
                      setDestination(toLocationForm(location))
                    }
                    placeholder="Search destination..."
                    disabled={isSubmitting}
                  />
                </div>
              </section>

              {/* Intermediate Stops */}
              <section className="rounded-2xl border border-slate-200 p-5">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-800">
                      Intermediate Stops
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">
                      Add, edit or remove passenger stops
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={addStop}
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-100 disabled:opacity-50"
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
                      No intermediate stops
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      Add locations where passengers can board or drop off
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {stops.map((stop, index) => (
                      <div
                        key={`${stop.placeId || "new"}-${index}`}
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
                            disabled={isSubmitting}
                            className="rounded-lg p-2 text-red-500 hover:bg-red-50 disabled:opacity-50"
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
                          disabled={isSubmitting}
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
                                disabled={isSubmitting}
                                onChange={(event) =>
                                  updateStopAccess(
                                    index,
                                    "isBoardingPoint",
                                    event.target.checked,
                                  )
                                }
                                className="h-4 w-4 rounded border-slate-300 text-blue-600"
                              />
                              Boarding Point
                            </label>

                            <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
                              <input
                                type="checkbox"
                                checked={stop.isDroppingPoint}
                                disabled={isSubmitting}
                                onChange={(event) =>
                                  updateStopAccess(
                                    index,
                                    "isDroppingPoint",
                                    event.target.checked,
                                  )
                                }
                                className="h-4 w-4 rounded border-slate-300 text-blue-600"
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
                    Update estimated journey distance and duration
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
                        value={distanceKm}
                        onChange={(event) =>
                          setDistanceKm(event.target.value)
                        }
                        placeholder="e.g. 350"
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
                        value={durationMinutes}
                        onChange={(event) =>
                          setDurationMinutes(event.target.value)
                        }
                        placeholder="e.g. 480"
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
                className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditRouteModal;
