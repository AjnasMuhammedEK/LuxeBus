import { injectable } from "inversify";
import { Types, QueryFilter } from "mongoose";

import { Trip } from "../../../models/Trip";

import type {
  ITrip,
  ITripListQuery,
  ITripListResponse,
  TripStatus,
} from "../../../types/trip";

import type { ITripRepository } from "../interfaces/ITripRepository";

@injectable()
export class TripRepository implements ITripRepository {
  async createTrip(data: ITrip): Promise<ITrip> {
    const trip = await Trip.create(data);
    return trip.toObject() as ITrip;
  }

  async findConflictingTrip(
    operatorId: Types.ObjectId,
    busId: Types.ObjectId,
    driverId: Types.ObjectId,
    conductorId: Types.ObjectId,
    departureAt: Date,
    arrivalAt: Date,
    excludeTripId?: string,
  ): Promise<ITrip | null> {
    const filter: QueryFilter<ITrip> = {
      operatorId,
      status: { $ne: "CANCELLED" },
      departureAt: { $lt: arrivalAt },
      arrivalAt: { $gt: departureAt },
      $or: [{ busId }, { driverId }, { conductorId }],
    };

    if (excludeTripId && Types.ObjectId.isValid(excludeTripId)) {
      filter._id = { $ne: new Types.ObjectId(excludeTripId) };
    }

    return Trip.findOne(filter).lean<ITrip>().exec();
  }

  async findTripByScheduleAndDate(
    scheduleId: Types.ObjectId,
    tripDate: string,
  ): Promise<ITrip | null> {
    return Trip.findOne({
      tripScheduleId: scheduleId,
      tripDate,
    })
      .lean<ITrip>()
      .exec();
  }

  async getTripsByOperator(
    operatorId: Types.ObjectId,
    query: ITripListQuery,
  ): Promise<ITripListResponse> {
    const { page, limit, search, startDate, endDate, routeId, busId, status } =
      query;

    const filter: QueryFilter<ITrip> = {
      operatorId,
    };

    if (startDate || endDate) {
      const dateFilter: Record<string, string> = {};

      if (startDate) {
        dateFilter.$gte = startDate;
      }

      if (endDate) {
        dateFilter.$lte = endDate;
      }

      filter.tripDate = dateFilter;
    }

    if (routeId && Types.ObjectId.isValid(routeId)) {
      filter.routeId = new Types.ObjectId(routeId);
    }

    if (busId && Types.ObjectId.isValid(busId)) {
      filter.busId = new Types.ObjectId(busId);
    }

    if (status) {
      filter.status = status;
    }

    if (search?.trim()) {
      const searchRegex = new RegExp(
        search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        "i",
      );

      filter.$or = [
        { "routeSnapshot.routeName": searchRegex },
        { "routeSnapshot.origin.name": searchRegex },
        { "routeSnapshot.destination.name": searchRegex },
        { "busSnapshot.registrationNumber": searchRegex },
        { "driverSnapshot.fullName": searchRegex },
        { "conductorSnapshot.fullName": searchRegex },
      ];
    }

    const skip = (page - 1) * limit;

    const [trips, total] = await Promise.all([
      Trip.find(filter)
        .sort({ departureAt: 1 })
        .skip(skip)
        .limit(limit)
        .lean<ITrip[]>()
        .exec(),

      Trip.countDocuments(filter),
    ]);

    return {
      trips,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findTripById(
    tripId: string,
    operatorId: Types.ObjectId,
  ): Promise<ITrip | null> {
    if (!Types.ObjectId.isValid(tripId)) {
      return null;
    }

    return Trip.findOne({
      _id: new Types.ObjectId(tripId),
      operatorId,
    })
      .lean<ITrip>()
      .exec();
  }

  async updateTripStatus(
    tripId: string,
    operatorId: Types.ObjectId,
    status: TripStatus,
  ): Promise<ITrip | null> {
    if (!Types.ObjectId.isValid(tripId)) {
      return null;
    }

    return Trip.findOneAndUpdate(
      {
        _id: new Types.ObjectId(tripId),
        operatorId,
      },
      { $set: { status } },
      {
        returnDocument: "after",
        runValidators: true,
      },
    )
      .lean<ITrip>()
      .exec();
  }
}
