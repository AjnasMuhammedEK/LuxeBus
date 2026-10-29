
import { inject, injectable } from "inversify";
import { Request, Response, NextFunction } from "express";

import { TYPES } from "../../../DI/types";
import { IOperatorController } from "../../operator/interface/IOperatorController";
import { IOperatorService } from "../../../services/operatorService/interface/IOperatorService";
import { HttpStatus } from "../../../constants/httpStatusCodes";
import { createResponse } from "../../../helper/responseHelper";

@injectable()
export class OperatorController implements IOperatorController {
    constructor(
        @inject(TYPES.OperatorService)
        private _operatorService: IOperatorService
    ) {}

    resubmitOperator = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const operatorId = req.user?.id?.toString();

            if (!operatorId) {
                res.status(HttpStatus.UNAUTHORIZED).json(
                    createResponse(
                        false,
                        "Operator ID not found",
                        null
                    )
                );
                return;
            }

            const files = req.files as
                | { [fieldname: string]: Express.Multer.File[] }
                | undefined;

            const updatedOperator =
                await this._operatorService.resubmitOperator(
                    operatorId,
                    req.body,
                    files ?? {}
                );

            res.status(HttpStatus.OK).json(
                createResponse(
                    true,
                    "Operator details resubmitted successfully",
                    updatedOperator
                )
            );
        } catch (error) {
            next(error);
        }
    };
}
