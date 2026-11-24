import { opperatorApi } from "@/services/operatorApi";
import { OPERATOR_BASE_ROUTE } from "@/constants/apiRoutes";

import type {
  ICreateTripScheduleDTO,
  IUpdateTripScheduleDTO,
} from "../../../../types/tripSchedule.types";

const BASE_URL = `/${OPERATOR_BASE_ROUTE}/trip-schedules`;

export const createTripSchedule = async (data: ICreateTripScheduleDTO) => {
  const { data: response } = await opperatorApi.post(BASE_URL, data);
  return response;
};

export const getTripSchedules = async () => {
  const { data } = await opperatorApi.get(BASE_URL);
  return data;
};

export const getTripScheduleById = async (scheduleId: string) => {
  const { data } = await opperatorApi.get(`${BASE_URL}/${scheduleId}`);
  return data;
};

export const updateTripSchedule = async (
  scheduleId: string,
  payload: IUpdateTripScheduleDTO,
) => {
  const { data } = await opperatorApi.patch(
    `${BASE_URL}/${scheduleId}`,
    payload,
  );
  return data;
};

export const deleteTripSchedule = async (scheduleId: string) => {
  const { data } = await opperatorApi.delete(`${BASE_URL}/${scheduleId}`);
  return data;
};
