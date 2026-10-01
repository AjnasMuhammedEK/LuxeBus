import bcrypt from 'bcrypt'
import { IAuthService } from '../interface/IAuthService'
 import { inject, injectable } from "inversify";
import { TYPES } from '../../../DI/types';
import { generateAccessToken ,generateRefreshToken , verifyRefreshToken } from "../../../utils/jwt";
import { IStorageService } from "../../storage/interfaces/IStorageService";
import { OAuth2Client } from "google-auth-library";
import { generateOtp } from '../../../utils/generateOtp';
import crypto from 'crypto'
import redisclient from '../../../config/redis';
import { IEmailService } from '../../email/interface/IEmailService';
import { userDataMapping } from '../../../utils/mapping/userDto';
import { operatorDataMapping } from '../../../utils/mapping/operatorDto';
import { IUserAuthRepository } from '../../../repositories/auth/userAuth/interfaces/IUserAuthRepository';
import { IOperatorAuthRepository } from '../../../repositories/auth/operatorAuth/interfaces/IOperatorAuthRepository';
import { IOperatorRegisterData } from '../../../types/operator';
import logger from '../../../config/logger';


@injectable()
export class AuthService implements IAuthService {

    private client: OAuth2Client

    constructor(
        @inject(TYPES.UserAuthRepository)private userRepository : IUserAuthRepository,
        @inject(TYPES.OperatorAuthRepository)private operatorRepository:IOperatorAuthRepository,
        @inject(TYPES.S3StorageService) private storageService: IStorageService,
        @inject(TYPES.EmailService) private emailService:IEmailService
    ){  
        this.client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    }

    async userRegister(data:{name: string, email: string, phone: string, password: string}) {
        const { name, email, phone, password } = data;
        const exist = await this.userRepository.findUserByEmail(email)

        if(exist){
            throw new Error("User already exists")
        }

        const hashpassword = await bcrypt.hash(password,10)

        logger.info(`New user registered: ${email}`);

        await this.userRepository.userRegister({
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

        const existUser = await this.userRepository.findUserByEmail(email)

        if(!existUser){
            logger.warn(`User not found: ${email}`);
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
            logger.warn(`Wrong password: ${email}`);
            throw new Error('Incorrect Password')
        }

        const accessToken = generateAccessToken(existUser._id.toString(), existUser.role)

        const refreshToken = generateRefreshToken(existUser._id.toString() , existUser.role)

        logger.info(`User logged in: ${email}`);
      

        return {
            user: userDataMapping(existUser),
            accessToken,
            refreshToken
        };


    }


    async operatorRegister(data: IOperatorRegisterData,files: {[fieldname: string]: Express.Multer.File[];}){

        const exist = await this.operatorRepository.findOperatorByEmail(data.email)

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
             
        await this.operatorRepository.operatorRegister({
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
            status: "pending",
            isBlocked: false

        });
    }

    async operatorLogin(data: { email: string; password: string; }) {
        const {email , password} = data

        const exist = await this.operatorRepository.findOperatorByEmail(email)

        if(!exist){
            throw new Error('User Not Found , Please Register')
        }

        const isMAtch = await bcrypt.compare(password,exist.password)

        if(!isMAtch){
            throw new Error('Incorrect Password')
        }

        if(exist.isBlocked){
            throw new Error('operator account has been blocked ! please contact our support team')
        }

        const accessToken = generateAccessToken(exist._id.toString() ,exist.role)

        const refreshToken = generateRefreshToken(exist._id.toString() ,exist.role)

        return{
            operator: operatorDataMapping(exist),
            accessToken,
            refreshToken
        }
    }

    async AdminLogin(data: { email: string; password: string; }) {
        const {email , password} = data

        const existAdmin = await this.userRepository.findUserByEmail(email)

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

        const accessToken = generateAccessToken(existAdmin._id.toString(),existAdmin.role);

        const refreshToken = generateRefreshToken(existAdmin._id.toString(),existAdmin.role);

        return {
            admin : userDataMapping(existAdmin),
            accessToken,
            refreshToken
        };
    }

    
   async userForgotPasswordEmailVerify(data: { email: string; }) {
       const {email} = data

       const existUser = await this.userRepository.findUserByEmail(email)

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
      
        // console.log('==-==-==-=',storedOtp)
        const hashedUserOtp = crypto.createHash("sha256").update(otp).digest("hex");
        // console.log('Completed the comparision')
        // console.log('-------------------')
       
        if(hashedUserOtp !== storedOtp){
            throw new Error('Invalid OTP')
        }
        console.log('Successed Verification OTP ')
        return {success:true , message :"OTP Verified"}
        
    }

    async userResetPassword(data: { email: string; password: string; })  {
        const {email , password} = data

        const existUser = await this.userRepository.findUserByEmail(email)
        const hashpassword = await bcrypt.hash(password,10)

        if(!existUser){
            throw new Error('User Not Found')
        }

        await this.userRepository.updateUser(email,{password:hashpassword})

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

        let existUser = await this.userRepository.findUserByEmail(email);

        if (!existUser) {
            existUser = await this.userRepository.createGoogleUser({

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

        const accessToken = generateAccessToken(existUser._id.toString(),existUser.role);

        const refreshToken = generateRefreshToken(existUser._id.toString(),existUser.role);

        return {
            user: userDataMapping(existUser),
            accessToken,
            refreshToken
        }
    }

    async userRefreshToken(refrehToken: string) {

        const decoded = verifyRefreshToken(refrehToken)

        if(!decoded){
            throw new Error ('Invalid or expired refrsh token')
        }

        if(decoded.role !== 'user'){
            throw new Error ('Invalid Refresh Token')
        }

        const user = await this.userRepository.findUserById(decoded.id)

        if(!user){
            throw new Error('User Not Found')
        }

        if(user.isBlocked){
            throw new Error('User Is Blocked')
        }

        const accessToken = generateAccessToken(decoded.id , decoded.role)

        return {
            accessToken
        }
        
    }

    async adminRefreshToken(refreshToken: string) {
        
        const decoded = verifyRefreshToken(refreshToken)

        if(!decoded){
            throw new Error('Invalid Or Expired Refresh Token')
        }

        if(decoded.role !== 'admin'){
            throw new Error ('Invalid Refresh Token')
        }

        const admin = await this.userRepository.findUserById(decoded.id)

        if(!admin){
            throw new Error ('Admin Not Found')
        }

        if(admin.isBlocked){
            throw new Error ('Admin is blocked')
        }
        const accessToken = generateAccessToken(decoded.id , decoded.role)

        return {accessToken}
    }

    async operatorRefreshToken(refreshToken: string) {
        
        const decode = verifyRefreshToken(refreshToken)

        if(!decode){
            throw new Error('Innalid Refresh Token')
        }

        if(decode.role !== 'operator'){
            throw new Error ('Invalid Token')
        }

        const operator = await this.operatorRepository.findOperatorById(decode.id)

        if(!operator){
            throw new Error ('Operator Not Found')
        }

        const accessToken = generateAccessToken(operator.id , operator.role)

        return {accessToken}
    }

  

}