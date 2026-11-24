
import type { ITrip } from "../../../types/trip";

export interface IPassengerTripSearchQuery {
  from: string;
  to: string;
  date: string;
}

export interface IPassengerTripRepository {
  getUpcomingTrips(): Promise<ITrip[]>;
  searchTrips(query: IPassengerTripSearchQuery): Promise<ITrip[]>;
}
