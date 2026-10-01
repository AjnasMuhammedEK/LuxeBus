import { Router } from "express";
import { container } from "../DI/container";
import { TYPES } from "../DI/types";
import { AdminController } from "../controller/admin/implementation/AdminController";
import {authMiddleware} from "../middleware/authMiddleware";


 
 
const router = Router();

const adminController = container.get<AdminController>(
    TYPES.AdminController
);

router.get("/getOperators",authMiddleware,adminController.getOperators);
router.patch("/updateOperatorStatus/:operatorId",authMiddleware,adminController.updateOperatorStatus);
router.get('/document',authMiddleware,adminController.getDocumentSignedUrl)
router.patch("/operators/:operatorId/block",authMiddleware,adminController.updateOperatorBlock);

export default router;