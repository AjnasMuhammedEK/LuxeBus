import { Container } from "inversify";

import { TYPES } from "./types";

import { UserAuthRepository } from "../repositories/auth/userAuth/implementation/UserAuthRepository"; 
import { OperatorAuthRepository } from "../repositories/auth/operatorAuth/implementation/OperatorAuthRepository"; 

import { IUserAuthRepository } from "../repositories/auth/userAuth/interfaces/IUserAuthRepository"; 
import { IOperatorAuthRepository } from "../repositories/auth/operatorAuth/interfaces/IOperatorAuthRepository"; 

import { AuthService } from "../services/auth/implementation/authService";
import { AuthController } from "../controller/auth/implementation/AuthController";
import { IStorageService } from "../services/storage/interfaces/IStorageService";
import { S3StorageService } from "../services/storage/implementation/S3StorageService";
import { IAdminController } from "../controller/admin/interfaces/IAdminController";
import { IAdminService } from "../services/AdminServices/interface/IAdminService";
import { IAdminRepository } from "../repositories/AdminRepository/interface/IAdminRepository";
import { AdminRepository } from "../repositories/AdminRepository/implementation/AdminRepository";
import { AdminService } from "../services/AdminServices/implementation/AdminService";
import { AdminController } from "../controller/admin/implementation/AdminController";
import { IEmailService } from "../services/email/interface/IEmailService";
import { EmailService } from "../services/email/implementation/EmailService";
import { IstaffService } from "../services/operatorService/staff/interface/IstaffService";
import { IStaffRepository } from "../repositories/syaffRepository/interface/IStaffRepository";
import { StaffRepository } from "../repositories/syaffRepository/implimentation/staffRepository";
import { StaffService } from "../services/operatorService/staff/implimentation/staffService";
import { IStaffController } from "../controller/operator/staff/interface/IStaffController";
import { StaffController } from "../controller/operator/staff/implimentation/StaffController";

export const container = new Container();

container
    .bind<IUserAuthRepository>(TYPES.UserAuthRepository)
    .to(UserAuthRepository);

container
    .bind<IOperatorAuthRepository>(TYPES.OperatorAuthRepository)
    .to(OperatorAuthRepository);

container
.bind(TYPES.AuthService)
.to(AuthService);

container
.bind(TYPES.AuthController)
.to(AuthController);

container
.bind<IStorageService>(TYPES.S3StorageService)
.to(S3StorageService);

container
.bind<IAdminRepository>(TYPES.AdminRepository)
.to(AdminRepository);

container
.bind<IAdminService>(TYPES.AdminService)
.to(AdminService);

container
.bind<IAdminController>(TYPES.AdminController)
.to(AdminController);

container
.bind<IEmailService>(TYPES.EmailService)
.to(EmailService)


container
.bind<IStaffRepository>(TYPES.StaffRepository)
.to(StaffRepository)

container
    .bind<IstaffService>(TYPES.StaffService)
    .to(StaffService);

container
.bind<IStaffController>(TYPES.StaffController)
.to(StaffController)


 