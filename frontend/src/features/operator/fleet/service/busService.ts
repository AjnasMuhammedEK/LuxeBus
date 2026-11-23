import { opperatorApi } from "@/services/operatorApi";
import { OPERATOR_BASE_ROUTE } from "@/constants/apiRoutes";

import type { IBusListQuery } from "@/types/fleet.types";

export const getSeatLayouts = async () => {
  const response = await opperatorApi.get(
    `/${OPERATOR_BASE_ROUTE}/seatLayouts`,
  );
  return response.data;  
};

export const getSeatLayoutById = async (layoutId: string) => {
  const response = await opperatorApi.get(
    `/${OPERATOR_BASE_ROUTE}/seatLayoutsId/${layoutId}`,
  );
  return response.data;
};

export const createBus = async (data: FormData) => {
  const response = await opperatorApi.post(
    `/${OPERATOR_BASE_ROUTE}/createBus`,
    data,
  );
  return response.data;
};

export const getOperatorBuses = async (params: IBusListQuery) => {
  const response = await opperatorApi.get(`/${OPERATOR_BASE_ROUTE}/getBuses`, {
    params,
  });
  return response.data;  
};

export const getSignedDocmunetUrl = async (objectKey: string) => {
  console.log('getSignedDocmunetUrl called bus')
  const response = await opperatorApi.get(`/${OPERATOR_BASE_ROUTE}/busDocument`, {
    params: { objectKey },
  });
  return response.data;
};

export const resubmitBus = async (
  busId: string,
  data: FormData
) => {
  const response = await opperatorApi.patch(
    `/${OPERATOR_BASE_ROUTE}/resubmitBus/${busId}`,
    data
  );

  return response.data;
};

export const deleteBus = async (busId: string) => {
  const response = await opperatorApi.delete(
    `/${OPERATOR_BASE_ROUTE}/deleteBus/${busId}`,
  );

  return response.data;
};