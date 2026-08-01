import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "inversify";

import { TYPES } from "../../../DI/types";
import { IAdminController } from "../interfaces/IAdminController";
import { IAdminService } from "../../../services/AdminServices/interface/IAdminService";

@injectable()
export class AdminController implements IAdminController {

    constructor(
        @inject(TYPES.AdminService)
        private adminService: IAdminService
    ) {}

    getOperators = async (req: Request,res: Response,next: NextFunction): Promise<void> => {

        try {

            const operators =await this.adminService.getOperators();

            res.status(200).json({success: true,operators
            });

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

            res.status(200).json({
                success: true,
                message: "Operator status updated successfully",
                operator,
            });

        } catch (error) {

            console.log("ERROR in updateOperatorStatus:", error);
            next(error);

        }
    }

}