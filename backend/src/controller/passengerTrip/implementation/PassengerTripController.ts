import { inject, injectable } from "inversify";
import type { Request, Response, NextFunction } from "express";
import { TYPES } from "../../../DI/types";
import type { IPassengerTripService } from "../../../services/userService/passengerTrip/interfaces/IPassengerTripService";  
import type { IPassengerTripController } from "../interfaces/IPassengerTripController";
import type { IPassengerTripSearchQuery } from "../../../repositories/passengerTrip/interfaces/IPassengerTripRepository";
import { HttpStatus } from "../../../constants/httpStatusCodes";
import { createResponse } from "../../../helper/responseHelper";
import logger from "../../../config/logger";

@injectable()
export class PassengerTripController implements IPassengerTripController {
  constructor(
    @inject(TYPES.PassengerTripService)
    private _passengerTripService: IPassengerTripService
  ) {}

  getUpcomingTrips = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const trips = await this._passengerTripService.getUpcomingTrips();

      res
        .status(HttpStatus.OK)
        .json(createResponse(true, "Upcoming trips fetched successfully", trips));
    } catch (error) {
      logger.error("Error fetching passenger trips", error);
      next(error);
    }
  };

  searchTrips = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const from = String(req.query.from ?? "").trim();
      const to = String(req.query.to ?? "").trim();
      const date = String(req.query.date ?? "").trim();

      if (!from || !to || !date) {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json(
            createResponse(
              false,
              "From, destination and departure date are required",
              null
            )
          );
        return;
      }

      if (from.toLowerCase() === to.toLowerCase()) {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json(
            createResponse(
              false,
              "Departure and destination cannot be the same",
              null
            )
          );
        return;
      }

      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json(createResponse(false, "Invalid departure date", null));
        return;
      }

      const parsedDate = new Date(`${date}T00:00:00.000Z`);

      if (
        Number.isNaN(parsedDate.getTime()) ||
        parsedDate.toISOString().slice(0, 10) !== date
      ) {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json(createResponse(false, "Invalid departure date", null));
        return;
      }

      const query: IPassengerTripSearchQuery = {
        from,
        to,
        date,
      };

      const trips = await this._passengerTripService.searchTrips(query);

      res
        .status(HttpStatus.OK)
        .json(createResponse(true, "Trips fetched successfully", trips));
    } catch (error) {
      logger.error("Error searching passenger trips", error);
      next(error);
    }
  };
}