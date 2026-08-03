import { IUser } from "../../../../types/user";
import { UserDocument } from "../../../../models/User";

export interface IUserAuthRepository {
    userRegister (user : IUser) : Promise<IUser>
    findUserByEmail(email:string): Promise<UserDocument  | null>
    updateUser(email:string , data : Partial<IUser>):Promise<IUser | null>
    createGoogleUser(user: IUser): Promise<UserDocument>;
}