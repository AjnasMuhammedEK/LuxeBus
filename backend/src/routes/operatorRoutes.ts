import { Router } from "express";
import { container } from "../DI/container";
import { StaffController } from "../controller/operator/staff/implimentation/StaffController";
import { TYPES } from "../DI/types";
import upload from "../middleware/multer";
import { authMiddleware } from "../middleware/authMiddleware";
import { OperatorController } from "../controller/operator/implementation/OperatorController";
import { SeatLayoutController } from "../controller/operator/seatLayout/implementation/SeatLayoutController";
import { BusController } from "../controller/operator/Bus/implimentation/BusController";
import { RouteController } from "../controller/operator/Route/implementation/RouteController";
 
import { TripScheduleController } from "../controller/operator/tripSchedule/implementation/TripScheduleController";

const router = Router();

const staffController = container.get<StaffController>(TYPES.StaffController);

const operatorController = container.get<OperatorController>(
  TYPES.OperatorController,
);

const seatLayoutController = container.get<SeatLayoutController>(
  TYPES.SeatLayoutController,
);

const busController = container.get<BusController>(TYPES.BusController);

const routeController = container.get<RouteController>(TYPES.RouteController);
 
const tripScheduleController = container.get<TripScheduleController>(TYPES.TripScheduleController)
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
router.delete(
  "/deleteBus/:busId",
  authMiddleware,
  busController.deleteBus,
);


 
router.post(
  "/createRoute",
  authMiddleware,
  routeController.createRoute,
);

 
router.get(
  "/getRoutes",
  authMiddleware,
  routeController.getRoutes,
);

 
router.get(
  "/getRoute/:routeId",
  authMiddleware,
  routeController.getRouteById,
);

 
router.patch(
  "/updateRoute/:routeId",
  authMiddleware,
  routeController.updateRoute,
);

 
router.delete(
  "/deleteRoute/:routeId",
  authMiddleware,
  routeController.deleteRoute,
);

 
router.patch(
  "/updateRouteStatus/:routeId",
  authMiddleware,
  routeController.updateRouteStatus,
);

 
 

router.post(
  "/trip-schedules",
  authMiddleware,
  tripScheduleController.createSchedule
);

router.get(
  "/trip-schedules",
  authMiddleware,
  tripScheduleController.getSchedules
);

router.get(
  "/trip-schedules/:scheduleId",
  authMiddleware,
  tripScheduleController.getScheduleById
);

router.patch(
  "/trip-schedules/:scheduleId",
  authMiddleware,
  tripScheduleController.updateSchedule
);

router.delete(
  "/trip-schedules/:scheduleId",
  authMiddleware,
  tripScheduleController.deleteSchedule
);


export default router;
