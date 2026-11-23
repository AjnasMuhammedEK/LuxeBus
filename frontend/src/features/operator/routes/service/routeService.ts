
import { opperatorApi } from "@/services/operatorApi";
import { OPERATOR_BASE_ROUTE } from "@/constants/apiRoutes";

import type {
  ICreateRouteDTO,
  IRouteListQuery,
  IUpdateRouteDTO,
} from "@/types/route.types";

export const createRoute = async (data: ICreateRouteDTO) => {
  const response = await opperatorApi.post(
    `/${OPERATOR_BASE_ROUTE}/createRoute`,
    data,
  );

  return response.data;
};

export const getOperatorRoutes = async (params: IRouteListQuery) => {
  const response = await opperatorApi.get(
    `/${OPERATOR_BASE_ROUTE}/getRoutes`,
    { params },
  );

  return response.data;
};

export const getRouteById = async (routeId: string) => {
  const response = await opperatorApi.get(
    `/${OPERATOR_BASE_ROUTE}/getRoute/${routeId}`,
  );

  return response.data;
};

export const updateRoute = async (
  routeId: string,
  data: IUpdateRouteDTO,
) => {
  const response = await opperatorApi.patch(
    `/${OPERATOR_BASE_ROUTE}/updateRoute/${routeId}`,
    data,
  );

  return response.data;
};

export const deleteRoute = async (routeId: string) => {
  const response = await opperatorApi.delete(
    `/${OPERATOR_BASE_ROUTE}/deleteRoute/${routeId}`,
  );

  return response.data;
};

export const updateRouteStatus = async (
  routeId: string,
  isActive: boolean,
) => {
  const response = await opperatorApi.patch(
    `/${OPERATOR_BASE_ROUTE}/updateRouteStatus/${routeId}`,
    { isActive },
  );

  return response.data;
};
