import { BaseRepositary } from "../../../BaseRepository";
import { IOperator } from "../../../../types/operator";
import { IOperatorAuthRepository } from "../interfaces/IOperatorAuthRepository";
import { Operator ,OperatorDocument} from "../../../../models/Operator";
import { injectable } from "inversify";

@injectable()
export class OperatorAuthRepository extends BaseRepositary<IOperator> implements IOperatorAuthRepository {
    constructor(){
        super(Operator)
    }

    async operatorRegister(operatorData: IOperator): Promise<OperatorDocument> {
        return await this.create(operatorData)
        
    }

    async findOperatorByEmail(email: string): Promise<OperatorDocument | null> {
        return await this.findOne({email})
    }

    async findOperatorById(id : string):Promise<OperatorDocument | null>{
        return await this.findById(id)
    }
}