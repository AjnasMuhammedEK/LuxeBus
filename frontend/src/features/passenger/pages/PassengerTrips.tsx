
import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  AlertCircle,
  BusFront,
  LoaderCircle,
  RefreshCw,
  Search,
} from "lucide-react";

import PassengerTripCard from "../components/PassengerTripCard";
import { searchPassengerTrips } from "../services/passengerTripService";
import type { IPassengerTrip } from "@/types/passengerTrip.types";

const PassengerTrips = () => {
  const [searchParams] = useSearchParams();

  const from = searchParams.get("from")?.trim() ?? "";
  const to = searchParams.get("to")?.trim() ?? "";
  const date = searchParams.get("date")?.trim() ?? "";

  const [trips, setTrips] = useState<IPassengerTrip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const formattedDate = date
    ? new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  const fetchTrips = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      setTrips([]);

      if (!from || !to || !date) {
        throw new Error(
          "Please select your departure location, destination, and travel date."
        );
      }

      const response = await searchPassengerTrips({
        from,
        to,
        date,
      });

      setTrips(response);
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to load trips. Please try again.";

      setError(message);
    } finally {
      setLoading(false);
    }
  }, [from, to, date]);

  useEffect(() => {
    void fetchTrips();
  }, [fetchTrips]);

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                <BusFront size={14} />
                LUXEBUS TRAVEL
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                Available Trips
              </h1>

              <p className="mt-2 text-sm text-gray-500 sm:text-base">
                {from} to {to}
                {formattedDate && ` • ${formattedDate}`}
              </p>
            </div>

            <button
              type="button"
              onClick={() => void fetchTrips()}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 self-start rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 sm:self-auto"
            >
              <RefreshCw
                size={16}
                className={loading ? "animate-spin" : ""}
              />
              Refresh
            </button>
          </div>
        </div>

        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
          <div>
            <p className="text-sm font-semibold text-gray-800">
              Trips for {formattedDate || "selected date"}
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Showing trips only for your selected travel date
            </p>
          </div>

          {!loading && !error && (
            <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-700">
              {trips.length} {trips.length === 1 ? "trip" : "trips"} found
            </span>
          )}
        </div>

        {loading && (
          <div className="flex min-h-[300px] flex-col items-center justify-center rounded-xl border border-gray-200 bg-white">
            <LoaderCircle
              size={36}
              className="animate-spin text-emerald-700"
            />

            <p className="mt-4 text-sm font-medium text-gray-600">
              Finding trips for your selected date...
            </p>
          </div>
        )}

        {!loading && error && (
          <div className="flex min-h-[300px] flex-col items-center justify-center rounded-xl border border-red-100 bg-white px-5 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
              <AlertCircle size={24} className="text-red-600" />
            </div>

            <h2 className="mt-4 text-lg font-semibold text-gray-900">
              Unable to find trips
            </h2>

            <p className="mt-2 max-w-md text-sm text-gray-500">
              {error}
            </p>

            <button
              type="button"
              onClick={() => void fetchTrips()}
              className="mt-5 rounded-lg bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && trips.length === 0 && (
          <div className="flex min-h-[300px] flex-col items-center justify-center rounded-xl border border-gray-200 bg-white px-5 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
              <Search size={26} className="text-emerald-700" />
            </div>

            <h2 className="mt-4 text-lg font-semibold text-gray-900">
              No trips available for this date
            </h2>

            <p className="mt-2 max-w-md text-sm text-gray-500">
              Sorry, there are no available trips from {from} to {to} on{" "}
              {formattedDate}. Please select another travel date.
            </p>
          </div>
        )}

        {!loading && !error && trips.length > 0 && (
          <div className="space-y-5">
            {trips.map((trip) => (
              <PassengerTripCard key={trip._id} trip={trip} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default PassengerTrips;
