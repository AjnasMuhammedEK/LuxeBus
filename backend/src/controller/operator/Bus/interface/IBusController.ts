import { Request, Response, NextFunction } from "express";

export interface IBusController {
  createBus(req: Request,res: Response,next: NextFunction): Promise<void>;
  getBuses(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void>;

  getDocumentSignedUrl(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;

  resubmitBus(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void>;
}