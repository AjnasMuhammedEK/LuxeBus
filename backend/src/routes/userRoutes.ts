import { Router } from "express";
import { container } from "../DI/container";
import { TYPES } from "../DI/types";
import { authMiddleware } from "../middleware/authMiddleware";
import { UserController } from "../controller/userController/implementation/UserController";
import { PassengerTripController } from "../controller/passengerTrip/implementation/PassengerTripController";

const router = Router();

const userController = container.get<UserController>(TYPES.UserController);

const passengerTripController =
  container.get<PassengerTripController>(TYPES.PassengerTripController);

router.get("/trips/search", passengerTripController.searchTrips);
router.get("/trips", passengerTripController.getUpcomingTrips);

router.get("/profile", authMiddleware, userController.getProfile);
router.patch("/profile", authMiddleware, userController.updateProfile);
router.patch("/changePassword", authMiddleware, userController.changePassword);

export default router;