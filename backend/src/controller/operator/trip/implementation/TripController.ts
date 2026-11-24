
import { inject, injectable } from "inversify";
import type { Request, Response, NextFunction } from "express";

import { TYPES } from "../../../../DI/types";
import type { ITripController } from "../interfaces/ITripController";  
import type { ITripService } from "../../../../services/operatorService/trip/interfaces/ITripService";

import type {
  ITripListQuery,
  TripStatus,
} from "../../../../types/trip";

interface OperatorRequest extends Request {
  operator?: {
    id?: string;
    _id?: string;
  };
}

@injectable()
export class TripController implements ITripController {
  constructor(
    @inject(TYPES.TripService)
    private _tripService: ITripService,
  ) {}

  private getOperatorId(req: OperatorRequest): string {
    const operatorId = req.operator?.id ?? req.operator?._id;

    if (typeof operatorId !== "string" || !operatorId.trim()) {
      throw new Error("Operator authentication required");
    }

    return operatorId;
  }

  private getTripId(req: Request): string {
    const tripId = req.params.tripId;

    if (typeof tripId !== "string" || !tripId.trim()) {
      throw new Error("Invalid trip ID");
    }

    return tripId;
  }

  async getTrips(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const operatorId = this.getOperatorId(req as OperatorRequest);

      const query: ITripListQuery = {
        page: 1,
        limit: 10,
      };

      if (req.query.page !== undefined) {
        if (typeof req.query.page !== "string") {
          throw new Error("Invalid page parameter");
        }

        query.page = Number(req.query.page);
      }

      if (req.query.limit !== undefined) {
        if (typeof req.query.limit !== "string") {
          throw new Error("Invalid limit parameter");
        }

        query.limit = Number(req.query.limit);
      }

      if (req.query.search !== undefined) {
        if (typeof req.query.search !== "string") {
          throw new Error("Invalid search parameter");
        }

        query.search = req.query.search;
      }

      if (req.query.startDate !== undefined) {
        if (typeof req.query.startDate !== "string") {
          throw new Error("Invalid start date parameter");
        }

        query.startDate = req.query.startDate;
      }

      if (req.query.endDate !== undefined) {
        if (typeof req.query.endDate !== "string") {
          throw new Error("Invalid end date parameter");
        }

        query.endDate = req.query.endDate;
      }

      if (req.query.routeId !== undefined) {
        if (typeof req.query.routeId !== "string") {
          throw new Error("Invalid route ID parameter");
        }

        query.routeId = req.query.routeId;
      }

      if (req.query.busId !== undefined) {
        if (typeof req.query.busId !== "string") {
          throw new Error("Invalid bus ID parameter");
        }

        query.busId = req.query.busId;
      }

      if (req.query.status !== undefined) {
        if (typeof req.query.status !== "string") {
          throw new Error("Invalid trip status parameter");
        }

        const allowedStatuses: TripStatus[] = [
          "SCHEDULED",
          "IN_PROGRESS",
          "COMPLETED",
          "CANCELLED",
        ];

        if (!allowedStatuses.includes(req.query.status as TripStatus)) {
          throw new Error("Invalid trip status");
        }

        query.status = req.query.status as TripStatus;
      }

      const result = await this._tripService.getTrips(
        operatorId,
        query,
      );

      res.status(200).json({
        success: true,
        message: "Trips retrieved successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getTripById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const operatorId = this.getOperatorId(req as OperatorRequest);
      const tripId = this.getTripId(req);

      const trip = await this._tripService.getTripById(
        tripId,
        operatorId,
      );

      res.status(200).json({
        success: true,
        message: "Trip retrieved successfully",
        data: trip,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateTripStatus(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const operatorId = this.getOperatorId(req as OperatorRequest);
      const tripId = this.getTripId(req);

      if (!req.body || typeof req.body.status !== "string") {
        throw new Error("Trip status is required");
      }

      const allowedStatuses: TripStatus[] = [
        "SCHEDULED",
        "IN_PROGRESS",
        "COMPLETED",
        "CANCELLED",
      ];

      if (!allowedStatuses.includes(req.body.status as TripStatus)) {
        throw new Error("Invalid trip status");
      }

      const status: TripStatus = req.body.status;

      const trip = await this._tripService.updateTripStatus(
        tripId,
        operatorId,
        status,
      );

      res.status(200).json({
        success: true,
        message: "Trip status updated successfully",
        data: trip,
      });
    } catch (error) {
      next(error);
    }
  }
}
