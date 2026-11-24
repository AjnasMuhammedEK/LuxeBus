import type {
  ITrip,
  ITripListQuery,
  ITripListResponse,
  TripStatus,
} from "../../../../types/trip";

export interface ITripService {
  getTrips(
    operatorId: string,
    query: ITripListQuery,
  ): Promise<ITripListResponse>;

  getTripById(
    tripId: string,
    operatorId: string,
  ): Promise<ITrip>;

  updateTripStatus(
    tripId: string,
    operatorId: string,
    status: TripStatus,
  ): Promise<ITrip>;
}