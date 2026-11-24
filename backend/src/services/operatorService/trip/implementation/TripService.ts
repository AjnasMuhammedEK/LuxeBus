import { inject, injectable } from "inversify";
import { Types } from "mongoose";

import { TYPES } from "../../../../DI/types"; 

import type { ITripRepository } from "../../../../repositories/trip/interfaces/ITripRepository";  
import type { ITripService } from "../interfaces/ITripService";  

import type {
  ITrip,
  ITripListQuery,
  ITripListResponse,
  TripStatus,
} from "../../../../types/trip";

@injectable()
export class TripService implements ITripService {
  constructor(
    @inject(TYPES.TripRepository)
    private _tripRepository: ITripRepository,
  ) {}

  async getTrips(
    operatorId: string,
    query: ITripListQuery,
  ): Promise<ITripListResponse> {
    this.validateObjectId(operatorId, "Invalid operator ID");

    const page = Math.max(1, Math.floor(query.page || 1));
    const limit = Math.min(100, Math.max(1, Math.floor(query.limit || 10)));

    this.validateDateRange(query.startDate, query.endDate);

    if (query.routeId && !Types.ObjectId.isValid(query.routeId)) {
      throw new Error("Invalid route ID");
    }

    if (query.busId && !Types.ObjectId.isValid(query.busId)) {
      throw new Error("Invalid bus ID");
    }

    if (
      query.status &&
      !["SCHEDULED", "IN_PROGRESS", "COMPLETED", "CANCELLED"].includes(
        query.status,
      )
    ) {
      throw new Error("Invalid trip status");
    }

    return this._tripRepository.getTripsByOperator(
      new Types.ObjectId(operatorId),
      {
        ...query,
        page,
        limit,
      },
    );
  }

  async getTripById(
    tripId: string,
    operatorId: string,
  ): Promise<ITrip> {
    this.validateObjectId(tripId, "Invalid trip ID");
    this.validateObjectId(operatorId, "Invalid operator ID");

    const trip = await this._tripRepository.findTripById(
      tripId,
      new Types.ObjectId(operatorId),
    );

    if (!trip) {
      throw new Error("Trip not found");
    }

    return trip;
  }

  async updateTripStatus(
    tripId: string,
    operatorId: string,
    status: TripStatus,
  ): Promise<ITrip> {
    this.validateObjectId(tripId, "Invalid trip ID");
    this.validateObjectId(operatorId, "Invalid operator ID");

    const allowedStatuses: TripStatus[] = [
      "SCHEDULED",
      "IN_PROGRESS",
      "COMPLETED",
      "CANCELLED",
    ];

    if (!allowedStatuses.includes(status)) {
      throw new Error("Invalid trip status");
    }

    const trip = await this._tripRepository.findTripById(
      tripId,
      new Types.ObjectId(operatorId),
    );

    if (!trip) {
      throw new Error("Trip not found");
    }

    if (trip.status === "COMPLETED" || trip.status === "CANCELLED") {
      throw new Error("Completed or cancelled trips cannot be updated");
    }

    const updatedTrip = await this._tripRepository.updateTripStatus(
      tripId,
      new Types.ObjectId(operatorId),
      status,
    );

    if (!updatedTrip) {
      throw new Error("Unable to update trip status");
    }

    return updatedTrip;
  }

  private validateObjectId(value: string, message: string): void {
    if (!Types.ObjectId.isValid(value)) {
      throw new Error(message);
    }
  }

  private validateDateRange(
    startDate?: string,
    endDate?: string,
  ): void {
    const isValidDate = (value: string): boolean => {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return false;
      }

      const [year, month, day] = value.split("-").map(Number);
      const date = new Date(Date.UTC(year, month - 1, day));

      return (
        date.getUTCFullYear() === year &&
        date.getUTCMonth() === month - 1 &&
        date.getUTCDate() === day
      );
    };

    if (startDate && !isValidDate(startDate)) {
      throw new Error("Invalid start date");
    }

    if (endDate && !isValidDate(endDate)) {
      throw new Error("Invalid end date");
    }

    if (startDate && endDate && startDate > endDate) {
      throw new Error("Start date cannot be after end date");
    }
  }
}