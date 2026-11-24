
import type { Types } from "mongoose";

export type OperatingDay = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface ITripSchedule {
  _id?: Types.ObjectId;

  operatorId: Types.ObjectId;

  routeId: Types.ObjectId;

  busId: Types.ObjectId;

  driverId: Types.ObjectId;

  conductorId: Types.ObjectId;

  departureTime: string;

  startDate: string;

  endDate: string;

  operatingDays: OperatingDay[];

  ticketPrice: number;

  isActive: boolean;

  isDeleted: boolean;

  createdAt?: Date;

  updatedAt?: Date;
}

export interface ICreateTripScheduleDTO {
  routeId: string;

  busId: string;

  driverId: string;

  conductorId: string;

  departureTime: string;

  startDate: string;

  endDate: string;

  operatingDays: OperatingDay[];

  ticketPrice: number;
}
