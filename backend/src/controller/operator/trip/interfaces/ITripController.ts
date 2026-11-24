
import type { Request, Response, NextFunction } from "express";

export interface ITripController {
  getTrips(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;

  getTripById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;

  updateTripStatus(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
}
