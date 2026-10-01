import { Request, Response, NextFunction } from "express";

export interface IStaffController {
    staffRegister(req:Request , res:Response , next :NextFunction):Promise<void>
    getStaffs(req:Request , res : Response , next : NextFunction):Promise<void>
    getDocumentSignedUrl(req:Request , res : Response , next : NextFunction):Promise<void>
    editStaff(req:Request , res : Response , next : NextFunction):Promise<void>
}