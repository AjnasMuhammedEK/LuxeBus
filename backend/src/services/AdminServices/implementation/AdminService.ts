import { inject, injectable } from "inversify";
import { TYPES } from "../../../DI/types";
import { IAdminRepository } from "../../../repositories/AdminRepository/interface/IAdminRepository";
import { IAdminService } from "../interface/IAdminService";
import { IOperator } from "../../../types/operator";
import { IStorageService } from "../../storage/interfaces/IStorageService";
@injectable()
export class AdminService implements IAdminService {

    constructor(
        @inject(TYPES.AdminRepository)
        private _adminRepository: IAdminRepository,

        @inject(TYPES.S3StorageService)
        private _storageService:IStorageService

    ) {}

    async getOperators(page: number,limit: number,search: string,sortBy: string,sortOrder: string)  {
 
        const result = await this._adminRepository.getOperators(
            page,
            limit,
            search,
            sortBy,
            sortOrder
        );

        const totalPages = Math.ceil(
            result.totalItems / limit
        );

        return {
            operators: result.operators,
            pagination: {
                currentPage: page,
                totalPages,
                totalItems: result.totalItems,
                limit,
            },
        };
    }

    async updateOperatorStatus(operatorId: string,status: string , reason : string | null): Promise<IOperator> {


        const existOperator = await this._adminRepository.findOperatorById(operatorId)

        if(!existOperator){
            throw new Error('Operator not found')
        }

        if(existOperator.status === 'rejected'){
            throw new Error('Rejected operators cannot be changed')
        }

        const operator = await this._adminRepository.updateOperatorStatus(operatorId,status , reason);

 

        if (!operator) {
            throw new Error("Operator notFound");
        }

        return operator;
    }

    async getDocumentSignedUrl(objectKey: string): Promise<string> {
        return await this._storageService.getSignedUrl(objectKey)
    }

    async updateOperatorBlock(operatorId: string, isBlocked: boolean): Promise<IOperator> {
        const operator = await this._adminRepository.updateOperatorBlock(operatorId,isBlocked)

        if(!operator){
            throw new Error('Operator not Found')
        }

        return operator
    }
}