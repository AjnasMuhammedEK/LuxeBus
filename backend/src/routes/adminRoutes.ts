import { Router } from "express";
import { container } from "../DI/container";
import { TYPES } from "../DI/types";
import { AdminController } from "../controller/admin/implementation/AdminController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

const adminController = container.get<AdminController>(TYPES.AdminController);

router.get("/getOperators", authMiddleware, adminController.getOperators);
router.patch(
  "/updateOperatorStatus/:operatorId",
  authMiddleware,
  adminController.updateOperatorStatus,
);
router.get("/document", authMiddleware, adminController.getDocumentSignedUrl);
router.patch(
  "/operators/:operatorId/block",
  authMiddleware,
  adminController.updateOperatorBlock,
);

router.get("/buses", authMiddleware, adminController.getAdminBuses);

router.get(
  "/buses/:busId/documents/:docKey",
  authMiddleware,
  adminController.getBusDocumentSignedUrl,
);

router.patch(
  "/buses/:busId/status",
  authMiddleware,
  adminController.updateBusStatus,
);

router.patch(
  "/buses/:busId/active-status",
  authMiddleware,
  adminController.updateBusActiveStatus,
);

export default router;
