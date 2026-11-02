import { Operator, OperatorDocument } from "../../../models/Operator";
import { IOperator } from "../../../types/operator";
import { BaseRepositary } from "../../BaseRepository";
import { IOperatorRepository } from "../interface/IOperatorRepository";
 

export class OperatorRepository extends BaseRepositary<IOperator> implements IOperatorRepository {

    constructor() {
        super(Operator)
    }

    
 
 
    async findOperatorById(operatorId: string): Promise<OperatorDocument | null> {
        return await this.findById(operatorId)
    }

    
 

    
     
  async resubmitOperator(
    operatorId: string,
    operatorData: Partial<IOperator>
  ): Promise<OperatorDocument | null> {
     
    return this.updateById(operatorId, {
        ...operatorData,
        status: "pending",
        rejectReason: null,
    });
  }
}