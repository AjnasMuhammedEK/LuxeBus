import type { ITrip } from "../../../../types/trip";  
import type { IPassengerTripSearchQuery } from "../../../../repositories/passengerTrip/interfaces/IPassengerTripRepository";  

export interface IPassengerTripService {
  getUpcomingTrips(): Promise<ITrip[]>;
  searchTrips(query: IPassengerTripSearchQuery): Promise<ITrip[]>;
}