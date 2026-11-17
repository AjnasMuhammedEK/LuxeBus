import { Router } from "express";
import { container } from "../DI/container";
import { StaffController } from "../controller/operator/staff/implimentation/StaffController";
import { TYPES } from "../DI/types";
import upload from "../middleware/multer";
import { authMiddleware } from "../middleware/authMiddleware";
import { OperatorController } from "../controller/operator/implementation/OperatorController";
import { SeatLayoutController } from "../controller/operator/seatLayout/implementation/SeatLayoutController";
import { BusController } from "../controller/operator/Bus/implimentation/BusController";

const router = Router();

const staffController = container.get<StaffController>(TYPES.StaffController);

const operatorController = container.get<OperatorController>(
  TYPES.OperatorController,
);

const seatLayoutController = container.get<SeatLayoutController>(
  TYPES.SeatLayoutController,
);

const busController = container.get<BusController>(TYPES.BusController);

router.post(
  "/staffRegister",
  upload.fields([
    { name: "idProof", maxCount: 1 },
    { name: "commercialLicense", maxCount: 1 },
  ]),
  authMiddleware,
  staffController.staffRegister,
);
router.get("/getStaffs", authMiddleware, staffController.getStaffs);
router.get("/document", authMiddleware, staffController.getDocumentSignedUrl);
router.patch(
  "/editStaff/:staffId",
  authMiddleware,
  upload.fields([
    { name: "idProof", maxCount: 1 },
    { name: "commercialLicense", maxCount: 1 },
  ]),
  staffController.editStaff,
);

router.patch(
  "/resubmitOperator",
  authMiddleware,
  upload.fields([
    { name: "registrationCertificate", maxCount: 1 },
    { name: "taxCertificate", maxCount: 1 },
    { name: "transportLicense", maxCount: 1 },
  ]),
  operatorController.resubmitOperator,
);

// seatLAyouts

router.get(
  "/seatLayouts",
  authMiddleware,
  seatLayoutController.getActiveLayouts,
);
router.get(
  "/seatLayoutsId/:id",
  authMiddleware,
  seatLayoutController.getLayoutById,
);

//Bus Routes

router.post(
  "/createBus",
  authMiddleware,
  upload.fields([
    { name: "rc", maxCount: 1 },
    { name: "fitnessCertificate", maxCount: 1 },
    { name: "insurance", maxCount: 1 },
  ]),
  busController.createBus,
);

router.get("/getBuses", authMiddleware, busController.getBuses);
router.get("/busDocument", authMiddleware, busController.getDocumentSignedUrl);
router.patch(
  "/resubmitBus/:busId",
  authMiddleware,
  upload.fields([
    { name: "rc", maxCount: 1 },
    { name: "fitnessCertificate", maxCount: 1 },
    { name: "insurance", maxCount: 1 },
  ]),
  busController.resubmitBus,
);

export default router;
