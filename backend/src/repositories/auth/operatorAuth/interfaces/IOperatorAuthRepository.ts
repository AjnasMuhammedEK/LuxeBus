import { IOperator } from "../../../../types/operator";
import { OperatorDocument } from "../../../../models/Operator";

export interface IOperatorAuthRepository {
    operatorRegister(data:IOperator) :Promise<OperatorDocument>
    findOperatorByEmail(email:string): Promise<OperatorDocument | null>
}