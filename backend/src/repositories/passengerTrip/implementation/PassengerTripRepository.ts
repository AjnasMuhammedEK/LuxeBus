
import { injectable } from "inversify";
import { Trip } from "../../../models/Trip";
import type { ITrip, TripStatus } from "../../../types/trip";
import type {
  IPassengerTripRepository,
  IPassengerTripSearchQuery,
} from "../interfaces/IPassengerTripRepository";

@injectable()
export class PassengerTripRepository implements IPassengerTripRepository {
  async getUpcomingTrips(): Promise<ITrip[]> {
    const trips = await Trip.find({
      status: "SCHEDULED" as TripStatus,
      departureAt: { $gt: new Date() },
    })
      .sort({ departureAt: 1 })
      .exec();

    return trips as unknown as ITrip[];
  }

  async searchTrips(
    query: IPassengerTripSearchQuery
  ): Promise<ITrip[]> {
    const { from, to, date } = query;

    const startOfDay = new Date(`${date}T00:00:00.000+05:30`);

    const endOfDay = new Date(startOfDay);
    endOfDay.setDate(endOfDay.getDate() + 1);

    const now = new Date();

    const trips = await Trip.find({
      status: "SCHEDULED" as TripStatus,
      departureAt: {
        $gte: startOfDay,
        $lt: endOfDay,
        $gt: now,
      },
    })
      .sort({ departureAt: 1 })
      .exec();

    const normalize = (value: string) =>
      value.trim().toLowerCase();

    const fromSearch = normalize(from);
    const toSearch = normalize(to);

    const matchesLocation = (
      location: { name: string; address: string },
      search: string
    ) => {
      return (
        normalize(location.name).includes(search) ||
        normalize(location.address).includes(search)
      );
    };

    const matchingTrips = trips.filter((trip) => {
      const points = [
        trip.routeSnapshot.origin,
        ...[...trip.routeSnapshot.stops].sort(
          (a, b) => a.order - b.order
        ),
        trip.routeSnapshot.destination,
      ];

      const fromIndex = points.findIndex((point) =>
        matchesLocation(point, fromSearch)
      );

      const toIndex = points.findIndex((point) =>
        matchesLocation(point, toSearch)
      );

      return (
        fromIndex !== -1 &&
        toIndex !== -1 &&
        fromIndex < toIndex
      );
    });

    return matchingTrips as unknown as ITrip[];
  }
}
