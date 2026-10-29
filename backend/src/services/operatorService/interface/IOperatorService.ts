
import {
    IOperator,
    IOperatorResubmitData,
} from "../../../types/operator";

export interface IOperatorService {
    resubmitOperator(
        operatorId: string,
        data: IOperatorResubmitData,
        files: { [fieldname: string]: Express.Multer.File[] }
    ): Promise<IOperator>;
}
