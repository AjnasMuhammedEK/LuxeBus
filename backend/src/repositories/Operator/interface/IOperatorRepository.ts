import { OperatorDocument } from "../../../models/Operator";
import { IOperator } from "../../../types/operator";

export interface IOperatorRepository {
    operatorRegister(operator: IOperator): Promise<OperatorDocument>

    findOperatorByEmail(email: string): Promise<OperatorDocument | null>

    findOperatorById(operatorId: string): Promise<OperatorDocument | null>

 

    updateOperator(operatorId: string, operatorData: Partial<IOperator>): Promise<OperatorDocument | null>

    resubmitOperator(operatorId: string, operatorData: Partial<IOperator>): Promise<OperatorDocument | null>
}