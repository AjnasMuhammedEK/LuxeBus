import {Request,Response,NextFunction} from "express";
import "../types/express";
import { verifyAccessToken } from "../utils/jwt";


export const authMiddleware = (req:Request,res:Response,next:NextFunction)=>{
    try {
         
        const authHeader = req.headers.authorization;


        // console.log('Auth headers from middle ware ' , authHeader)

        if(!authHeader || !authHeader.startsWith('Bearer ')){
            return res.status(401).json({
                success : false ,
                message : 'Access token not provided'
            })
        }

        const token = authHeader.split(' ')[1]

        if(!token){
            return res.status(401).json({
                success:false,
                message : 'access Token not Provided ',
            })
        }

        const decoded = verifyAccessToken(token)

        if(!decoded){
            return res.status(401).json({
                success : false,
                message : 'Invalid access token'
            })
        }

        req.user = decoded

        next()
 
    } catch(error){
        console.error(error);
        return res.status(401).json({
            message:"Invalid token"
        });
    }
}