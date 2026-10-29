import { Operator, OperatorDocument } from "../../../models/Operator";
import { IOperator } from "../../../types/operator";
import { BaseRepositary } from "../../BaseRepository";
import { IOperatorRepository } from "../interface/IOperatorRepository";
import { QueryFilter, Types } from "mongoose";

export class OperatorRepository extends BaseRepositary<IOperator> implements IOperatorRepository {

    constructor() {
        super(Operator)
    }

    
    async operatorRegister(operatorData: IOperator): Promise<OperatorDocument> {
        return await this.create(operatorData)
    }

    async findOperatorByEmail(email: string): Promise<OperatorDocument | null> {
        return await this.findOne({ email })
    }

    async findOperatorById(operatorId: string): Promise<OperatorDocument | null> {
        return await this.findById(operatorId)
    }

    
 

    
    async updateOperator(operatorId: string, operatorData: Partial<IOperator>): Promise<OperatorDocument | null> {
        return await this.updateById(operatorId, { $set: operatorData })
    }

     
  async resubmitOperator(
    operatorId: string,
    operatorData: Partial<IOperator>
  ): Promise<OperatorDocument | null> {
    const { rejectReason, ...resubmitData } = operatorData;

    return await this.updateById(operatorId, {
      $set: {
        ...resubmitData,
        status: "pending" as IOperator["status"],
      },
      $unset: {
        rejectReason: "",
      },
    });
  }
}