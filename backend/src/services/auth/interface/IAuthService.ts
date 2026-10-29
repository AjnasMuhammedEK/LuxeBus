import { IUserMappedData } from "../../../types/user";
import { IOperatorMappedData } from "../../../types/operator";
import { IStaffMappedData } from "../../../types/staff";

export interface IAuthService {
  userRegister(data:{name: string,email: string,phone: string,password: string}): Promise<void>;
  userLogin(data:{email:string,password:string}): Promise<{user: IUserMappedData;accessToken: string; refreshToken:string}>

  operatorRegister(data: {ownerName: string;email: string;phone: string;password: string;legalEntityName: string;gstNumber: string;yearOfIncorporation: string;panNumber: string;authorisedRepresentative: string;},files: { [fieldname: string]: Express.Multer.File[]; }): Promise<void>;

  operatorLogin(data:{email :string ,password:string}):Promise<{operator: IOperatorMappedData;accessToken: string; refreshToken:string}>
  AdminLogin(data:{email:string,password:string}): Promise<{admin: IUserMappedData;accessToken: string; refreshToken:string}>
  userForgotPasswordEmailVerify(data:{email:string}):Promise<{ success: boolean;message: string;}>
  googleLogin(data: {credential: string;}): Promise<{user: IUserMappedData;accessToken: string; refreshToken:string}>;
  userVerifyForgotPasswordOtp(data:{email:string , otp:string}): Promise<{success: boolean;message: string;}>
  userResetPassword(data:{email:string , password:string}): Promise<{success: boolean;message: string;}>

  userRefreshToken(refrehToken : string ):Promise<{accessToken:string}>
  adminRefreshToken(refreshToken : string):Promise<{accessToken : string}>
  operatorRefreshToken(refreshToken : string):Promise<{accessToken : string}>
  staffRefreshToken(refreshToken : string):Promise<{accessToken : string}>
  staffLogin (data:{email :string , password : string}) : Promise<{staff: IStaffMappedData;accessToken: string; refreshToken:string}>
  genrateOperatorOtp(data:{email : string}):Promise<{operatorOtp:string}>
  verifyOperatorOtp(data:{email : String , otp : string }) : Promise<{success: boolean;message: string;}>
  generateUserRegistrationOtp(data :{email:string}):Promise<{success: boolean , message:string}>
  verifyUserRegistrationOtp(data :{email : string , otp : string}): Promise<{success: boolean;message: string;}>
 }