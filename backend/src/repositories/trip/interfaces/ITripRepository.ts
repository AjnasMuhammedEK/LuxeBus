import type { Types } from "mongoose";
import type {
  ITrip,
  ITripListQuery,
  ITripListResponse,
  TripStatus,
} from "../../../types/trip";

export interface ITripRepository {
  createTrip(data: ITrip): Promise<ITrip>;

  findConflictingTrip(
    operatorId: Types.ObjectId,
    busId: Types.ObjectId,
    driverId: Types.ObjectId,
    conductorId: Types.ObjectId,
    departureAt: Date,
    arrivalAt: Date,
    excludeTripId?: string,
  ): Promise<ITrip | null>;

  findTripByScheduleAndDate(
    scheduleId: Types.ObjectId,
    tripDate: string,
  ): Promise<ITrip | null>;

  getTripsByOperator(
    operatorId: Types.ObjectId,
    query: ITripListQuery,
  ): Promise<ITripListResponse>;

  findTripById(
    tripId: string,
    operatorId: Types.ObjectId,
  ): Promise<ITrip | null>;

  updateTripStatus(
    tripId: string,
    operatorId: Types.ObjectId,
    status: TripStatus,
  ): Promise<ITrip | null>;
}