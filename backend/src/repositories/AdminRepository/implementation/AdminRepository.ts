import { injectable } from "inversify";
import { Operator, OperatorDocument } from "../../../models/Operator";
import { IAdminRepository } from "../interface/IAdminRepository";
import { IOperator } from "../../../types/operator";
import { BaseRepositary } from "../../BaseRepository";

@injectable()
export class AdminRepository implements IAdminRepository {

    private operatorRepository = new BaseRepositary(Operator)

    async getOperators(): Promise<OperatorDocument[]> {
        return await Operator.find().sort({ createdAt: -1 });
    }

    async updateOperatorStatus(operatorId: string,status: string): Promise<IOperator | null> {

        return await this.operatorRepository.updateById(operatorId,{ status });
    }
}