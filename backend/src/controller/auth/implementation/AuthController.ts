import { Request, Response, NextFunction } from "express";
import { IAuthController } from "../interfaces/IAuthController";
import { IAuthService } from "../../../services/auth/interface/IAuthService";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../DI/types";
import { HttpStatus } from "../../../constants/httpStatusCodes";
import { createResponse } from "../../../helper/responseHelper";
import { ResponseMessages } from "../../../constants/responseMessages";
import logger from "../../../config/logger";

@injectable()
export class AuthController implements IAuthController {
  constructor(@inject(TYPES.AuthService) private _authService: IAuthService) {}

  userReguister = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, phone, password } = req.body;

      await this._authService.userRegister({
        name,
        email,
        phone,
        password,
      });

      res
        .status(HttpStatus.CREATED)
        .json(
          createResponse(true, ResponseMessages.USER_REGISTER_SUCCESS, null),
        );
    } catch (error) {
        logger.error("ERROR in AuthCOntroller user Resgitser :", error)
       
      next(error);
    }
  };

  userLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {
    //   const { email, password } = req.body;

    const email = 'ajnas54321@gmail.com'
    const password = '12342123'

      const response = await this._authService.userLogin({ email, password });

      res.cookie("refresh_token_user", response.refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 30 * 60 * 1000,
      });

      

      res.status(HttpStatus.OK).json(
        createResponse(true, ResponseMessages.USER_LOGIN_SUCCESS, {
          user: response.user,
          accessToken: response.accessToken,
        }),
      );
    } catch (error) {
      logger.error("ERROR in AuthCOntroller user Login :", error);
      next(error);
    }
  };

  userLogout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.clearCookie("refresh_token_user", {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
      });

      res
        .status(HttpStatus.OK)
        .json(createResponse(true, ResponseMessages.USER_LOGOUT_SUCCESS, null));
    } catch (error) {
      logger.error("Error In UserLogout", error);
      next(error);
    }
  };

  operatorRegister = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const files = req.files as {
        [fieldname: string]: Express.Multer.File[];
      };

      await this._authService.operatorRegister(req.body, files);

      res
        .status(HttpStatus.CREATED)
        .json(
          createResponse(
            true,
            ResponseMessages.OPERATOR_REGISTER_SUCCESS,
            null,
          ),
        );
    } catch (error) {
      next(error);
    }
  };

  operatorLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;

      const response = await this._authService.operatorLogin({
        email,
        password,
      });

      res.cookie("refresh_Token_Operator", response.refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 30 * 60 * 1000,
      });

      res.status(HttpStatus.OK).json(
        createResponse(true, ResponseMessages.OPERATOR_LOGIN_SUCCESS, {
          operator: response.operator,
          accessToken: response.accessToken,
        }),
      );
    } catch (error) {
      logger.error("ERROR in AuthCOntroller operator Login :", error);
      
      next(error);
    }
  };

  generateOperatorOtp = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      // console.log('generateOperatorOtp controller called')

      const { email } = req.body;

      // console.log(email)

      const response = await this._authService.genrateOperatorOtp({ email });

      // console.log('Auth controller response = = = ',response)

      res
        .status(HttpStatus.OK)
        .json(createResponse(true, "Operator Otp sented to mail", null));
    } catch (error) {
      logger.error("Error in Genratr Otp Controller", error);
      next(error);
    }
  };

  verifyOperatorOtp = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { email, otp } = req.body;

      console.log(
        "email , otp : from auth Controller verifyOperatorOtp",
        email,
        otp,
      );

      if (!email || !otp) {
        throw new Error("Email or OTP is not Available");
      }

      const response = await this._authService.verifyOperatorOtp({
        email,
        otp,
      });

      res
        .status(HttpStatus.OK)
        .json(createResponse(true, "OTP Verified Successfully", ""));
    } catch (error) {
      logger.error("Error In verifyOperatorOtp ", error);
      next(error);
    }
  };

  operatorLogout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.clearCookie("refresh_Token_Operator", {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
      });

      res
        .status(HttpStatus.OK)
        .json(
          createResponse(true, ResponseMessages.OPERATOR_LOGOUT_SUCCESS, null),
        );
    } catch (error) {
      logger.error("Error In operatorLogout ", error);
      next(error);
    }
  };

  adminLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;

      const response = await this._authService.AdminLogin({ email, password });

      res.cookie("refresh_token_admin", response.refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 30 * 60 * 1000,
      });

      res.status(HttpStatus.OK).json(
        createResponse(true, ResponseMessages.ADMIN_LOGIN_SUCCESS, {
          admin: response.admin,
          accessToken: response.accessToken,
        }),
      );
    } catch (error) {
      logger.error("ERROR in AuthCOntroller Admin Login :", error);
      next(error);
    }
  };

  adminLogout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.clearCookie("refresh_token_admin", {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
      });

      res
        .status(HttpStatus.OK)
        .json(
          createResponse(true, ResponseMessages.ADMIN_LOGOUT_SUCCESS, null),
        );
    } catch (error) {
      console.log("Error In admin Logout", error);
      next(error);
    }
  };

  userForgottPasswordEmailVerify = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { email } = req.body;

      const response = await this._authService.userForgotPasswordEmailVerify({
        email,
      });

      res
        .status(HttpStatus.OK)
        .json(createResponse(response.success, response.message, null));
    } catch (error) {
      console.log(
        "ERROR in AuthCOntroller userForgottPasswordEmailVerify :",
        error,
      );
      next(error);
    }
  };

  userVerifyForgotPasswordOtp = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { email, otp } = req.body;
      console.log("emai ===", email, otp);
      const response = await this._authService.userVerifyForgotPasswordOtp({
        email,
        otp,
      });
      console.log("Response from Auth controller");

      res
        .status(HttpStatus.OK)
        .json(createResponse(response.success, response.message, null));
    } catch (error) {
      logger.error(
        "ERROR in AuthCOntroller userVerifyForgotPasswordOtp :",
        error,
      );
      next(error);
    }
  };

  userResetPassword = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { email, password } = req.body;
      const response = await this._authService.userResetPassword({
        email,
        password,
      });

      res
        .status(HttpStatus.CREATED)
        .json(createResponse(response.success, response.message, null));
    } catch (error) {
      console.log("ERROR in AuthCOntroller userResetPassword :", error);
      next(error);
    }
  };

  googleLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { credential } = req.body;
      const response = await this._authService.googleLogin({
        credential,
      });

      res.cookie("refresh_token_user", response.refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 30 * 60 * 1000,
      });

      res.status(HttpStatus.OK).json(
        createResponse(true, ResponseMessages.USER_LOGIN_SUCCESS, {
          user: response.user,
          accessToken: response.accessToken,
        }),
      );
    } catch (error) {
      next(error);
    }
  };

  userRefreshToken = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const refreshToken = req.cookies?.refresh_token_user;

      if (!refreshToken) {
        res
          .status(HttpStatus.UNAUTHORIZED)
          .json(
            createResponse(
              false,
              ResponseMessages.REFRESH_TOKEN_NOT_FOUND,
              null,
            ),
          );
        return;
      }

      const response = await this._authService.userRefreshToken(refreshToken);

      res.status(HttpStatus.OK).json(
        createResponse(true, "", {
          accessToken: response.accessToken,
        }),
      );
    } catch (error) {
      console.log("ERROR in AuthController refreshUserToken:", error);
      next(error);
    }
  };

  adminRefreshToken = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const refreshToken = req.cookies?.refresh_token_admin;

      if (!refreshToken) {
        res
          .status(HttpStatus.UNAUTHORIZED)
          .json(
            createResponse(
              false,
              ResponseMessages.REFRESH_TOKEN_NOT_FOUND,
              null,
            ),
          );
        return;
      }

      const response = await this._authService.adminRefreshToken(refreshToken);

      res.status(HttpStatus.OK).json(
        createResponse(true, "", {
          accessToken: response.accessToken,
        }),
      );
    } catch (error) {
      console.log("ERROR in AuthController adminRefreshToken:", error);
      next(error);
    }
  };

  operatorRefreshToken = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const refreshTokne = req.cookies?.refresh_Token_Operator;

      if (!refreshTokne) {
        res
          .status(HttpStatus.UNAUTHORIZED)
          .json(
            createResponse(
              false,
              ResponseMessages.REFRESH_TOKEN_NOT_FOUND,
              null,
            ),
          );
        return;
      }

      const response =
        await this._authService.operatorRefreshToken(refreshTokne);

      res.status(HttpStatus.OK).json(
        createResponse(true, "", {
          accessToken: response.accessToken,
        }),
      );
    } catch (error) {
      console.log("ERROR in AuthController operatorRefreshToken:", error);
      next(error);
    }
  };

  staffRefreshToken = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const refreshToken = req.cookies?.refresh_token_staff;

      if (!refreshToken) {
        res
          .status(HttpStatus.UNAUTHORIZED)
          .json(
            createResponse(
              false,
              ResponseMessages.REFRESH_TOKEN_NOT_FOUND,
              null,
            ),
          );
        return;
      }

      const response = await this._authService.staffRefreshToken(refreshToken);

      res.status(HttpStatus.OK).json(
        createResponse(true, "", {
          accessToken: response.accessToken,
        }),
      );
    } catch (error) {
      console.log("ERROR in AuthController staffRefreshToken:", error);
      next(error);
    }
  };

  staffLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;

      const response = await this._authService.staffLogin({ email, password });

      res.cookie("refresh_token_staff", response.refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 30 * 60 * 1000,
      });

      res.status(HttpStatus.OK).json(
        createResponse(true, "Staff Login Successfull", {
          accessToken: response.accessToken,
          staff: response.staff,
        }),
      );
    } catch (error) {
      console.log("ERROR in AuthController Staff Login:", error);
      next(error);
    }
  };

  staffLogout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.clearCookie("refresh_token_staff", {
        httpOnly: true,
        sameSite: "strict",
        secure: false,
      });

      res
        .status(HttpStatus.OK)
        .json(
          createResponse(true, ResponseMessages.STAFF_LOGOUT_SUCCESS, null),
        );
    } catch (error) {
      console.log("ERROR in AuthController Staff Logout:", error);
      next(error);
    }
  };

  generateUserRegistrationOtp = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { email } = req.body;

      if (!email) {
        throw new Error("Email Not Found");
      }

      const response = await this._authService.generateUserRegistrationOtp({
        email,
      });

      res
        .status(HttpStatus.OK)
        .json(createResponse(true, response.message, null));
    } catch (error) {
      console.log("Error in generateUserRegistrationOtp controller", error);
      next(error);
    }
  };

  verifyUserRegistrationOtp = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { email, otp } = req.body;

      if (!email && !otp) {
        throw new Error("Email & Otp not available");
      }

      await this._authService.verifyUserRegistrationOtp({ email, otp });

      res
        .status(HttpStatus.OK)
        .json(createResponse(true, "OTP Verified Successfully", null));
    } catch (error) {
      console.log("Error in verifyUserRegistrationOtp controller", error);
      next(error);
    }
  };
}
