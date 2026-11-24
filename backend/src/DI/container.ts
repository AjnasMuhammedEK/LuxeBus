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
import { IUserRepository } from "../repositories/userRepository/interface/IUserRepository";
import { UserRepository } from "../repositories/userRepository/implementation/UserRepository";
import { IUserService } from "../services/userService/interface/IUserService";
import { UserService } from "../services/userService/implementation/UserService";
import { IUserController } from "../controller/userController/interface/IUserController";
import { UserController } from "../controller/userController/implementation/UserController";
import { IRouteRepository } from "../repositories/route/interfaces/IRouteRepository";
import { RouteRepository } from "../repositories/route/implementation/RouteRepository";
import { IRouteService } from "../services/operatorService/route/interface/IRouteService";
import { RouteService } from "../services/operatorService/route/implementation/RouteService";
import { IRouteController } from "../controller/operator/Route/interface/IRouteController";
import { RouteController } from "../controller/operator/Route/implementation/RouteController";
import { ITripScheduleRepository } from "../repositories/tripSchedule/interfaces/ITripScheduleRepository";
import { TripScheduleRepository } from "../repositories/tripSchedule/implementation/TripScheduleRepository";
 
import { ITripScheduleService } from "../services/operatorService/tripSchedule/interfaces/ITripScheduleService";
import { TripScheduleService } from "../services/operatorService/tripSchedule/implementation/TripScheduleService";
 
import { ITripScheduleController } from "../controller/operator/tripSchedule/interfaces/ITripScheduleController";
import { TripScheduleController } from "../controller/operator/tripSchedule/implementation/TripScheduleController";
import { PassengerTripController } from "../controller/passengerTrip/implementation/PassengerTripController";
import { IPassengerTripController } from "../controller/passengerTrip/interfaces/IPassengerTripController";
import { PassengerTripService } from "../services/userService/passengerTrip/implementation/PassengerTripService";
import { IPassengerTripService } from "../services/userService/passengerTrip/interfaces/IPassengerTripService";
import { PassengerTripRepository } from "../repositories/passengerTrip/implementation/PassengerTripRepository";
import { IPassengerTripRepository } from "../repositories/passengerTrip/interfaces/IPassengerTripRepository";
import { ITripRepository } from "../repositories/trip/interfaces/ITripRepository";
import { TripRepository } from "../repositories/trip/implementation/TripRepository";
import { TripService } from "../services/operatorService/trip/implementation/TripService";
import { TripController } from "../controller/operator/trip/implementation/TripController";
import { ITripService } from "../services/operatorService/trip/interfaces/ITripService";

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

container
.bind<IUserRepository>(TYPES.UserRepository)
.to(UserRepository)

container
.bind<IUserService>(TYPES.UserService)
.to(UserService)

container
.bind<IUserController>(TYPES.UserController)
.to(UserController)

container
.bind<IRouteRepository>(TYPES.RouteRepository)
.to(RouteRepository)

container
.bind<IRouteService>(TYPES.RouteService)
.to(RouteService)

container
.bind<IRouteController>(TYPES.RouteController)
.to(RouteController)

container
  .bind<ITripScheduleRepository>(TYPES.TripScheduleRepository)
  .to(TripScheduleRepository);


 
container
  .bind<ITripScheduleService>(TYPES.TripScheduleService)
  .to(TripScheduleService);

 
container
.bind<ITripScheduleController>(TYPES.TripScheduleController)
.to(TripScheduleController)

container
  .bind<IPassengerTripRepository>(TYPES.PassengerTripRepository)
  .to(PassengerTripRepository);

container
  .bind<IPassengerTripService>(TYPES.PassengerTripService)
  .to(PassengerTripService);

container
  .bind<IPassengerTripController>(TYPES.PassengerTripController)
  .to(PassengerTripController);

  container.bind<ITripRepository>(TYPES.TripRepository).to(TripRepository);
container.bind<ITripService>(TYPES.TripService).to(TripService);
container.bind<TripController>(TYPES.TripController).to(TripController);