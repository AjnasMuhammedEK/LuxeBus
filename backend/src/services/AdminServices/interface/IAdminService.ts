import { IOperator } from "../../../types/operator";

export interface IAdminService {

    getOperators(): Promise<IOperator[]>
    updateOperatorStatus(operatorId: string,status: string): Promise<IOperator>
    getDocumentSignedUrl(objectKey: string): Promise<string>
}