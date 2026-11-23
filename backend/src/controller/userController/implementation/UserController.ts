
import { inject, injectable } from "inversify";
import { Request, Response, NextFunction } from "express";

import { IUserController } from "../interface/IUserController";
import { TYPES } from "../../../DI/types";

import { IUserService } from "../../../services/userService/interface/IUserService";

import { HttpStatus } from "../../../constants/httpStatusCodes";
import { createResponse } from "../../../helper/responseHelper";

@injectable()
export class UserController implements IUserController {
  constructor(
    @inject(TYPES.UserService)
    private _userService: IUserService
  ) {}

   
  getProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        res.status(HttpStatus.UNAUTHORIZED).json(
          createResponse(
            false,
            "Unauthorized: User ID not found",
            null
          )
        );
        return;
      }

      const user = await this._userService.getProfile(userId);

      res.status(HttpStatus.OK).json(
        createResponse(
          true,
          "User Profile Fetched Successfully",
          user
        )
      );
    } catch (error) {
      next(error);
    }
  };


  updateProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        res.status(HttpStatus.UNAUTHORIZED).json(
          createResponse(
            false,
            "Unauthorized: User ID not found",
            null
          )
        );
        return;
      }

      const { name, phone } = req.body;

      if (
        typeof name !== "string" ||
        !name.trim() ||
        typeof phone !== "string"
      ) {
        res.status(HttpStatus.BAD_REQUEST).json(
          createResponse(
            false,
            "Valid name and phone are required",
            null
          )
        );
        return;
      }

      const updatedUser = await this._userService.updateProfile(
        userId,
        {
          name: name.trim(),
          phone: phone.trim(),
        }
      );

      res.status(HttpStatus.OK).json(
        createResponse(
          true,
          "User Profile Updated Successfully",
          updatedUser
        )
      );
    } catch (error) {
      next(error);
    }
  };
 
  changePassword = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        res.status(HttpStatus.UNAUTHORIZED).json(
          createResponse(
            false,
            "Unauthorized: User ID not found",
            null
          )
        );
        return;
      }

      const { currentPassword, newPassword } = req.body;

      if (
        typeof currentPassword !== "string" ||
        typeof newPassword !== "string" ||
        !currentPassword ||
        !newPassword
      ) {
        res.status(HttpStatus.BAD_REQUEST).json(
          createResponse(
            false,
            "Current password and new password are required",
            null
          )
        );
        return;
      }

      if (newPassword.length < 8) {
        res.status(HttpStatus.BAD_REQUEST).json(
          createResponse(
            false,
            "New password must contain at least 8 characters",
            null
          )
        );
        return;
      }

      await this._userService.changePassword(
        userId,
        currentPassword,
        newPassword
      );

      res.status(HttpStatus.OK).json(
        createResponse(
          true,
          "Password Changed Successfully",
          null
        )
      );
    } catch (error) {
      next(error);
    }
  };
}
