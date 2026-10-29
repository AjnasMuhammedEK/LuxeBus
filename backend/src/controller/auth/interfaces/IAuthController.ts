import { Request, Response, NextFunction } from "express";

export interface IAuthController {
  userReguister(req: Request, res: Response, next: NextFunction): Promise<void>;
  userLogin(req: Request, res: Response, next: NextFunction): Promise<void>;
  operatorRegister(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
  operatorLogin(req: Request, res: Response, next: NextFunction): Promise<void>;
  adminLogin(req: Request, res: Response, next: NextFunction): Promise<void>;
  userForgottPasswordEmailVerify(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
  userVerifyForgotPasswordOtp(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
  userResetPassword(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
  googleLogin(req: Request, res: Response, next: NextFunction): Promise<void>;
  adminRefreshToken(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
  operatorRefreshToken(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
  userRefreshToken(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
  staffRefreshToken(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
  userLogout(req: Request, res: Response, next: NextFunction): Promise<void>;
  operatorLogout(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
  adminLogout(req: Request, res: Response, next: NextFunction): Promise<void>;

  staffLogin(req: Request, res: Response, next: NextFunction): Promise<void>;
  staffLogout(req: Request, res: Response, next: NextFunction): Promise<void>;

  generateOperatorOtp(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
  verifyOperatorOtp(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;

  generateUserRegistrationOtp(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
  verifyUserRegistrationOtp(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
}
