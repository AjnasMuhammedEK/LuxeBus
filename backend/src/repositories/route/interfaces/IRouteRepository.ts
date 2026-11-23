import { Types } from "mongoose";
import type { IRoute } from "../../../types/route";

export interface IRouteRepository {
  createRoute(data: IRoute): Promise<IRoute>;

  getRoutes(
    operatorId: string,
    page: number,
    limit: number,
    search?: string,
  ): Promise<{
    routes: IRoute[];
    total: number;
    totalPages: number;
  }>;

  findRouteById(
    routeId: string,
    operatorId: string,
  ): Promise<IRoute | null>;

  updateRoute(
    routeId: string,
    operatorId: string,
    data: Partial<IRoute>,
  ): Promise<IRoute | null>;

  softDeleteRoute(
    routeId: string,
    operatorId: string,
  ): Promise<IRoute | null>;

  updateRouteStatus(
    routeId: string,
    operatorId: string,
    isActive: boolean,
  ): Promise<IRoute | null>;
}