import { Request, Response, NextFunction } from "express";

export interface IAdminController {
  getOperators(req: Request, res: Response, next: NextFunction): Promise<void>;
  updateOperatorStatus(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
  getDocumentSignedUrl(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
  updateOperatorBlock(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
  getAdminBuses(req: Request, res: Response, next: NextFunction): Promise<void>;
  getBusDocumentSignedUrl(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;

  updateBusStatus(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
}
