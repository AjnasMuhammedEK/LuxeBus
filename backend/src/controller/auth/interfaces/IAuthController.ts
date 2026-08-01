import {Request ,Response,NextFunction } from "express";

export interface IAuthController {
    userReguister (req : Request,res :Response,next : NextFunction):Promise<void>
    userLogin(req:Request , res:Response , next : NextFunction):Promise<void>
    operatorRegister(req: Request,res: Response,next: NextFunction): Promise<void>;
    operatorLogin(req: Request,res: Response,next: NextFunction): Promise<void>;
    adminLogin(req:Request , res:Response , next : NextFunction):Promise<void>
    userForgottPasswordEmailVerify(req:Request,res:Response,next :NextFunction):Promise<void>
    userVerifyForgotPasswordOtp(req:Request , res:Response,next:NextFunction):Promise<void>
    googleLogin(req:Request,res:Response,next:NextFunction):Promise<void>
}

 