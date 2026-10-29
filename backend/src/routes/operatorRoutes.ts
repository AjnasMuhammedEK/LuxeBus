import { Router } from "express";
import { container } from "../DI/container";
import { StaffController } from "../controller/operator/staff/implimentation/StaffController";
import { TYPES } from "../DI/types";
import upload from "../middleware/multer";
import { authMiddleware } from "../middleware/authMiddleware";
import { OperatorController } from "../controller/operator/implementation/OperatorController";

const router = Router()


const staffController = container.get<StaffController>(TYPES.StaffController)

const operatorController = container.get<OperatorController>(TYPES.OperatorController);

router.post("/staffRegister",upload.fields([{ name: "idProof", maxCount: 1 },{ name: "commercialLicense", maxCount: 1 },]),authMiddleware,staffController.staffRegister);
router.get('/getStaffs',authMiddleware,staffController.getStaffs)
router.get('/document',authMiddleware,staffController.getDocumentSignedUrl)
router.patch('/editStaff/:staffId',authMiddleware,upload.fields([{name: "idProof",maxCount: 1},{name: "commercialLicense",maxCount: 1}]),staffController.editStaff)

router.patch("/resubmitOperator",authMiddleware,upload.fields([{name:'registrationCertificate' , maxCount:1},{name:"taxCertificate",maxCount:1},{name:"transportLicense",maxCount:1}]),operatorController.resubmitOperator);


export default router