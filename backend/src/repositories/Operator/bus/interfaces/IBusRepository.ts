import type {
  BusApprovalStatus,
  IAdminBusListResponse,
  IBus,
  IBusListResponse,
  IBusQueryParams,
} from "../../../../types/bus";

export interface IBusRepository {
  findByRegistrationNumber(registrationNumber: string): Promise<IBus | null>;

  createBus(data: IBus): Promise<IBus>;

  getBuses(
    operatorId: string,
    query: IBusQueryParams,
  ): Promise<IBusListResponse>;
  getAdminBuses(query: IBusQueryParams): Promise<IAdminBusListResponse>;

  findBusById(busId: string): Promise<IBus | null>;

  updateBusStatus(
    busId: string,
    approvalStatus: BusApprovalStatus,
    rejectReason: string | null,
  ): Promise<IBus | null>;

  resubmitBus(
  busId: string,
  operatorId: string,
  data: Partial<IBus>
): Promise<IBus | null>;

}
