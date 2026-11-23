import { Request, Response, NextFunction } from "express";

export interface IRouteController {
  createRoute(req: Request, res: Response, next: NextFunction): Promise<void>;

  getRoutes(req: Request, res: Response, next: NextFunction): Promise<void>;

  getRouteById(req: Request, res: Response, next: NextFunction): Promise<void>;

  updateRoute(req: Request, res: Response, next: NextFunction): Promise<void>;

  deleteRoute(req: Request, res: Response, next: NextFunction): Promise<void>;

  updateRouteStatus(req: Request, res: Response, next: NextFunction): Promise<void>;
}