import { inject, injectable } from "inversify";
import { Request, Response, NextFunction } from "express";

import { TYPES } from "../../../../DI/types";
import { ITripScheduleController } from "../interfaces/ITripScheduleController";

import { ITripScheduleService } from "../../../../services/operatorService/tripSchedule/interfaces/ITripScheduleService";

import { HttpStatus } from "../../../../constants/httpStatusCodes";
import { createResponse } from "../../../../helper/responseHelper";
import logger from "../../../../config/logger";

import { ICreateTripScheduleDTO } from "../../../../types/tripSchedule";

@injectable()
export class TripScheduleController implements ITripScheduleController {
  constructor(
    @inject(TYPES.TripScheduleService)
    private _tripScheduleService: ITripScheduleService
  ) {}

  createSchedule = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const operatorId = req.user?.id;

      if (!operatorId) {
        res.status(HttpStatus.UNAUTHORIZED).json(
          createResponse(false, "Unauthorized access", null)
        );
        return;
      }

      const data = req.body as ICreateTripScheduleDTO;

      const schedule = await this._tripScheduleService.createSchedule(
        operatorId,
        data
      );

      res.status(HttpStatus.CREATED).json(
        createResponse(
          true,
          "Trip schedule created successfully",
          schedule
        )
      );
    } catch (error) {
      logger.error("Error creating trip schedule", error);
      next(error);
    }
  };

  getSchedules = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const operatorId = req.user?.id;

      if (!operatorId) {
        res.status(HttpStatus.UNAUTHORIZED).json(
          createResponse(false, "Unauthorized access", null)
        );
        return;
      }

      const schedules = await this._tripScheduleService.getSchedules(
        operatorId
      );

      res.status(HttpStatus.OK).json(
        createResponse(
          true,
          "Trip schedules fetched successfully",
          schedules
        )
      );
    } catch (error) {
      logger.error("Error fetching trip schedules", error);
      next(error);
    }
  };

  getScheduleById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const operatorId = req.user?.id;

      if (!operatorId) {
        res.status(HttpStatus.UNAUTHORIZED).json(
          createResponse(false, "Unauthorized access", null)
        );
        return;
      }

      const scheduleId = req.params.scheduleId;

      if (typeof scheduleId !== "string" || !scheduleId.trim()) {
        res.status(HttpStatus.BAD_REQUEST).json(
          createResponse(false, "Invalid schedule ID", null)
        );
        return;
      }

      const schedule = await this._tripScheduleService.getScheduleById(
        scheduleId,
        operatorId
      );

      res.status(HttpStatus.OK).json(
        createResponse(
          true,
          "Trip schedule details fetched successfully",
          schedule
        )
      );
    } catch (error) {
      logger.error("Error fetching trip schedule details", error);
      next(error);
    }
  };

  updateSchedule = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const operatorId = req.user?.id;

      if (!operatorId) {
        res.status(HttpStatus.UNAUTHORIZED).json(
          createResponse(false, "Unauthorized access", null)
        );
        return;
      }

      const scheduleId = req.params.scheduleId;

      if (typeof scheduleId !== "string" || !scheduleId.trim()) {
        res.status(HttpStatus.BAD_REQUEST).json(
          createResponse(false, "Invalid schedule ID", null)
        );
        return;
      }

      const data = req.body as Partial<ICreateTripScheduleDTO>;

      const updatedSchedule =
        await this._tripScheduleService.updateSchedule(
          scheduleId,
          operatorId,
          data
        );

      res.status(HttpStatus.OK).json(
        createResponse(
          true,
          "Trip schedule updated successfully",
          updatedSchedule
        )
      );
    } catch (error) {
      logger.error("Error updating trip schedule", error);
      next(error);
    }
  };

  deleteSchedule = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const operatorId = req.user?.id;

      if (!operatorId) {
        res.status(HttpStatus.UNAUTHORIZED).json(
          createResponse(false, "Unauthorized access", null)
        );
        return;
      }

      const scheduleId = req.params.scheduleId;

      if (typeof scheduleId !== "string" || !scheduleId.trim()) {
        res.status(HttpStatus.BAD_REQUEST).json(
          createResponse(false, "Invalid schedule ID", null)
        );
        return;
      }

      await this._tripScheduleService.deleteSchedule(
        scheduleId,
        operatorId
      );

      res.status(HttpStatus.OK).json(
        createResponse(
          true,
          "Trip schedule deleted successfully",
          null
        )
      );
    } catch (error) {
      logger.error("Error deleting trip schedule", error);
      next(error);
    }
  };
}