import { IUser } from "../../../types/user";
import {IOperator} from '../../../types/operator'

export interface IAuthService {
  userRegister(data:{name: string,email: string,phone: string,password: string}): Promise<void>;
  userLogin(data:{email:string,password:string}): Promise<{user:IUser,token:string}>
  operatorRegister(data: any,files: {[fieldname: string]: Express.Multer.File[];}): Promise<void>;
  operatorLogin(data:{email :string ,password:string}):Promise<{operator:IOperator,token:string}>
  AdminLogin(data:{email:string,password:string}): Promise<{user:IUser,token:string}>
  userForgotPasswordEmailVerify(data:{email:string}):Promise<{ success: boolean;message: string;}>
  googleLogin(data: {credential: string;}): Promise<{success: boolean;message: string;user: IUser;token: string;}>;
  userVerifyForgotPasswordOtp(data:{email:string , otp:string}): Promise<{success: boolean;message: string;}>
}