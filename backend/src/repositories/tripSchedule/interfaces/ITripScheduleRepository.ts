
import type { Types } from "mongoose";
import type { ITripSchedule } from "../../../types/tripSchedule";

export interface ITripScheduleRepository {
  createSchedule(data: ITripSchedule): Promise<ITripSchedule>;

  findScheduleById(
    scheduleId: string,
    operatorId: Types.ObjectId,
  ): Promise<ITripSchedule | null>;

  getSchedulesByOperator(
    operatorId: Types.ObjectId,
  ): Promise<ITripSchedule[]>;

  updateSchedule(
    scheduleId: string,
    operatorId: Types.ObjectId,
    data: Partial<ITripSchedule>,
  ): Promise<ITripSchedule | null>;

  softDeleteSchedule(
    scheduleId: string,
    operatorId: Types.ObjectId,
  ): Promise<ITripSchedule | null>;
}
