import { inject, injectable } from "inversify";
import { TYPES } from "../../../DI/types";
import { IAdminRepository } from "../../../repositories/AdminRepository/interface/IAdminRepository";
import { IAdminService } from "../interface/IAdminService";
import { IOperator } from "../../../types/operator";

@injectable()
export class AdminService implements IAdminService {

    constructor(
        @inject(TYPES.AdminRepository)
        private adminRepository: IAdminRepository
    ) {}

    async getOperators(): Promise<IOperator[]> {
        return await this.adminRepository.getOperators();
    }

    async updateOperatorStatus(operatorId: string,status: string): Promise<IOperator> {

        const operator =await this.adminRepository.updateOperatorStatus(operatorId,status);

        if (!operator) {
            throw new Error("Operator notFound");
        }

        return operator;
    }
}