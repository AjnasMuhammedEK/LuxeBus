import {
  BusApprovalStatus,
  IAdminBusListResponse,
  IBus,
  IBusQueryParams,
} from "../../../types/bus";
import { IOperator } from "../../../types/operator";
import { IOperatorMappedData } from "../../../types/operator";

export interface IAdminService {
  getOperators(
    page: number,
    limit: number,
    search: string,
    sortBy: string,
    sortOrder: string,
  ): Promise<{
    operators: IOperatorMappedData[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      limit: number;
    };
  }>;
  updateOperatorStatus(
    operatorId: string,
    status: string,
    reason: string | null,
  ): Promise<IOperator>;
  getDocumentSignedUrl(objectKey: string): Promise<string>;
  updateOperatorBlock(
    operatorId: string,
    isBlocked: boolean,
  ): Promise<IOperator>;
  getAdminBuses(query: IBusQueryParams): Promise<IAdminBusListResponse>;

  getBusDocumentSignedUrl(
    busId: string,
    docKey: "rc" | "fitnessCertificate" | "insurance",
  ): Promise<string>;

  updateBusStatus(
    busId: string,
    approvalStatus: BusApprovalStatus,
    rejectReason?: string,
  ): Promise<IBus>;
  updateBusActiveStatus(busId: string, isActive: boolean): Promise<IBus>;
}
