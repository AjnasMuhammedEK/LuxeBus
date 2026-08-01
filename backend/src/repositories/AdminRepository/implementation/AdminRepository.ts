import { injectable } from "inversify";
import { Operator, OperatorDocument } from "../../../models/Operator";
import { IAdminRepository } from "../interface/IAdminRepository";
import { IOperator } from "../../../types/operator";

@injectable()
export class AdminRepository implements IAdminRepository {

    async getOperators(): Promise<OperatorDocument[]> {

        return await Operator.find().sort({ createdAt: -1 });

    }

    async updateOperatorStatus(operatorId: string,status: string): Promise<IOperator | null> {

        return await Operator.findByIdAndUpdate(operatorId,{status },{ new: true });
    }

}