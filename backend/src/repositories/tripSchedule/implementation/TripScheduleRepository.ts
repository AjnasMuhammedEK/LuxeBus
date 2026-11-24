
import { injectable } from "inversify";
import { Types } from "mongoose";

import { BaseRepositary } from "../../BaseRepository";
import { TripSchedule } from "../../../models/TripSchedule";

import type { ITripSchedule } from "../../../types/tripSchedule";
import type { ITripScheduleRepository } from "../interfaces/ITripScheduleRepository";

const schedulePopulate = [
  {
    path: "routeId",
    select: "routeName origin destination",
  },
  {
    path: "busId",
    select: "manufacturer model registrationNumber busType seatLayoutSnapshot approvalStatus isActive",
  },
  {
    path: "driverId",
    select: "fullName name phone role isBlocked",
  },
  {
    path: "conductorId",
    select: "fullName name phone role isBlocked",
  },
];

@injectable()
export class TripScheduleRepository
  extends BaseRepositary<ITripSchedule>
  implements ITripScheduleRepository
{
  constructor() {
    super(TripSchedule);
  }

  async createSchedule(data: ITripSchedule): Promise<ITripSchedule> {
    return await this.model.create(data);
  }

  async findScheduleById(
    scheduleId: string,
    operatorId: Types.ObjectId,
  ): Promise<ITripSchedule | null> {
    if (!Types.ObjectId.isValid(scheduleId)) {
      return null;
    }

    return await this.model
      .findOne({
        _id: new Types.ObjectId(scheduleId),
        operatorId,
        isDeleted: false,
      })
      .populate(schedulePopulate);
  }

  async getSchedulesByOperator(
    operatorId: Types.ObjectId,
  ): Promise<ITripSchedule[]> {
    return await this.model
      .find({
        operatorId,
        isDeleted: false,
      })
      .populate(schedulePopulate)
      .sort({ createdAt: -1 });
  }

  async updateSchedule(
    scheduleId: string,
    operatorId: Types.ObjectId,
    data: Partial<ITripSchedule>,
  ): Promise<ITripSchedule | null> {
    if (!Types.ObjectId.isValid(scheduleId)) {
      return null;
    }

    const {
      _id,
      operatorId: ignoredOperatorId,
      isDeleted,
      ...updateData
    } = data;

    return await this.model
      .findOneAndUpdate(
        {
          _id: new Types.ObjectId(scheduleId),
          operatorId,
          isDeleted: false,
        },
        {
          $set: updateData,
        },
        {
          new: true,
          runValidators: true,
        },
      )
      .populate(schedulePopulate);
  }

  async softDeleteSchedule(
    scheduleId: string,
    operatorId: Types.ObjectId,
  ): Promise<ITripSchedule | null> {
    if (!Types.ObjectId.isValid(scheduleId)) {
      return null;
    }

    return await this.model.findOneAndUpdate(
      {
        _id: new Types.ObjectId(scheduleId),
        operatorId,
        isDeleted: false,
      },
      {
        $set: {
          isDeleted: true,
          isActive: false,
        },
      },
      {
        new: true,
      },
    );
  }
}
