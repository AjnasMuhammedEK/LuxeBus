import { IUser } from "../../../types/user";
// import {IOperator} from '../../../types/operator'
import { IUserMappedData } from "../../../types/user";
import { IOperatorMappedData } from "../../../types/operator";

export interface IAuthService {
  userRegister(data:{name: string,email: string,phone: string,password: string}): Promise<void>;
  userLogin(data:{email:string,password:string}): Promise<{success: boolean;message: string;user: IUserMappedData;accessToken: string; refreshToken:string}>

  operatorRegister(data: {ownerName: string;email: string;phone: string;password: string;legalEntityName: string;gstNumber: string;yearOfIncorporation: string;panNumber: string;authorisedRepresentative: string;},files: { [fieldname: string]: Express.Multer.File[]; }): Promise<void>;

  operatorLogin(data:{email :string ,password:string}):Promise<{success: boolean;message: string;operator: IOperatorMappedData;accessToken: string; refreshToken:string}>
  AdminLogin(data:{email:string,password:string}): Promise<{success: boolean;message: string;admin: IUserMappedData;accessToken: string; refreshToken:string}>
  userForgotPasswordEmailVerify(data:{email:string}):Promise<{ success: boolean;message: string;}>
  googleLogin(data: {credential: string;}): Promise<{success: boolean;message: string;user: IUserMappedData;accessToken: string; refreshToken:string}>;
  userVerifyForgotPasswordOtp(data:{email:string , otp:string}): Promise<{success: boolean;message: string;}>
  userResetPassword(data:{email:string , password:string}): Promise<{success: boolean;message: string;}>

  userRefreshToken(refrehToken : string ):Promise<{accessToken:string}>
  adminRefreshToken(refreshToken : string):Promise<{accessToken : string}>
  operatorRefreshToken(refreshToken : string):Promise<{accessToken : string}>

 }