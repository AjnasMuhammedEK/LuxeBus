import { Router } from "express";
import { container } from "../DI/container";
import { StaffController } from "../controller/operator/staff/implimentation/StaffController";
import { TYPES } from "../DI/types";
import upload from "../middleware/multer";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router()


const staffController = container.get<StaffController>(TYPES.StaffController)

router.post("/staffRegister",upload.fields([{ name: "idProof", maxCount: 1 },{ name: "commercialLicense", maxCount: 1 },]),authMiddleware,staffController.staffRegister);
router.get('/getStaffs',authMiddleware,staffController.getStaffs)
router.get('/document',authMiddleware,staffController.getDocumentSignedUrl)
router.patch('/editStaff/:staffId',authMiddleware,upload.fields([{name: "idProof",maxCount: 1},{name: "commercialLicense",maxCount: 1}]),staffController.editStaff)

export default router