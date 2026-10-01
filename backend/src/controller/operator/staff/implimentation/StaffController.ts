import { inject, injectable } from "inversify";    import { IStaffController } from "../interface/IStaffController";    import { TYPES } from "../../../../DI/types";
import { IstaffService } from "../../../../services/operatorService/staff/interface/IstaffService";
import { Request, Response, NextFunction } from "express";
import { HttpStatus } from "../../../../constants/httpStatusCodes";
import { createResponse } from "../../../../helper/responseHelper";
import { StaffSortField } from "../../../../types/staff";

    @injectable()
    export class StaffController implements IStaffController {


        constructor (
            @inject(TYPES.StaffService)
            private staffService : IstaffService
        ){}

        staffRegister = async (req: Request, res: Response, next: NextFunction) => {
            try {

        

                

                console.log('staffCalled controller')

                
    

                const {
                    fullName,                
                    mobileNumber,
                    email,
                    password,
                    role,
                    joiningDate,
                    status
                } = req.body;

                const operatorId = req.user?.id

                if (!operatorId) {
                    res.status(HttpStatus.UNAUTHORIZED).json(
                        createResponse(
                            false,
                            'Unauthorized: Operator ID not found',
                            null
                        )
                    )
             
                    return;
                }
                // console.log('--------------------------------------------------------------------------')

                


                // console.log('--------------------------------------------------------------------------')

                // console.log(operatorId,'-----------------operatorId----------------')

                const files = req.files as {
                    [fieldname: string]: Express.Multer.File[];
                };

                const staff = await this.staffService.staffRegister(
                    {
                        fullName,
                        mobileNumber,
                        email,
                        password,
                        role,
                        joiningDate,
                        status
                    },
                    files,
                    operatorId
                );
                console.log('service called')
           

                res.status(HttpStatus.OK).json(
                    createResponse(
                        true,
                        "Staff registered successfully",
                        staff
                    )
                )

            } catch (error) {
                next(error);
            }
        };

        getStaffs = async (req: Request, res: Response, next: NextFunction) => {
            try {
                const operatorId = req.user?.id 

                if(!operatorId){

                    res.status(HttpStatus.UNAUTHORIZED).json(
                        createResponse(
                            false,
                            'Operator Id Not Found',
                            null
                        )
                    )
                    
                    return
                }

                const {page = '1' , limit = '5' , search = '' , sortBy = 'fullName',sortOrder = 'asc'} = req.query
                

                const response = await this.staffService.getStaffs(
                    operatorId as string,
                    {
                        page:Number(page),
                        limit:Number(limit),
                        search:String(search),
                        sortBy:sortBy as StaffSortField,
                        sortOrder : sortOrder as 'asc' | 'desc'
                    }
                )

                // console.log('from staff contreller set Staffs ', response  )

                res.status(HttpStatus.CREATED).json(
                    createResponse(
                        true,
                        'Get all staff',
                        response
                       
                    )
                    
                )

            } catch (error) {
                next(error);
            }
        }

        getDocumentSignedUrl = async (req: Request, res: Response, next: NextFunction) => {
            try {
                const {objectKey} = req.query

                if(!objectKey){
                    throw new Error('Object key is Missing')
                }
                const signedUrl = await this.staffService.getDocumentSignedUrl(objectKey as string)
                // console.log('Backend signer url' , signedUrl)

 
                res.status(HttpStatus.OK).json(
                    createResponse(
                        true , 
                        'getSigner url',
                        signedUrl
                    )
                )
            } catch (error) {
                next(error)
                
            }
        }

        editStaff = async (req: Request, res: Response, next: NextFunction) => {
            try {
                const staffId = req.params.staffId as string
                const operatorId = req.user?.id

                if(!operatorId){

                    res.status(HttpStatus.UNAUTHORIZED).json(
                        createResponse(
                            false,
                            'Operator Id Not Found',
                            null
                        )
                    )
                    return
                }

                if(!staffId){
                    res.status(HttpStatus.UNAUTHORIZED).json(
                        createResponse(
                            false,
                            'staff Id Not Found',
                            null
                        )
                    )
                    return
                }

                const {
                    fullName,
                    email,
                    phone,
                    role,
                    joiningDate,
                    isBlocked
                } = req.body

                const blockedValue = isBlocked === 'true' ? true : isBlocked === 'false' ? false : false

                const files = req.files as {
                    [fieldname: string]: Express.Multer.File[];
                };

                const updatedStaff = await this.staffService.editStaff(
                    staffId,
                    {
                        fullName,
                        email,
                        mobileNumber: phone,
                        role,
                        joiningDate,
                        isBlocked : blockedValue
                    },

                    files || {},
                    
                    operatorId
                )

                    res.status(HttpStatus.OK).json(
                        createResponse(
                            true,
                            'Staff Updated Successfully',
                            {
                                staff : updatedStaff
                            }
                        )
                    )

               


            } catch (error) {
                next(error)
            }
        }

        
    }