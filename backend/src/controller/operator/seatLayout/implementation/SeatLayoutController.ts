import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "inversify";

import { TYPES } from "../../../../DI/types";
import { HttpStatus } from "../../../../constants/httpStatusCodes";
import { createResponse } from "../../../../helper/responseHelper";

import { ISeatLayoutService } from "../../../../services/seatLayout/interface/ISeatLayoutService";
import { ISeatLayoutController } from "../interfaces/ISeatLayoutController";

import logger from "../../../../config/logger";

@injectable()
export class SeatLayoutController implements ISeatLayoutController {

    constructor(
        @inject(TYPES.SeatLayoutService) private _seatLayoutService : ISeatLayoutService
    ){}

    getActiveLayouts = async (req: Request, res: Response, next: NextFunction) => {
        try {

            console.log('--------- getActiveLayouts called -----------------')
            const layouts = await this._seatLayoutService.getActiveLayouts()

            res.status(HttpStatus.OK).json(
                createResponse(
                    true,
                    'seat layouts fetched successfully',
                    layouts
                )
            )
        } catch (error) {
            logger.error('Error in getActiveLayouts controller : ',error)
            next(error)
        }
    }

    getLayoutById = async(req: Request, res: Response, next: NextFunction)=> {
        
        try {

            console.log('--------- getLayoutById called -----------------')

            
            const {id} = req.params 

            if(typeof id !== "string" || !id.trim()){
                throw new Error('seat layout id is not found')
            }

            const layout = await this._seatLayoutService.getLayoutById(id)

            res.status(HttpStatus.OK).json(
                createResponse(
                    true,
                    'seat layout fetched successfully',
                    layout
                )
            )
        } catch (error) {
            logger.error('error in getLayoutById controller : ',error)
            next(error)
        }
    }

}