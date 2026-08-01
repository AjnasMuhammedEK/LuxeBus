import { Router } from "express";
import { container } from "../DI/container";
import {TYPES} from '../DI/types'
import { AuthController } from "../controller/auth/implementation/AuthController";
import upload from "../middleware/multer";

const router = Router()

const authController = container.get<AuthController>(
    TYPES.AuthController
)

router.post('/register',authController.userReguister)
router.post('/login',authController.userLogin)
router.post('/operatorRegister',upload.fields([{name:'registrationCertificate' , maxCount:1},{name:"taxCertificate",maxCount:1},{name:"transportLicense",maxCount:1}]),authController.operatorRegister)
router.post('/operatorLogin',authController.operatorLogin)
router.post('/adminLogin',authController.adminLogin)
router.post('/userForgotPasswordEmailVerify',authController.userForgottPasswordEmailVerify)
router.post('/userVerifyForgotPasswordOtp',authController.userVerifyForgotPasswordOtp)
router.post("/googleLogin",authController.googleLogin);
 
export default router;