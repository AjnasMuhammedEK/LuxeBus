import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "inversify";

import { TYPES } from "../../../DI/types";
import { IAdminController } from "../interfaces/IAdminController";
import { IAdminService } from "../../../services/AdminServices/interface/IAdminService";
import { HttpStatus } from "../../../constants/httpStatusCodes";
import { createResponse } from "../../../helper/responseHelper";

@injectable()
export class AdminController implements IAdminController {

    constructor(
        @inject(TYPES.AdminService)
        private adminService: IAdminService
    ) {}

    getOperators = async (req: Request,res: Response,next: NextFunction): Promise<void> => {

        try {


            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;

 
            const search = (req.query.search as string) || "";

            const sortBy = (req.query.sortBy as string) || "createdAt";

            const sortOrder = (req.query.sortOrder as string) || "desc";

            const response = await this.adminService.getOperators(
                page,
                limit,
                search,
                sortBy,
                sortOrder
            );

            res.status(HttpStatus.OK).json(
                createResponse(
                    true,
                    "Operators fetched successfully",
                    response
                )
            );

            
        } catch (error) {

            console.log("ERROR in AdminController getPendingOperators:",error);
            next(error);
        }

    };

    updateOperatorStatus = async (req: Request, res: Response, next: NextFunction)=> {
        try {

            const operatorId = req.params.operatorId as string;
            const { status } = req.body;

            const operator = await this.adminService.updateOperatorStatus(
                operatorId,
                status
            );

            res.status(HttpStatus.OK).json(
                createResponse(
                    true,
                    "Operator status updated successfully",
                    operator
                )
            )
            
        } catch (error) {

            console.log("ERROR in updateOperatorStatus:", error);
            next(error);

        }
    }

    getDocumentSignedUrl = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {objectKey} = req.query

            if(!objectKey){
                throw new Error('Object key is Missing')
            }
            const signedUrl = await this.adminService.getDocumentSignedUrl(objectKey as string)
            // console.log('Backend signer url' , signedUrl)

            res.status(HttpStatus.OK).json(
                createResponse(
                    true,
                    "Document signed URL generated successfully",
                    {
                        signedUrl
                    }
                )
            )

             
        } catch (error) {
            next(error)
            
        }
    }

    updateOperatorBlock = async (req: Request, res: Response, next: NextFunction)=> {
        try {
            
            const operatorId = req.params.operatorId as string;

            const {isBlocked} = req.body

            const operator = await this.adminService.updateOperatorBlock(operatorId,isBlocked)

            res.status(HttpStatus.OK).json(
                createResponse(
                    true,
                     "Operator blocked updated successfully",                   
                    operator
                )
            );
        } catch (error) {
            console.log("ERROR in updateOperatorBlock:", error);
            next(error)
        }
    }

}