import { inject, injectable } from "inversify";
import { TYPES } from "../../../DI/types";
import { IAdminRepository } from "../../../repositories/AdminRepository/interface/IAdminRepository";
import { IAdminService } from "../interface/IAdminService";
import { IOperator } from "../../../types/operator";
import { IStorageService } from "../../storage/interfaces/IStorageService";
import { operatorListMapping } from "../../../utils/mapping/operatorDto";
import {
  BusApprovalStatus,
  IAdminBusListResponse,
  IBus,
  IBusQueryParams,
} from "../../../types/bus";
import { IBusRepository } from "../../../repositories/Operator/bus/interfaces/IBusRepository";

@injectable()
export class AdminService implements IAdminService {
  constructor(
    @inject(TYPES.AdminRepository)
    private _adminRepository: IAdminRepository,

    @inject(TYPES.S3StorageService)
    private _storageService: IStorageService,

    @inject(TYPES.BusRepository)
    private _busRepository: IBusRepository,
  ) {}

  async getOperators(
    page: number,
    limit: number,
    search: string,
    sortBy: string,
    sortOrder: string,
  ) {
    const result = await this._adminRepository.getOperators(
      page,
      limit,
      search,
      sortBy,
      sortOrder,
    );

    const totalPages = Math.ceil(result.totalItems / limit);

    return {
      operators: operatorListMapping(result.operators),
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: result.totalItems,
        limit,
      },
    };
  }

  async updateOperatorStatus(
    operatorId: string,
    status: string,
    reason: string | null,
  ): Promise<IOperator> {
    const existOperator =
      await this._adminRepository.findOperatorById(operatorId);

    console.log("existing operator in service -  -  - ", existOperator);

    if (!existOperator) {
      throw new Error("Operator not found");
    }

    if (existOperator.status === "rejected") {
      throw new Error("Rejected operators cannot be changed");
    }

    const operator = await this._adminRepository.updateOperatorStatus(
      operatorId,
      status,
      reason,
    );

    if (!operator) {
      throw new Error("Operator notFound");
    }

    return operator;
  }

  async getDocumentSignedUrl(objectKey: string): Promise<string> {
    return await this._storageService.getSignedUrl(objectKey);
  }

  async updateOperatorBlock(
    operatorId: string,
    isBlocked: boolean,
  ): Promise<IOperator> {
    const operator = await this._adminRepository.updateOperatorBlock(
      operatorId,
      isBlocked,
    );

    if (!operator) {
      throw new Error("Operator not Found");
    }

    return operator;
  }

  async getAdminBuses(query: IBusQueryParams): Promise<IAdminBusListResponse> {
    return await this._busRepository.getAdminBuses(query);
  }

  async getBusDocumentSignedUrl(
    busId: string,
    docKey: "rc" | "fitnessCertificate" | "insurance",
  ): Promise<string> {
    const bus = await this._busRepository.findBusById(busId);

    if (!bus) {
      throw new Error("Bus not found");
    }

    const objectKey = bus.documents?.[docKey];

    if (!objectKey) {
      throw new Error("Bus document not found");
    }

    const response = await this._storageService.getSignedUrl(objectKey);
    return response;
  }

  async updateBusStatus(
    busId: string,
    approvalStatus: BusApprovalStatus,
    rejectReason?: string,
  ): Promise<IBus> {
    const bus = await this._busRepository.findBusById(busId);

    if (!bus) {
      throw new Error("Bus not found");
    }

    if (bus.approvalStatus !== "PENDING") {
      throw new Error("This bus has already been reviewed");
    }

    if (approvalStatus === "REJECTED") {
      if (!rejectReason || rejectReason.trim().length < 5) {
        throw new Error("Rejection reason must contain at least 5 characters");
      }
    }

    const updatedBus = await this._busRepository.updateBusStatus(
      busId,
      approvalStatus,
      approvalStatus === "REJECTED" ? rejectReason!.trim() : null,
    );

    if (!updatedBus) {
      throw new Error("Something went wrong while updateBusStatus");
    }

    return updatedBus;
  }

  async updateBusActiveStatus(busId: string, isActive: boolean) {
    const bus = await this._busRepository.findBusById(busId);

    if (!bus) {
      throw new Error("Bus not found");
    }

    if (bus.approvalStatus !== "APPROVED") {
      throw new Error("Only approved buses can be blocked or unblocked");
    }

     const updatedBus = await this._busRepository.updateBusActiveStatus(
      busId,
      isActive,
    );

    if (!updatedBus) {
      throw new Error("Something went wrong while updating bus status");
    }

    return updatedBus;
  }
}
