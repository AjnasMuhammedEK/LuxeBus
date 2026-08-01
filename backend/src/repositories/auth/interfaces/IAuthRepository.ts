import { IUser } from "../../../types/user";
import { UserDocument } from "../../../models/User";
import { IOperator } from "../../../types/operator";
import { OperatorDocument } from "../../../models/Operator";

export interface IAuthRepository  {
    userRegister (user : IUser) : Promise<IUser>
    findUserByEmail(email:string): Promise<UserDocument  | null>

    operatorRegister(data:IOperator) :Promise<OperatorDocument>
    findOperatorByEmail(email:string): Promise<OperatorDocument | null>
    createGoogleUser(user: IUser): Promise<UserDocument>;
 }