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
import { IOperatorRepository } from "../repositories/Operator/interface/IOperatorRepository";
import { OperatorRepository } from "../repositories/Operator/implementation/OperatorRepository";
import { IOperatorService } from "../services/operatorService/interface/IOperatorService";
import { OperatorService } from "../services/operatorService/implementation/OperatorService";
import { IOperatorController } from "../controller/operator/interface/IOperatorController";
import { OperatorController } from "../controller/operator/implementation/OperatorController";

import { ISeatLayoutRepository } from "../repositories/seatLayout/interfaces/ISeatLayoutRepository";
import { SeatLayoutRepository } from "../repositories/seatLayout/implementation/SeatLayoutRepository";
import { ISeatLayoutService } from "../services/seatLayout/interface/ISeatLayoutService";
import { SeatLayoutService } from "../services/seatLayout/implementation/SeatLayoutService";
import { ISeatLayoutController } from "../controller/operator/seatLayout/interfaces/ISeatLayoutController";
import { SeatLayoutController } from "../controller/operator/seatLayout/implementation/SeatLayoutController";
import { IBusRepository } from "../repositories/Operator/bus/interfaces/IBusRepository";
import { BusRepository } from "../repositories/Operator/bus/implementation/BusRepository";
import { IBusService } from "../services/operatorService/bus/interface/IBusService";
import { BusService } from "../services/operatorService/bus/implementation/BusService";
import { IBusController } from "../controller/operator/Bus/interface/IBusController";
import { BusController } from "../controller/operator/Bus/implimentation/BusController";

export const container = new Container();

container
  .bind<IUserAuthRepository>(TYPES.UserAuthRepository)
  .to(UserAuthRepository);

container
  .bind<IOperatorAuthRepository>(TYPES.OperatorAuthRepository)
  .to(OperatorAuthRepository);

container.bind(TYPES.AuthService).to(AuthService);

container.bind(TYPES.AuthController).to(AuthController);

container.bind<IStorageService>(TYPES.S3StorageService).to(S3StorageService);

container.bind<IAdminRepository>(TYPES.AdminRepository).to(AdminRepository);

container.bind<IAdminService>(TYPES.AdminService).to(AdminService);

container.bind<IAdminController>(TYPES.AdminController).to(AdminController);

container.bind<IEmailService>(TYPES.EmailService).to(EmailService);

container.bind<IStaffRepository>(TYPES.StaffRepository).to(StaffRepository);

container.bind<IstaffService>(TYPES.StaffService).to(StaffService);

container.bind<IStaffController>(TYPES.StaffController).to(StaffController);

container
  .bind<IOperatorRepository>(TYPES.OperatorRepository)
  .to(OperatorRepository);

container.bind<IOperatorService>(TYPES.OperatorService).to(OperatorService);

container
  .bind<IOperatorController>(TYPES.OperatorController)
  .to(OperatorController);

container
  .bind<ISeatLayoutRepository>(TYPES.SeatLayoutRepository)
  .to(SeatLayoutRepository);

container
  .bind<ISeatLayoutService>(TYPES.SeatLayoutService)
  .to(SeatLayoutService);

container
  .bind<ISeatLayoutController>(TYPES.SeatLayoutController)
  .to(SeatLayoutController);

container.bind<IBusRepository>(TYPES.BusRepository).to(BusRepository);

container
.bind<IBusService>(TYPES.BusService)
.to(BusService)

container
.bind<IBusController>(TYPES.BusController)
.to(BusController)