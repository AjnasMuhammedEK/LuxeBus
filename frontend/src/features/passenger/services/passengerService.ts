import { passengerApi } from "@/services/passengerApi";
import { USER_BASE_ROUTE } from "@/constants/apiRoutes";
import type { IUser } from "@/types/user.types";

export const getMyProfile = async (): Promise<IUser> => {
  const response = await passengerApi.get(
    `/${USER_BASE_ROUTE}/profile`
  );

  return response.data.data;
};

export const updateMyProfile = async (data: {
  name: string;
  phone: string;
}) => {
  const response = await passengerApi.patch(
    `/${USER_BASE_ROUTE}/profile`,
    data
  );

  return response.data;
};

export const changeMyPassword = async (data: {
  currentPassword: string;
  newPassword: string;
}) => {
  const response = await passengerApi.patch(
    `/${USER_BASE_ROUTE}/changePassword`,
    data
  );

  return response.data;
};