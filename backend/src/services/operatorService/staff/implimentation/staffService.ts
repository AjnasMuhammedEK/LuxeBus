import { inject, injectable } from "inversify";
import { IStaff , IStaffRegisterData ,IStaffEditData, IStaffQueryParams} from "../../../../types/staff";
import { IstaffService } from "../interface/IstaffService";
 
import { TYPES} from '../../../../DI/types'
import { IStaffRepository } from "../../../../repositories/syaffRepository/interface/IStaffRepository";
import { IStorageService } from "../../../storage/interfaces/IStorageService";
import bcrypt from "bcrypt";
import { Types } from "mongoose";

@injectable()
export class StaffService implements IstaffService {

    constructor (

        @inject(TYPES.StaffRepository)
        private _staffRepository : IStaffRepository,

        @inject(TYPES.S3StorageService)
        private _storageService : IStorageService
    ){}


   async staffRegister(data: IStaffRegisterData,files: {[fieldname: string]: Express.Multer.File[];} , operatorId:string) {

    const existStaff = await this._staffRepository.findStaffByEmail(data.email)

    if(existStaff){
        throw new Error ('Staff Already Exist')
    }

    // console.log('=================//////////////////////////////////////////////////////')
 
    // console.log('operator id from service ' , operatorId)

    // console.log('=================//////////////////////////////////////////////////////')

    const hashedPassword = await bcrypt.hash(data.password,10)

    const idProof = await this._storageService.uploadFile(files.idProof[0],'staff')

    const commercialLicense = await this._storageService.uploadFile(files.commercialLicense[0],'staff') 

    const operatorObjectId = new Types.ObjectId(operatorId);

    await this._staffRepository.staffRegister ({
        operatorId:operatorObjectId,
        fullName: data.fullName,
        email:data.email,
        phone: data.mobileNumber,
        password:hashedPassword,
        role:data.role,
        joiningDate:data.joiningDate,
        idProof,
        commercialLicense,
        status: data.status,
        isBlocked:false
        
    })

   }


   async getStaffs  (operatorId: string , query: IStaffQueryParams) {
    
     
    const operatorObjectId = new Types.ObjectId(operatorId);

    const response = await this._staffRepository.getStaffs(operatorObjectId , query)
    
    return  response
         
     

   }

    async getDocumentSignedUrl(objectKey: string): Promise<string> {
        return await this._storageService.getSignedUrl(objectKey)
    }


    async editStaff(staffId: string,data: IStaffEditData, files: { [fieldname: string]: Express.Multer.File[]; }, operatorId: string) {

        const operatorOblectId = new Types.ObjectId(operatorId)

        const staff = await this._staffRepository.findStaffByIdAndOperator(staffId,operatorOblectId)

        if(!staff){
            throw new Error('Staff Not Found')
        }

        

        const updatedData : Partial<IStaff> = {
            fullName:data.fullName,
            email:data.email,
            phone:data.mobileNumber,
            role:data.role,
            joiningDate:data.joiningDate
            
        }

        if (typeof data.isBlocked === 'boolean') {
            updatedData.isBlocked = data.isBlocked
        }

        if(files?.idProof?.[0]){
            const idProof = await this._storageService.uploadFile(files.idProof[0],'staff')

            updatedData.idProof = idProof
        }

        if(files?.commercialLicense?.[0]){
            const commercialLicense = await this._storageService.uploadFile(files.commercialLicense[0],'staff')
            updatedData.commercialLicense = commercialLicense
        }

        const updatedStaff = await this._staffRepository.updateStaff(staffId,operatorOblectId,updatedData)

        if(!updatedStaff){
            throw new Error('Something went wrong on Staff Edit')
        }


        return updatedStaff
        
    }


}