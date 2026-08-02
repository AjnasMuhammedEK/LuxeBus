import bcrypt from 'bcrypt'
import { IAuthService } from '../interface/IAuthService'
import { IAuthRepository } from '../../../repositories/auth/interfaces/IAuthRepository'
import { inject, injectable } from "inversify";
import { TYPES } from '../../../DI/types';
import { generateToken } from "../../../utils/jwt";
import { IStorageService } from "../../storage/interfaces/IStorageService";
import { IOperator } from '../../../types/operator';
import { IUser } from '../../../types/user';
import { PassThrough } from 'node:stream';
import { OAuth2Client } from "google-auth-library";
import { generateOtp } from '../../../utils/generateOtp';
import crypto from 'crypto'
import redisclient from '../../../config/redis';
import { IEmailService } from '../../email/interface/IEmailService';

@injectable()
export class AuthService implements IAuthService {

    private client: OAuth2Client

    constructor(
        @inject(TYPES.AuthRepository) private authRepository:IAuthRepository,
        @inject(TYPES.S3StorageService) private storageService: IStorageService,
        @inject(TYPES.EmailService) private emailService:IEmailService
    ){  
        this.client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    }

    async userRegister(data:{name: string, email: string, phone: string, password: string}) {
        const { name, email, phone, password } = data;
        const exist = await this.authRepository.findUserByEmail(email)

        if(exist){
            throw new Error("User already exists")
        }

        const hashpassword = await bcrypt.hash(password,10)

        await this.authRepository.userRegister({
            name,
            email,
            phone,
            password:hashpassword,
            role:'user',
            isBlocked:false,
            isVerified:true
        })
    }

    async userLogin(data: { email: string; password: string; }) {
        const {email ,password} = data

        const existUser = await this.authRepository.findUserByEmail(email)

        if(!existUser){
            throw new Error('User Not Found')
        }

        if(existUser.role === 'admin'){
            throw new Error('User not found')
        }

        if(existUser.password === '' && existUser.googleId !== ''){
            throw new Error('This account was created using google. Please continue with google sign-in')
        }

        const isMatch = await bcrypt.compare(password , existUser.password)

        if(!isMatch){
            throw new Error('Incorrect Password')
        }

        const token = generateToken(
            existUser._id.toString(),
            existUser.role
        );

        return {
            success: true,
            message: "Login Successful",
            user: existUser,
            token
        };


    }


    async operatorRegister(data: any,files: {[fieldname: string]: Express.Multer.File[];}){

        const exist = await this.authRepository.findOperatorByEmail(data.email)

        if(exist){
            throw new Error('Operator already exists')
        }
        const password = await bcrypt.hash(data.password,10)

        const registrationCertificate = await this.storageService.uploadFile(
            files.registrationCertificate[0],
            "operators"
        );

        const taxCertificate = await this.storageService.uploadFile(
            files.taxCertificate[0],
            "operators"
        );

        const transportLicense = await this.storageService.uploadFile(
            files.transportLicense[0],
            "operators"
        );
             
        await this.authRepository.operatorRegister({
            ownerName: data.ownerName,
            email: data.email,
            phone: data.phone,
            password: password,
            role:'operator',
            legalEntityName: data.legalEntityName,
            gstNumber: data.gstNumber,
            yearOfIncorporation: data.yearOfIncorporation,
            panNumber: data.panNumber,
            authorisedRepresentative: data.authorisedRepresentative,
            registrationCertificate,
            taxCertificate,
            transportLicense,
            status: "pending"

        });
    }

    async operatorLogin(data: { email: string; password: string; }) {
        const {email , password} = data

        const exist = await this.authRepository.findOperatorByEmail(email)

        if(!exist){
            throw new Error('User Not Found , Please Register')
        }

        const isMAtch = await bcrypt.compare(password,exist.password)

        if(!isMAtch){
            throw new Error('Incorrect Password')
        }

        const token = generateToken(
            exist._id.toString() ,
            exist.role
        )

        return{
            success: true,
            message: "Login Successful",
            operator: exist,
            token
        }
    }

    async AdminLogin(data: { email: string; password: string; }) {
        const {email , password} = data

        const existAdmin = await this.authRepository.findUserByEmail(email)

        if(!existAdmin){
            throw new Error('Admin Not Found')
        }

        if (existAdmin.role !== "admin") {
            throw new Error("Access denied");
        }

        const isMAtch = await bcrypt.compare(password,existAdmin.password)
        if(!isMAtch){
            throw new Error('Incorrect Password')
        }

        const token = generateToken(
            existAdmin._id.toString(),
            existAdmin.role
        );

        return {
            success: true,
            message: "Admin Login Successful",
            user : existAdmin,
            token,
        };
    }

    
   async userForgotPasswordEmailVerify(data: { email: string; }) {
       const {email} = data

       const existUser = await this.authRepository.findUserByEmail(email)

       if(!existUser){
        throw new Error('User Not Found')
       }   

       const {otp , hashedOtp} = generateOtp()

       const redisKey = `forgotPassword:${email}`

       await redisclient.setEx(
        redisKey,
        120,
        hashedOtp
       )

       await this.emailService.sendOtpEmail(email,otp)

       return {success:true,message : `otp sent to ${email} successfully`}
    }

    async userVerifyForgotPasswordOtp(data: { email: string; otp: string; }) {
        const {email , otp } = data

        const redisKey = `forgotPassword:${email}`
        const storedOtp = await redisclient.get(redisKey)

        if(!storedOtp){
            throw new Error('OTP Expired')
        }
      
        console.log('==-==-==-=',storedOtp)
        const hashedUserOtp = crypto.createHash("sha256").update(otp).digest("hex");
        console.log('Completed the comparision')
        console.log('-------------------')
       
        if(hashedUserOtp !== storedOtp){
            throw new Error('Invalid OTP')
        }
        console.log('Successed Verification OTP ')
        return {success:true , message :"OTP Verified"}
        
    }

    async userResetPassword(data: { email: string; password: string; })  {
        const {email , password} = data

        const existUser = await this.authRepository.findUserByEmail(email)
        const hashpassword = await bcrypt.hash(password,10)

        if(!existUser){
            throw new Error('User Not Found')
        }

        await this.authRepository.updateUser(email,{password:hashpassword})

        return {success:true , message : 'Password Changed Successfuly'}
    }




    async googleLogin(data: { credential: string }) {

        const { credential } = data;

        const ticket = await this.client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();

        if (!payload) {
            throw new Error("Google authentication failed");
        }

        const {sub,name,email,} = payload;

        if (!email) {
            throw new Error("Email not found");
        }

        let existUser = await this.authRepository.findUserByEmail(email);

        if (!existUser) {
            existUser = await this.authRepository.createGoogleUser({

                name: name || "",
                email,
                phone: "",
                password: "",
                googleId: sub,
                role: "user",
                isBlocked: false,
                isVerified: true,
            });
        }

        const token = generateToken(
            existUser._id.toString(),
            existUser.role
        );

        return {success: true,message: "Google Login Successful",user: existUser,token};
    }
}