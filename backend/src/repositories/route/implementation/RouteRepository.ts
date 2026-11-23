import { injectable } from "inversify";
import { QueryFilter, Types } from "mongoose";

import { BaseRepositary } from "../../BaseRepository";
import { Route } from "../../../models/RouteModel";
import type { IRoute } from "../../../types/route";
import type { IRouteRepository } from "../interfaces/IRouteRepository";

@injectable()
export class RouteRepository
  extends BaseRepositary<IRoute>
  implements IRouteRepository
{
  constructor() {
    super(Route);
  }
 
  async createRoute(data: IRoute): Promise<IRoute> {
    return await this.model.create(data);
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
    const filter: QueryFilter<IRoute> = {
      operatorId: new Types.ObjectId(operatorId),
      isDeleted: false,
    };

    if (search?.trim()) {
      const searchRegex = new RegExp(search.trim(), "i");

      filter.$or = [
        { routeName: searchRegex },
        { "origin.name": searchRegex },
        { "destination.name": searchRegex },
      ];
    }

    const skip = (page - 1) * limit;

    const [routes, total] = await Promise.all([
      this.model
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      this.model.countDocuments(filter),
    ]);

    return {
      routes,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

 
  async findRouteById(
    routeId: string,
    operatorId: string,
  ): Promise<IRoute | null> {
    if (!Types.ObjectId.isValid(routeId)) {
      return null;
    }

    return await this.model.findOne({
      _id: new Types.ObjectId(routeId),
      operatorId: new Types.ObjectId(operatorId),
      isDeleted: false,
    });
  }

  
  async updateRoute(
    routeId: string,
    operatorId: string,
    data: Partial<IRoute>,
  ): Promise<IRoute | null> {
    if (!Types.ObjectId.isValid(routeId)) {
      return null;
    }

     
    const {
      _id,
      operatorId: ignoredOperatorId,
      isDeleted,
      ...updateData
    } = data;

    return await this.model.findOneAndUpdate(
      {
        _id: new Types.ObjectId(routeId),
        operatorId: new Types.ObjectId(operatorId),
        isDeleted: false,
      },
      { $set: updateData },
      {
        new: true,
        runValidators: true,
      },
    );
  }

 
  async softDeleteRoute(
    routeId: string,
    operatorId: string,
  ): Promise<IRoute | null> {
    if (!Types.ObjectId.isValid(routeId)) {
      return null;
    }

    return await this.model.findOneAndUpdate(
      {
        _id: new Types.ObjectId(routeId),
        operatorId: new Types.ObjectId(operatorId),
        isDeleted: false,
      },
      {
        $set: {
          isDeleted: true,
          isActive: false,
        },
      },
      { new: true },
    );
  }
 
  async updateRouteStatus(
    routeId: string,
    operatorId: string,
    isActive: boolean,
  ): Promise<IRoute | null> {
    if (!Types.ObjectId.isValid(routeId)) {
      return null;
    }

    return await this.model.findOneAndUpdate(
      {
        _id: new Types.ObjectId(routeId),
        operatorId: new Types.ObjectId(operatorId),
        isDeleted: false,
      },
      {
        $set: { isActive },
      },
      {
        new: true,
        runValidators: true,
      },
    );
  }
}