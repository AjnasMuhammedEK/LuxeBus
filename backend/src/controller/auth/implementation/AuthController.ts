import { Request , Response , NextFunction } from "express";
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
            console.log(response);
            res.status(200).json(response)
            
        } catch (error) {
            console.log('ERROR in AuthCOntroller user Login :',error) 
            next(error);  
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
            console.log('--------------')
            const {email , password} = req.body
            console.log(req.body)
            const response = await this.authService.operatorLogin({email,password})
            res.status(200).json(response)
            
        } catch (error) {
            console.log('ERROR in AuthCOntroller operator Login :',error) 
            next(error); 
        }
    }

    adminLogin = async (req : Request , res : Response , next : NextFunction) => {
        try {
            const {email , password} = req.body 

            const response = await this.authService.AdminLogin({email , password})
            console.log(response);
            res.status(200).json(response)
            
        } catch (error) {
            console.log('ERROR in AuthCOntroller Admin Login :',error) 
            next(error);  
        }
    }

    userForgottPasswordEmailVerify = async(req: Request, res: Response, next: NextFunction)=>{
        try {
            const {email} = req.body

            const response = await this.authService.userForgotPasswordEmailVerify({email})
            res.status(200).json(response)
        } catch (error) {
            
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
    
}