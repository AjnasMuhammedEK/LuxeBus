import { BaseRepositary } from "../../../BaseRepository";
import { IUserAuthRepository } from "../interfaces/IUserAuthRepository";
import { IUser } from "../../../../types/user";
import { injectable } from "inversify";
import { User ,UserDocument} from "../../../../models/User";

@injectable()
export class UserAuthRepository extends BaseRepositary<IUser> implements IUserAuthRepository {

    constructor(){
        super(User)
    }

    async userRegister(userData: IUser): Promise<UserDocument> {
        return await this.create(userData)
    }

    async findUserByEmail(email: string): Promise<UserDocument | null> {
        return await this.findOne({email})
    }
  
    async createGoogleUser(user: IUser): Promise<UserDocument> {
        return await this.create(user);
    }

    async updateUser(email: string, data: Partial<IUser>): Promise<IUser | null> {
        return await this.updateOne({ email },data);
    }    
}