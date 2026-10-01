import { Request , Response , NextFunction } from "express";
import { IAuthController } from "../interfaces/IAuthController";
import { IAuthService } from "../../../services/auth/interface/IAuthService";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../DI/types";
import { HttpStatus } from "../../../constants/httpStatusCodes";
import { createResponse } from "../../../helper/responseHelper";
 
@injectable()
export class AuthController implements IAuthController {
    
    constructor(@inject(TYPES.AuthService) private authService:IAuthService){}

    userReguister = async (req: Request, res: Response, next: NextFunction) => {
        try {
            
            const {name , email , phone , password} = req.body

            await this.authService.userRegister({
                name , 
                email,
                phone , 
                password
            })

 
      

            res.status(HttpStatus.CREATED).json(
                createResponse(
                    true,
                    'User Register Successfully',
                    null                    
                )

            )


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
                maxAge:5 * 60 * 1000
            })
            
            console.log(response);

            res.status(HttpStatus.OK).json(
                createResponse(
                    true , 'User Login Successfully' ,
                    {
                        user : response.user ,
                         accessToken : response.accessToken
                    }
                )
            )
          
            
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

         

            res.status(HttpStatus.OK).json(
                createResponse(
                    true,
                    'User Logout SuccessFully',
                    null
                )
            )
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

          

            res.status(HttpStatus.CREATED).json(
                createResponse(
                    true,
                    'Operator registration submitted successfully',
                    null
                )
            )
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
                maxAge:5 * 60 * 1000
            })
     
            res.status(HttpStatus.OK).json(
                createResponse(
                    true,
                    'Operator Login SuccessFully',
                    {
                        operator : response.operator,
                        accessToken : response.accessToken
                    }
                )
            )
            
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

        
            res.status(HttpStatus.OK).json(
                createResponse(
                    true,
                    'Operator Logout SuccessFully',
                    null
                )
            )

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
                maxAge:5 * 60 * 1000
            })
       

            res.status(HttpStatus.OK).json(
                createResponse(
                    true,
                    'Admin Login SuccessFully',
                    {
                        admin : response.admin,
                        accessToken : response.accessToken
                    }
                )
            )
            
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
            
        

            res.status(HttpStatus.OK).json(
                createResponse(
                    true,
                    'Admin Logout SuccessFully',
                    null
                )
            )

        } catch (error) {
            console.log('Error In admin Logout' , error)
            next(error)
        }

        
    }
    userForgottPasswordEmailVerify = async(req: Request, res: Response, next: NextFunction)=>{
        try {
            const {email} = req.body


            const response = await this.authService.userForgotPasswordEmailVerify({email})
            
            res.status(HttpStatus.OK).json(
                createResponse(
                    response.success,
                    response.message,
                    null
                )
            )
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
     
            res.status(HttpStatus.OK).json(
                createResponse(
                    response.success,
                    response.message,
                    null
                )
            )
        } catch (error) {
            console.log('ERROR in AuthCOntroller userVerifyForgotPasswordOtp :',error) 
            next(error)         
        }
    }

    userResetPassword = async  (req: Request, res: Response, next: NextFunction)=> {
        try {
            const {email , password} = req.body
            const response = await this.authService.userResetPassword({email,password})

            res.status(HttpStatus.CREATED).json(
                createResponse(
                    response.success,
                    response.message,
                    null
                )
            )
           
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

   


            res.cookie('refresh_token_user' , response.refreshToken , {
                httpOnly:true,
                secure:false,
                sameSite:'strict',
                maxAge:24*60*60*1000
            })

            res.status(HttpStatus.OK).json(
                createResponse(
                    true,
                    'Login Successfully',
                    {
                        user : response.user,
                        accessToken : response.accessToken
                    }
                )
            )
        } catch (error) {
            next(error);
        }
    }


    userRefreshToken = async (req: Request, res: Response, next: NextFunction) =>  {
        try {
            
            const refreshToken = req.cookies?.refresh_token_user

            if (!refreshToken) {
                res.status(HttpStatus.UNAUTHORIZED).json(
                    createResponse(
                        false,
                        'Refresh Token is not found',
                        null
                    )
                )
                return
            }

            const response = await this.authService.userRefreshToken(
                refreshToken
            )

    

            res.status(HttpStatus.OK).json(
                createResponse(
                    true,
                    '',
                    {
                        accessToken : response.accessToken
                    }
                )
            )
        } catch (error) {
            console.log("ERROR in AuthController refreshUserToken:",error);
            next(error);
           
        }
    }

    adminRefreshToken = async (req: Request, res: Response, next: NextFunction)=> {
        
        try {
            const refreshToken = req.cookies?.refresh_token_admin

            if (!refreshToken) {
                res.status(HttpStatus.UNAUTHORIZED).json(
                    createResponse(
                        false,
                        'Refresh Token is not found',
                        null
                    )
                )
                return
            }

            const response = await this.authService.adminRefreshToken(refreshToken)

            res.status(HttpStatus.OK).json(
                createResponse(
                    true,
                    '',
                    {
                        accessToken : response.accessToken
                    }
                )
            )          
        } catch (error) {
            console.log("ERROR in AuthController adminRefreshToken:",error);
            next(error);
        }

    }

    operatorRefreshToken = async (req: Request, res: Response, next: NextFunction) => {
        try {
            
            const refreshTokne = req.cookies?.refresh_Token_Operator

            if (!refreshTokne) {
                res.status(HttpStatus.UNAUTHORIZED).json(
                    createResponse(
                        false,
                        'Refresh Token is not found',
                        null
                    )
                )
                return
            }

            const response = await this.authService.operatorRefreshToken(refreshTokne)

            res.status(HttpStatus.OK).json(
                createResponse(
                    true,
                    '',
                    {
                        accessToken : response.accessToken
                    }
                )
            )

        } catch (error) {
            console.log("ERROR in AuthController operatorRefreshToken:",error);
            next(error);   
        }
    }
  
    
}