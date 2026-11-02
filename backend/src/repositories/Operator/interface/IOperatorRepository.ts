import { OperatorDocument } from "../../../models/Operator";
import { IOperator } from "../../../types/operator";

export interface IOperatorRepository {
     

    findOperatorById(operatorId: string): Promise<OperatorDocument | null>

 

     

    resubmitOperator(operatorId: string, operatorData: Partial<IOperator>): Promise<OperatorDocument | null>
}