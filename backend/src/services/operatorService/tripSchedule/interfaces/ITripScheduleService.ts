import type { ICreateTripScheduleDTO, ITripSchedule } from "../../../../types/tripSchedule";

export interface ITripScheduleService {
  createSchedule(
    operatorId: string,
    data: ICreateTripScheduleDTO,
  ): Promise<ITripSchedule>;

  getSchedules(operatorId: string): Promise<ITripSchedule[]>;

  getScheduleById(
    scheduleId: string,
    operatorId: string,
  ): Promise<ITripSchedule>;

  updateSchedule(
    scheduleId: string,
    operatorId: string,
    data: Partial<ICreateTripScheduleDTO>,
  ): Promise<ITripSchedule>;

  deleteSchedule(
    scheduleId: string,
    operatorId: string,
  ): Promise<ITripSchedule>;
}