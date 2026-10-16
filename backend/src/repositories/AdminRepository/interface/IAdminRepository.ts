import { OperatorDocument } from "../../../models/Operator";
import { IOperator } from "../../../types/operator";

export interface IAdminRepository {
    getOperators(page: number,limit: number,search: string, sortBy: string, sortOrder: string):Promise<{operators: OperatorDocument[];totalItems: number;}>;
    updateOperatorStatus(operatorId: string,status: string , reason : string | null): Promise<IOperator | null>;
    updateOperatorBlock(operatorId: string,isBlocked: boolean): Promise<IOperator | null>;
    findOperatorById(operatorId:string):Promise<IOperator|null>

}