import { Request, Response, NextFunction } from "express";

export interface IOperatorController {

    resubmitOperator(req: Request,res: Response,next: NextFunction): Promise<void>;
 
}