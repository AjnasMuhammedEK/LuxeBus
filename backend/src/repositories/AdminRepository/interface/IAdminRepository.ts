import { OperatorDocument } from "../../../models/Operator";
import { IOperator } from "../../../types/operator";

export interface IAdminRepository {
    getOperators(): Promise<OperatorDocument[]>;
    updateOperatorStatus(operatorId: string,status: string): Promise<IOperator | null>;
}