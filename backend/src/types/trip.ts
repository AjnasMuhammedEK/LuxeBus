import type { Types } from "mongoose";

import type { IRouteLocation, IRouteStop } from "./route";
import type { IBus } from "./bus";
import type { ISeat } from "./seatLayout";

export type TripStatus =
  | "SCHEDULED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

export type TripSeatStatus =
  | "AVAILABLE"
  | "LOCKED"
  | "BOOKED";

export interface ITripRouteSnapshot {
  routeName: string;
  origin: IRouteLocation;
  destination: IRouteLocation;
  stops: IRouteStop[];
  distanceInMeters: number;
  estimatedDurationInSeconds: number;
}

export type ITripBusSnapshot = Pick<
  IBus,
  | "manufacturer"
  | "model"
  | "registrationNumber"
  | "busType"
  | "seatLayoutSnapshot"
>;

export interface ITripStaffSnapshot {
  fullName: string;
  phone: string;
  role: "driver" | "conductor";
}

 
export interface ITripSeat extends ISeat {
  status: TripSeatStatus;
  lockedUntil: Date | null;
  bookingId: Types.ObjectId | null;
}

export interface ITrip {
  _id?: Types.ObjectId;

  operatorId: Types.ObjectId;
  tripScheduleId: Types.ObjectId;

  routeId: Types.ObjectId;
  busId: Types.ObjectId;
  driverId: Types.ObjectId;
  conductorId: Types.ObjectId;

  tripDate: string;
  departureTime: string;
  departureAt: Date;
  arrivalAt: Date;

  routeSnapshot: ITripRouteSnapshot;
  busSnapshot: ITripBusSnapshot;

  driverSnapshot: ITripStaffSnapshot;
  conductorSnapshot: ITripStaffSnapshot;

 
  seats: ITripSeat[];

  ticketPrice: number;
  status: TripStatus;

  createdAt?: Date;
  updatedAt?: Date;
}

export interface ITripListQuery {
  page: number;
  limit: number;
  search?: string;
  startDate?: string;
  endDate?: string;
  routeId?: string;
  busId?: string;
  status?: TripStatus;
}

export interface ITripListResponse {
  trips: ITrip[];
  total: number;
  totalPages: number;
}