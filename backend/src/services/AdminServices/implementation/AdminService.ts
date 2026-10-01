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
        private adminRepository: IAdminRepository,

        @inject(TYPES.S3StorageService)
        private storageService:IStorageService

    ) {}

    async getOperators(page: number,limit: number,search: string,sortBy: string,sortOrder: string)  {
 
        const result = await this.adminRepository.getOperators(
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

    async updateOperatorStatus(operatorId: string,status: string): Promise<IOperator> {

        const operator =await this.adminRepository.updateOperatorStatus(operatorId,status);

        if (!operator) {
            throw new Error("Operator notFound");
        }

        return operator;
    }

    async getDocumentSignedUrl(objectKey: string): Promise<string> {
        return await this.storageService.getSignedUrl(objectKey)
    }

    async updateOperatorBlock(operatorId: string, isBlocked: boolean): Promise<IOperator> {
        const operator = await this.adminRepository.updateOperatorBlock(operatorId,isBlocked)

        if(!operator){
            throw new Error('Operator not Found')
        }

        return operator
    }
}