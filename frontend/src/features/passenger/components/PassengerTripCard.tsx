import {
  ArrowRight,
  Armchair,
  BusFront,
  CalendarDays,
 
  MapPin,
 
} from "lucide-react";

import type { IPassengerTrip } from "@/types/passengerTrip.types";  

interface PassengerTripCardProps {
  trip: IPassengerTrip;
}

const formatTime = (date: string) => {
  return new Date(date).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatDuration = (departureAt: string, arrivalAt: string) => {
  const difference =
    new Date(arrivalAt).getTime() - new Date(departureAt).getTime();

  if (!Number.isFinite(difference) || difference <= 0) {
    return "Duration unavailable";
  }

  const totalMinutes = Math.floor(difference / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${hours}h ${minutes}m`;
};

const formatBusType = (busType: string) => {
  const busTypes: Record<string, string> = {
    SEATER: "Seater",
    SLEEPER: "Sleeper",
    SEATER_CUM_SLEEPER: "Semi Sleeper",
    HYBRID: "Hybrid",
  };

  return busTypes[busType] ?? busType.replaceAll("_", " ");
};

const PassengerTripCard = ({ trip }: PassengerTripCardProps) => {
  const availableSeats = trip.seats.filter(
    (seat) => seat.status === "AVAILABLE"
  ).length;

  const totalSeats =
    trip.busSnapshot.seatLayoutSnapshot.totalCapacity || trip.seats.length;

  const origin = trip.routeSnapshot.origin.name;
  const destination = trip.routeSnapshot.destination.name;

  return (
    <article className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:border-emerald-200 hover:shadow-md">
      <div className="flex flex-col lg:flex-row">
        <div className="min-w-0 flex-1 p-5 sm:p-6">
          <div className="mb-5 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              {trip.status.replaceAll("_", " ")}
            </span>

            <span className="flex items-center gap-1.5 text-xs text-gray-500">
              <CalendarDays size={14} />
              {formatDate(trip.departureAt)}
            </span>
          </div>

          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
            <div className="min-w-0">
              <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-400">
                Departure
              </p>

              <h3 className="truncate text-lg font-bold text-gray-900 sm:text-xl">
                {formatTime(trip.departureAt)}
              </h3>

              <p className="mt-1 truncate text-sm font-medium text-gray-600">
                {origin}
              </p>
            </div>

            <div className="flex min-w-[90px] flex-col items-center gap-2">
              <span className="text-xs text-gray-500">
                {formatDuration(trip.departureAt, trip.arrivalAt)}
              </span>

              <div className="flex w-full items-center">
                <div className="h-px flex-1 bg-gray-300" />
                <ArrowRight size={16} className="mx-1 text-emerald-700" />
                <div className="h-px flex-1 bg-gray-300" />
              </div>

              <span className="text-xs text-gray-400">
                {(
                  trip.routeSnapshot.distanceInMeters / 1000
                ).toFixed(0)}{" "}
                km
              </span>
            </div>

            <div className="min-w-0 text-right">
              <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-400">
                Arrival
              </p>

              <h3 className="truncate text-lg font-bold text-gray-900 sm:text-xl">
                {formatTime(trip.arrivalAt)}
              </h3>

              <p className="mt-1 truncate text-sm font-medium text-gray-600">
                {destination}
              </p>

              {formatDate(trip.arrivalAt) !== formatDate(trip.departureAt) && (
                <p className="mt-1 text-xs text-gray-400">
                  {formatDate(trip.arrivalAt)}
                </p>
              )}
            </div>
          </div>

          <div className="mt-5 border-t border-dashed border-gray-200 pt-4">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-gray-600">
              <span className="flex items-center gap-2">
                <BusFront size={16} className="text-emerald-700" />
                {trip.busSnapshot.manufacturer} {trip.busSnapshot.model}
              </span>

              <span className="flex items-center gap-2">
                <Armchair size={16} className="text-emerald-700" />
                {formatBusType(trip.busSnapshot.busType)}
              </span>

              <span className="flex items-center gap-2">
                <MapPin size={16} className="text-emerald-700" />
                {trip.routeSnapshot.stops.length} stops
              </span>
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs text-gray-400">
                {trip.busSnapshot.registrationNumber}
              </span>

              <span className="text-xs font-medium text-gray-600">
                {availableSeats} of {totalSeats} seats available
              </span>
            </div>

            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-emerald-600 transition-all"
                style={{
                  width: `${
                    totalSeats > 0
                      ? (availableSeats / totalSeats) * 100
                      : 0
                  }%`,
                }}
              />
            </div>
          </div>
        </div>

        <div className="flex min-w-0 flex-row items-center justify-between gap-4 border-t border-gray-100 bg-gray-50 p-5 lg:w-48 lg:flex-col lg:items-center lg:justify-center lg:border-l lg:border-t-0">
          <div>
            <p className="text-xs font-medium text-gray-500 lg:text-center">
              Starting from
            </p>

            <p className="mt-1 text-2xl font-bold text-emerald-800 lg:text-center">
              ₹{trip.ticketPrice.toLocaleString("en-IN")}
            </p>

            <p className="mt-1 text-xs text-gray-400 lg:text-center">
              per passenger
            </p>
          </div>

          <button
            type="button"
            disabled
            className="cursor-not-allowed rounded-lg bg-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-600"
            title="Seat selection will be available soon"
          >
            View Seats
          </button>

          <span className="text-[11px] text-gray-400 lg:text-center">
            Seat booking coming soon
          </span>
        </div>
      </div>
    </article>
  );
};

export default PassengerTripCard;