import e, { Request , Response , NextFunction } from "express";
import { IAuthController } from "../interfaces/IAuthController";
import { IAuthService } from "../../../services/auth/interface/IAuthService";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../DI/types";
 
@injectable()
export class AuthController implements IAuthController {
    
    constructor(@inject(TYPES.AuthService) private authService:IAuthService){}

    userReguister = async (req: Request, res: Response, next: NextFunction) => {
        try {
            
            const {name , email , phone , password} = req.body

            const response = await this.authService.userRegister({
                name , 
                email,
                phone , 
                password
            })

            res.status(201).json(response)
        } catch (error) {
            console.log('ERROR in AuthCOntroller user Resgitser :',error)    
            next(error);        
        }
    }

    userLogin = async (req : Request , res : Response , next : NextFunction) => {
        try {
            const {email , password} = req.body 

            const response = await this.authService.userLogin({email , password})
            
            
            res.cookie('refresh_token_user' , response.refreshToken , {
                httpOnly:true,
                secure:false,
                sameSite:'strict',
                maxAge:24*60*60*1000
            })
            
            console.log(response);
            res.status(200).json({
                success:response.success,
                message : response.message,
                user:response.user,
                accessToken : response.accessToken
            })
            
        } catch (error) {
            console.log('ERROR in AuthCOntroller user Login :',error) 
            next(error);  
        }
    }

    userLogout = async (req: Request, res: Response, next: NextFunction) => {
        try {
            res.clearCookie('refresh_token_user',{
                httpOnly:true,
                secure :false,
                sameSite:'strict'
                
            })

            res.status(200).json({
                success:true,
                message :'User Logout SuccessFully'
            })
        } catch (error) {
            console.log('Error In UserLogout' , error)
            next(error)
            
        }
    }

    operatorRegister = async(req: Request, res: Response, next: NextFunction)=> {
        try {
            const files = req.files as {
                [fieldname: string]: Express.Multer.File[];
            };

            await this.authService.operatorRegister(
                req.body,
                files
            );

            res.status(201).json({
                success: true,
                message: "Operator registration submitted successfully",
            });
        } catch (error) {
            next(error);
        }
    }
    
    operatorLogin = async (req: Request, res: Response, next: NextFunction)=>{
        try {
            // console.log('--------------')
            const {email , password} = req.body
            // console.log(req.body)
            const response = await this.authService.operatorLogin({email,password})

            res.cookie('refresh_Token_Operator',response.refreshToken,{
                httpOnly:true,
                secure:false,
                sameSite:'strict',
                maxAge:24*60*60*1000
            })
            res.status(200).json({
                success:true,
                message:response.message,
                operator:response.operator,
                accessToken:response.accessToken
            })
            
        } catch (error) {
            console.log('ERROR in AuthCOntroller operator Login :',error) 
            next(error); 
        }
    }

    operatorLogout = async (req: Request, res: Response, next: NextFunction)=> {
        try {


            // console.log('Called The ---------============')
            res.clearCookie('refresh_Token_Operator',{
                httpOnly:true,
                secure:false,
                sameSite:"strict"
            })

            // console.log('Called 2222222222222222222222 The ---------============')

            res.status(200).json({
                success:true,
                message:'Operator Logout SuccessFully'
            })            
        } catch (error) {
            console.log('Error In operatorLogout ' , error)
            next(error)          
        }
    }

    adminLogin = async (req : Request , res : Response , next : NextFunction) => {
        try {
            const {email , password} = req.body 

            const response = await this.authService.AdminLogin({email , password})
            // console.log(response);

            res.cookie('refresh_token_admin',response.refreshToken,{
                httpOnly:true,
                secure:false,
                sameSite:'strict',
                maxAge:24*60*60*1000
            })
            res.status(200).json({
                success:true,
                message : response.message,
                admin : response.admin,
                accessToken : response.accessToken
            })
            
        } catch (error) {
            console.log('ERROR in AuthCOntroller Admin Login :',error) 
            next(error);  
        }
    }

    adminLogout = async (req: Request, res: Response, next: NextFunction)=>{
        try {

            res.clearCookie('refresh_token_admin',{
                httpOnly:true,
                secure:false,
                sameSite:'strict'
            })   
            
            res.status(200).json({
                success:true,
                message : 'Admin logout successfully'
            })
        } catch (error) {
            console.log('Error In admin Logout' , error)
            next(error)
        }

        
    }
    userForgottPasswordEmailVerify = async(req: Request, res: Response, next: NextFunction)=>{
        try {
            const {email} = req.body


            const response = await this.authService.userForgotPasswordEmailVerify({email})
            res.status(200).json(response)
        } catch (error) {
            console.log('ERROR in AuthCOntroller userForgottPasswordEmailVerify :',error) 
            next(error)       
        }
    }

    userVerifyForgotPasswordOtp = async (req: Request, res: Response, next: NextFunction)=> {
        try {
            const {email , otp} = req.body
            console.log('emai ===',email , otp)
            const response = await this.authService.userVerifyForgotPasswordOtp({email,otp})
            console.log('Response from Auth controller')
            res.status(200).json(response)
        } catch (error) {
            console.log('ERROR in AuthCOntroller userVerifyForgotPasswordOtp :',error) 
            next(error)         
        }
    }

    userResetPassword = async  (req: Request, res: Response, next: NextFunction)=> {
        try {
            const {email , password} = req.body
            const response = await this.authService.userResetPassword({email,password})
            res.status(201).json(response)
        } catch (error) {
            console.log('ERROR in AuthCOntroller userResetPassword :',error) 
            next(error)               
        }
    }

    googleLogin = async(req: Request, res: Response, next: NextFunction) => {
        try {
            const {credential } = req.body
            const response = await this.authService.googleLogin({
                credential
            })

            res.status(200).json(response)
        } catch (error) {
            next(error);
        }
    }


    userRefreshToken = async (req: Request, res: Response, next: NextFunction) =>  {
        try {
            
            const refreshToken = req.cookies?.refresh_token_user

            if(!refreshToken){
                res.status(401).json({
                    success:false,
                    message : 'Refresh Token is not found'
                })

                return
            }

            const response = await this.authService.userRefreshToken(
                refreshToken
            )

            res.status(200).json({
                success:true,
                accessToken : response.accessToken

            })
        } catch (error) {
            console.log("ERROR in AuthController refreshUserToken:",error);
            next(error);
           
        }
    }

    adminRefreshToken = async (req: Request, res: Response, next: NextFunction)=> {
        
        try {
            const refreshToken = req.cookies?.refresh_token_admin

            if(!refreshToken){
                res.status(401).json({
                    success:false,
                    message : 'RefreshToken Not Found'
                })

                return
            }

            const response = await this.authService.adminRefreshToken(refreshToken)

            res.status(200).json({
                success:true, 
                accessToken : response.accessToken
            })            
        } catch (error) {
            console.log("ERROR in AuthController adminRefreshToken:",error);
            next(error);
        }

    }

    operatorRefreshToken = async (req: Request, res: Response, next: NextFunction) => {
        try {
            
            const refreshTokne = req.cookies?.refresh_Token_Operator

            if(!refreshTokne){
                res.status(401).json({
                    success:false,
                    message : 'Refresh TOken Not Found'
                })

                return
            }

            const response = await this.authService.operatorRefreshToken(refreshTokne)

            res.status(200).json({
                successs:true, 
                accessToken: response.accessToken
            })

        } catch (error) {
            console.log("ERROR in AuthController operatorRefreshToken:",error);
            next(error);   
        }
    }
  
    
}