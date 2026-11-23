import { inject, injectable } from "inversify";
import { Request, Response, NextFunction } from "express";

import { TYPES } from "../../../../DI/types";
import { HttpStatus } from "../../../../constants/httpStatusCodes";
import { createResponse } from "../../../../helper/responseHelper";

import type { IRouteService } from "../../../../services/operatorService/route/interface/IRouteService";
import type { IRouteController } from "../interface/IRouteController";

@injectable()
export class RouteController implements IRouteController {
  constructor(
    @inject(TYPES.RouteService)
    private _routeService: IRouteService,
  ) {}

  createRoute = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const operatorId = req.user?.id;

      if (!operatorId) {
        res
          .status(HttpStatus.UNAUTHORIZED)
          .json(createResponse(false, "Operator Id Not Found", null));
        return;
      }

      const route = await this._routeService.createRoute(operatorId, req.body);

      res
        .status(HttpStatus.CREATED)
        .json(createResponse(true, "Route created successfully", route));
    } catch (error) {
      next(error);
    }
  };

  getRoutes = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const operatorId = req.user?.id;

      if (!operatorId) {
        res
          .status(HttpStatus.UNAUTHORIZED)
          .json(createResponse(false, "Operator Id Not Found", null));
        return;
      }

      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const search =
        typeof req.query.search === "string" ? req.query.search : undefined;

      const routes = await this._routeService.getRoutes(
        operatorId,
        page,
        limit,
        search,
      );

      res
        .status(HttpStatus.OK)
        .json(createResponse(true, "Routes fetched successfully", routes));
    } catch (error) {
      next(error);
    }
  };

  getRouteById = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const operatorId = req.user?.id;

      if (!operatorId) {
        res
          .status(HttpStatus.UNAUTHORIZED)
          .json(createResponse(false, "Operator Id Not Found", null));
        return;
      }

      const { routeId } = req.params;

      if (typeof routeId !== "string") {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json(createResponse(false, "Invalid Route ID", null));
        return;
      }

      const route = await this._routeService.getRouteById(routeId, operatorId);

      res
        .status(HttpStatus.OK)
        .json(createResponse(true, "Route fetched successfully", route));
    } catch (error) {
      next(error);
    }
  };

  updateRoute = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const operatorId = req.user?.id;

      if (!operatorId) {
        res
          .status(HttpStatus.UNAUTHORIZED)
          .json(createResponse(false, "Operator Id Not Found", null));
        return;
      }

      const { routeId } = req.params;

      if (typeof routeId !== "string") {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json(createResponse(false, "Invalid Route ID", null));
        return;
      }

      const updatedRoute = await this._routeService.updateRoute(
        routeId,
        operatorId,
        req.body,
      );

      res
        .status(HttpStatus.OK)
        .json(createResponse(true, "Route updated successfully", updatedRoute));
    } catch (error) {
      next(error);
    }
  };

  deleteRoute = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const operatorId = req.user?.id;

      if (!operatorId) {
        res
          .status(HttpStatus.UNAUTHORIZED)
          .json(createResponse(false, "Operator Id Not Found", null));
        return;
      }

      const { routeId } = req.params;

      if (typeof routeId !== "string") {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json(createResponse(false, "Invalid Route ID", null));
        return;
      }

      const deletedRoute = await this._routeService.deleteRoute(
        routeId,
        operatorId,
      );

      res
        .status(HttpStatus.OK)
        .json(createResponse(true, "Route deleted successfully", deletedRoute));
    } catch (error) {
      next(error);
    }
  };

  updateRouteStatus = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const operatorId = req.user?.id;

      if (!operatorId) {
        res
          .status(HttpStatus.UNAUTHORIZED)
          .json(createResponse(false, "Operator Id Not Found", null));
        return;
      }

      const { routeId } = req.params;
      const { isActive } = req.body;

      if (typeof routeId !== "string") {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json(createResponse(false, "Invalid Route ID", null));
        return;
      }

      const updatedRoute = await this._routeService.updateRouteStatus(
        routeId,
        operatorId,
        isActive,
      );

      res
        .status(HttpStatus.OK)
        .json(
          createResponse(
            true,
            "Route status updated successfully",
            updatedRoute,
          ),
        );
    } catch (error) {
      next(error);
    }
  };
}
