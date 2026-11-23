
import { Router } from "express";

import { container } from "../DI/container";
import { TYPES } from "../DI/types";

import { authMiddleware } from "../middleware/authMiddleware";

import { UserController } from "../controller/userController/implementation/UserController";

const router = Router();

const userController = container.get<UserController>(
  TYPES.UserController
);
 
router.get(
  "/profile",
  authMiddleware,
  userController.getProfile
);

router.patch(
  "/profile",
  authMiddleware,
  userController.updateProfile
);

 
router.patch(
  "/changePassword",
  authMiddleware,
  userController.changePassword
);

export default router;
