
import {
  X,
  MapPin,
  Route as RouteIcon,
  Clock,
  Ruler,
  CalendarDays,
  CheckCircle2,
  XCircle,
  Navigation,
} from "lucide-react";

import type { IRoute } from "@/types/route.types";

interface RouteDetailsModalProps {
  open: boolean;
  route: IRoute | null;
  onClose: () => void;
}

const formatDistance = (meters: number): string => {
  if (!Number.isFinite(meters) || meters < 0) return "—";
  return `${(meters / 1000).toFixed(1)} km`;
};

const formatDuration = (seconds: number): string => {
  if (!Number.isFinite(seconds) || seconds < 0) return "—";

  const totalMinutes = Math.round(seconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0) return `${minutes} minutes`;
  if (minutes === 0) return `${hours} hours`;

  return `${hours} hours ${minutes} minutes`;
};

const formatDate = (date?: string): string => {
  if (!date) return "—";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "—";

  return parsedDate.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const RouteDetailsModal = ({
  open,
  route,
  onClose,
}: RouteDetailsModalProps) => {
  if (!open || !route) return null;

  const orderedStops = [...(route.stops ?? [])].sort(
    (a, b) => a.order - b.order,
  );

  const locations = [
    {
      id: "origin",
      name: route.origin.name,
      address: route.origin.address,
      type: "Origin",
      isBoardingPoint: true,
      isDroppingPoint: false,
    },
    ...orderedStops.map((stop) => ({
      id: `stop-${stop.order}-${stop.placeId}`,
      name: stop.name,
      address: stop.address,
      type: `Stop ${stop.order}`,
      isBoardingPoint: stop.isBoardingPoint,
      isDroppingPoint: stop.isDroppingPoint,
    })),
    {
      id: "destination",
      name: route.destination.name,
      address: route.destination.address,
      type: "Destination",
      isBoardingPoint: false,
      isDroppingPoint: true,
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 py-8"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-semibold text-slate-800">
                Route Details
              </h2>

              <span
                className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                  route.isActive
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {route.isActive ? "Active" : "Inactive"}
              </span>
            </div>

            <p className="mt-1 text-xs text-slate-500">
              Complete information about this route
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close route details"
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6 overflow-y-auto px-6 py-6">
          {/* Route Name */}
          <section className="rounded-2xl border border-slate-200 p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <RouteIcon size={19} />
              </div>

              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  Route Name
                </p>
                <h3 className="mt-1 break-words text-base font-bold text-slate-800">
                  {route.routeName}
                </h3>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-xl bg-slate-50 p-3">
                <div className="flex items-center gap-2 text-slate-500">
                  <Ruler size={15} />
                  <span className="text-xs font-medium">Total Distance</span>
                </div>
                <p className="mt-2 text-lg font-bold text-slate-800">
                  {formatDistance(route.distanceInMeters)}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-3">
                <div className="flex items-center gap-2 text-slate-500">
                  <Clock size={15} />
                  <span className="text-xs font-medium">
                    Estimated Duration
                  </span>
                </div>
                <p className="mt-2 text-lg font-bold text-slate-800">
                  {formatDuration(route.estimatedDurationInSeconds)}
                </p>
              </div>
            </div>
          </section>

          {/* Route Journey */}
          <section>
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-slate-800">
                Route Journey
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                Origin, intermediate stops and destination
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 p-4 sm:p-5">
              <div className="space-y-0">
                {locations.map((location, index) => {
                  const isFirst = index === 0;
                  const isLast = index === locations.length - 1;

                  return (
                    <div
                      key={location.id}
                      className="relative flex gap-3"
                    >
                      {/* Journey line and marker */}
                      <div className="flex w-7 shrink-0 flex-col items-center">
                        <div
                          className={`z-10 flex h-7 w-7 items-center justify-center rounded-full ${
                            isFirst
                              ? "bg-blue-100 text-blue-700"
                              : isLast
                                ? "bg-red-100 text-red-700"
                                : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          <MapPin size={15} />
                        </div>

                        {!isLast && (
                          <div className="min-h-14 w-px flex-1 border-l-2 border-dashed border-slate-300" />
                        )}
                      </div>

                      {/* Location information */}
                      <div className="min-w-0 flex-1 pb-5">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-semibold text-slate-800">
                            {location.name}
                          </p>

                          <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500">
                            {location.type}
                          </span>
                        </div>

                        <p className="mt-1 break-words text-xs text-slate-500">
                          {location.address}
                        </p>

                        <div className="mt-2 flex flex-wrap gap-2">
                          {location.isBoardingPoint && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-[10px] font-medium text-green-700">
                              <CheckCircle2 size={12} />
                              Boarding
                            </span>
                          )}

                          {location.isDroppingPoint && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-2 py-1 text-[10px] font-medium text-orange-700">
                              <Navigation size={12} />
                              Dropping
                            </span>
                          )}

                          {!location.isBoardingPoint &&
                            !location.isDroppingPoint && (
                              <span className="text-[10px] text-slate-400">
                                No passenger access
                              </span>
                            )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Passenger Points Summary */}
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-green-100 bg-green-50/50 p-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-green-600" />
                <h4 className="text-xs font-semibold text-green-800">
                  Boarding Points
                </h4>
              </div>

              <div className="mt-3 space-y-2">
                <p className="text-xs text-slate-700">
                  {route.origin.name}
                </p>

                {orderedStops
                  .filter((stop) => stop.isBoardingPoint)
                  .map((stop) => (
                    <p
                      key={stop.placeId}
                      className="text-xs text-slate-700"
                    >
                      {stop.name}
                    </p>
                  ))}
              </div>
            </div>

            <div className="rounded-xl border border-orange-100 bg-orange-50/50 p-4">
              <div className="flex items-center gap-2">
                <Navigation size={16} className="text-orange-600" />
                <h4 className="text-xs font-semibold text-orange-800">
                  Dropping Points
                </h4>
              </div>

              <div className="mt-3 space-y-2">
                {orderedStops
                  .filter((stop) => stop.isDroppingPoint)
                  .map((stop) => (
                    <p
                      key={stop.placeId}
                      className="text-xs text-slate-700"
                    >
                      {stop.name}
                    </p>
                  ))}

                <p className="text-xs text-slate-700">
                  {route.destination.name}
                </p>
              </div>
            </div>
          </section>

          {/* Timestamps */}
          <section className="rounded-xl border border-slate-200 p-4">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Record Information
            </h3>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <div className="flex items-center gap-2 text-slate-400">
                  <CalendarDays size={14} />
                  <span className="text-[11px] font-medium">
                    Created At
                  </span>
                </div>
                <p className="mt-1 text-xs font-medium text-slate-700">
                  {formatDate(route.createdAt)}
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 text-slate-400">
                  <CalendarDays size={14} />
                  <span className="text-[11px] font-medium">
                    Last Updated
                  </span>
                </div>
                <p className="mt-1 text-xs font-medium text-slate-700">
                  {formatDate(route.updatedAt)}
                </p>
              </div>
            </div>

            {route.isDeleted && (
              <div className="mt-3 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-xs text-red-700">
                <XCircle size={15} />
                This route has been deleted.
              </div>
            )}
          </section>
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-slate-200 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-blue-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default RouteDetailsModal;
