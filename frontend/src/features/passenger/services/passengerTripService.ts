import { passengerApi } from "@/services/passengerApi";
import type { IPassengerTrip } from "../../../types/passengerTrip.types";
import { USER_BASE_ROUTE } from "@/constants/apiRoutes";

interface IApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface IPassengerTripSearchQuery {
  from: string;
  to: string;
  date: string;
}

export const getUpcomingTrips = async (): Promise<IPassengerTrip[]> => {
  const response = await passengerApi.get<IApiResponse<IPassengerTrip[]>>(
    `/${USER_BASE_ROUTE}/trips`
  );

  return response.data.data;
};

export const searchPassengerTrips = async (
  query: IPassengerTripSearchQuery
): Promise<IPassengerTrip[]> => {
  const response = await passengerApi.get<IApiResponse<IPassengerTrip[]>>(
    `/${USER_BASE_ROUTE}/trips/search`,
    {
      params: query,
    }
  );

  return response.data.data;
};