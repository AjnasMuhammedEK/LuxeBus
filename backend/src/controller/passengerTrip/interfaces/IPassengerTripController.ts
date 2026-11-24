import type { Request, Response, NextFunction } from "express";

export interface IPassengerTripController {
  getUpcomingTrips(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;

  searchTrips(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
}