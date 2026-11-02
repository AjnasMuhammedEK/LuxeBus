import { IOperator } from "../../../types/operator";
import { IOperatorMappedData } from "../../../types/operator";

export interface IAdminService {

    getOperators(page: number,limit: number,search: string,sortBy: string,sortOrder: string): Promise<{
        operators: IOperatorMappedData[];
        pagination: {
            currentPage: number;
            totalPages: number;
            totalItems: number;
            limit: number;
        };
    }>
    updateOperatorStatus(operatorId: string,status: string , reason : string | null): Promise<IOperator>
    getDocumentSignedUrl(objectKey: string): Promise<string>
    updateOperatorBlock(operatorId: string,isBlocked: boolean): Promise<IOperator>;
}