import type { IRoute } from "../../../../types/route";

export interface IRouteService {
  createRoute(
    operatorId: string,
    data: Omit<
      IRoute,
      | "_id"
      | "operatorId"
      | "isActive"
      | "isDeleted"
      | "createdAt"
      | "updatedAt"
    >,
  ): Promise<IRoute>;

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

  getRouteById(routeId: string, operatorId: string): Promise<IRoute>;

  updateRoute(
    routeId: string,
    operatorId: string,
    data: Partial<IRoute>,
  ): Promise<IRoute>;

  deleteRoute(routeId: string, operatorId: string): Promise<IRoute>;

  updateRouteStatus(
    routeId: string,
    operatorId: string,
    isActive: boolean,
  ): Promise<IRoute>;
}
