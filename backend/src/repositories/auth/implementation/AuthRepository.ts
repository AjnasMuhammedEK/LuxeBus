import { User , UserDocument } from "../../../models/User";
import { IOperator } from "../../../types/operator";
import { IUser } from "../../../types/user";
import { IAuthRepository } from "../interfaces/IAuthRepository";
import { injectable } from "inversify";
import { Operator, OperatorDocument } from "../../../models/Operator";

@injectable()
export class AuthRepository implements IAuthRepository {
    async userRegister(userData: IUser): Promise<UserDocument> {
        return await User.create(userData)
    }

    async findUserByEmail(email: string): Promise<UserDocument | null> {
        return await User.findOne({email})
    }

    async operatorRegister(operatorData: IOperator): Promise<OperatorDocument> {
        return await Operator.create(operatorData)
        
    }

    async findOperatorByEmail(email: string): Promise<OperatorDocument | null> {
        return await Operator.findOne({email})
    }

    async createGoogleUser(user: IUser): Promise<UserDocument> {
        return await User.create(user);
    }

}   