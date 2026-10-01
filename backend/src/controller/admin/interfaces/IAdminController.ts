import { Request, Response, NextFunction } from "express";

export interface IAdminController {

    getOperators(req: Request,res: Response,next: NextFunction): Promise<void>;
    updateOperatorStatus(req: Request,res: Response,next: NextFunction): Promise<void>;
    getDocumentSignedUrl(req: Request,res: Response,next: NextFunction): Promise<void>;
    updateOperatorBlock(req: Request,res: Response,next: NextFunction): Promise<void>;
}