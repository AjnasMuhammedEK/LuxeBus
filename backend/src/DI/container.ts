import { Container } from "inversify";

import { TYPES } from "./types";

import { AuthRepository } from "../repositories/auth/implementation/AuthRepository";
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

export const container = new Container();

container
.bind(TYPES.AuthRepository)
.to(AuthRepository);

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