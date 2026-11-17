
import { Request, Response, NextFunction } from "express";

export interface ISeatLayoutController {
  getActiveLayouts(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;

  getLayoutById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
}
