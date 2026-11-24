import { Request, Response, NextFunction } from "express";

export interface ITripScheduleController {
  createSchedule(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;

  getSchedules(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;

  getScheduleById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;

  updateSchedule(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;

  deleteSchedule(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
}