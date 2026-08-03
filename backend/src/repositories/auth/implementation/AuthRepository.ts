// import { User , UserDocument } from "../../../models/User";
// import { IOperator } from "../../../types/operator";
// import { IUser } from "../../../types/user";
// import { IAuthRepository } from "../interfaces/IAuthRepository";
// import { injectable } from "inversify";
// import { Operator, OperatorDocument } from "../../../models/Operator";
// import { BaseRepositary } from "../../BaseRepository";

// @injectable()
// export class AuthRepository implements IAuthRepository {

//     private userRepository = new BaseRepositary(User);

//     private operatorRepository = new BaseRepositary(Operator);


//     async userRegister(userData: IUser): Promise<UserDocument> {
//         return await this.userRepository.create(userData)
//     }

//     async findUserByEmail(email: string): Promise<UserDocument | null> {
//         return await this.userRepository.findOne({email})
//     }

//     async operatorRegister(operatorData: IOperator): Promise<OperatorDocument> {
//         return await this.operatorRepository.create(operatorData)
        
//     }

//     async findOperatorByEmail(email: string): Promise<OperatorDocument | null> {
//         return await this.operatorRepository.findOne({email})
//     }

//     async createGoogleUser(user: IUser): Promise<UserDocument> {
//         return await this.userRepository.create(user);
//     }

//     async updateUser(email: string, data: Partial<IUser>): Promise<IUser | null> {
//         return await this.userRepository.updateOne({ email },data);
//     }

// }   