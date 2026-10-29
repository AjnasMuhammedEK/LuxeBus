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
router.patch('/userResetPassword',authController.userResetPassword)
router.post("/googleLogin",authController.googleLogin);
router.post('/refresh-token',authController.userRefreshToken)
router.post('/admin-refresh-token',authController.adminRefreshToken)
router.post('/operator-refresh-token',authController.operatorRefreshToken)
router.post('/userLogout',authController.userLogout)
router.post('/adminLogout',authController.adminLogout)
router.post('/operatorLogout',authController.operatorLogout)
router.post('/staffLogin',authController.staffLogin)
router.post('/staffLogout',authController.staffLogout)
router.post('/staff-refresh-token',authController.staffRefreshToken)
router.post('/generateOperatorOtp' , authController.generateOperatorOtp)
router.post('/verifyOperatorOtp',authController.verifyOperatorOtp)
router.post('/generateUserRegistrationOtp',authController.generateUserRegistrationOtp)
router.post('/verifyUserRegistrationOtp',authController.verifyUserRegistrationOtp)


export default router;