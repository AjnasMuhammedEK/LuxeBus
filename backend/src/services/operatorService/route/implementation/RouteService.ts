
import { inject, injectable } from "inversify";
import { Types } from "mongoose";

import { TYPES } from "../../../../DI/types";
import type { IRouteRepository } from "../../../../repositories/route/interfaces/IRouteRepository";
import type { IRoute } from "../../../../types/route";

import type { IRouteService } from "../interface/IRouteService";

@injectable()
export class RouteService implements IRouteService {
  constructor(
    @inject(TYPES.RouteRepository)
    private _routeRepository: IRouteRepository,
  ) {}

   private validateRoute(
    data: Pick<
      IRoute,
      | "routeName"
      | "origin"
      | "destination"
      | "stops"
      | "distanceInMeters"
      | "estimatedDurationInSeconds"
    >,
  ): void {
    if (
      !data.routeName?.trim() ||
      !data.origin ||
      !data.destination
    ) {
      throw new Error(
        "Route name, origin and destination are required",
      );
    }

    if (
      !data.origin.placeId ||
      !data.destination.placeId ||
      data.origin.placeId === data.destination.placeId
    ) {
      throw new Error(
        "Invalid origin or destination",
      );
    }

    if (!Array.isArray(data.stops)) {
      throw new Error("Invalid route stops");
    }

    if (
      !Number.isFinite(data.distanceInMeters) ||
      data.distanceInMeters <= 0 ||
      !Number.isFinite(data.estimatedDurationInSeconds) ||
      data.estimatedDurationInSeconds <= 0
    ) {
      throw new Error("Invalid route distance or duration");
    }

    const orders = data.stops.map((stop) => stop.order);

    if (new Set(orders).size !== orders.length) {
      throw new Error("Duplicate stop order is not allowed");
    }

    for (const stop of data.stops) {
      if (
        !stop.name?.trim() ||
        !stop.address?.trim() ||
        !stop.placeId?.trim()
      ) {
        throw new Error("Invalid stop location details");
      }

      if (
        !Number.isInteger(stop.order) ||
        stop.order < 1
      ) {
        throw new Error("Invalid stop order");
      }

      if (
        typeof stop.isBoardingPoint !== "boolean" ||
        typeof stop.isDroppingPoint !== "boolean"
      ) {
        throw new Error("Invalid boarding or dropping point status");
      }

      if (
        !stop.isBoardingPoint &&
        !stop.isDroppingPoint
      ) {
        throw new Error(
          "Each stop must be a boarding point or dropping point",
        );
      }
    }

     const sortedOrders = [...orders].sort((a, b) => a - b);

    for (let i = 0; i < sortedOrders.length; i++) {
      if (sortedOrders[i] !== i + 1) {
        throw new Error(
          "Stop orders must be sequential starting from 1",
        );
      }
    }
  }

   
  async createRoute(
    operatorId: string,
    data: Omit<
      IRoute,
      "_id" | "operatorId" | "isActive" | "isDeleted" | "createdAt" | "updatedAt"
    >,
  ): Promise<IRoute> {
    if (!Types.ObjectId.isValid(operatorId)) {
      throw new Error("Invalid operator ID");
    }

    this.validateRoute(data);

    const routeData: IRoute = {
      ...data,
      operatorId: new Types.ObjectId(operatorId),
      isActive: true,
      isDeleted: false,
    };

    return await this._routeRepository.createRoute(routeData);
  }
 
  async getRoutes(
    operatorId: string,
    page: number,
    limit: number,
    search?: string,
  ): Promise<{
    routes: IRoute[];
    total: number;
    totalPages: number;
  }> {
    if (!Types.ObjectId.isValid(operatorId)) {
      throw new Error("Invalid operator ID");
    }

    const validPage = Math.max(1, Math.floor(page));
    const validLimit = Math.min(100, Math.max(1, Math.floor(limit)));

    return await this._routeRepository.getRoutes(
      operatorId,
      validPage,
      validLimit,
      search,
    );
  }

 
  async getRouteById(
    routeId: string,
    operatorId: string,
  ): Promise<IRoute> {
    if (
      !Types.ObjectId.isValid(routeId) ||
      !Types.ObjectId.isValid(operatorId)
    ) {
      throw new Error("Invalid route or operator ID");
    }

    const route = await this._routeRepository.findRouteById(
      routeId,
      operatorId,
    );

    if (!route) {
      throw new Error("Route not found");
    }

    return route;
  }

  
  async updateRoute(
    routeId: string,
    operatorId: string,
    data: Partial<IRoute>,
  ): Promise<IRoute> {
    const existingRoute = await this.getRouteById(
      routeId,
      operatorId,
    );

     const updatedData = {
      routeName: data.routeName ?? existingRoute.routeName,
      origin: data.origin ?? existingRoute.origin,
      destination: data.destination ?? existingRoute.destination,
      stops: data.stops ?? existingRoute.stops,
      distanceInMeters:
        data.distanceInMeters ?? existingRoute.distanceInMeters,
      estimatedDurationInSeconds:
        data.estimatedDurationInSeconds ??
        existingRoute.estimatedDurationInSeconds,
    };

    this.validateRoute(updatedData);

     const updateData: Partial<IRoute> = {};

    if (data.routeName !== undefined) {
      updateData.routeName = data.routeName;
    }

    if (data.origin !== undefined) {
      updateData.origin = data.origin;
    }

    if (data.destination !== undefined) {
      updateData.destination = data.destination;
    }

    if (data.stops !== undefined) {
      updateData.stops = data.stops;
    }

    if (data.distanceInMeters !== undefined) {
      updateData.distanceInMeters = data.distanceInMeters;
    }

    if (data.estimatedDurationInSeconds !== undefined) {
      updateData.estimatedDurationInSeconds =
        data.estimatedDurationInSeconds;
    }

    const updatedRoute = await this._routeRepository.updateRoute(
      routeId,
      operatorId,
      updateData,
    );

    if (!updatedRoute) {
      throw new Error("Unable to update route");
    }

    return updatedRoute;
  }

   async deleteRoute(
    routeId: string,
    operatorId: string,
  ): Promise<IRoute> {
    await this.getRouteById(routeId, operatorId);

    const deletedRoute = await this._routeRepository.softDeleteRoute(
      routeId,
      operatorId,
    );

    if (!deletedRoute) {
      throw new Error("Unable to delete route");
    }

    return deletedRoute;
  }

   async updateRouteStatus(
    routeId: string,
    operatorId: string,
    isActive: boolean,
  ): Promise<IRoute> {
    if (typeof isActive !== "boolean") {
      throw new Error("Invalid route status");
    }

    await this.getRouteById(routeId, operatorId);

    const updatedRoute =
      await this._routeRepository.updateRouteStatus(
        routeId,
        operatorId,
        isActive,
      );

    if (!updatedRoute) {
      throw new Error("Unable to update route status");
    }

    return updatedRoute;
  }
}
