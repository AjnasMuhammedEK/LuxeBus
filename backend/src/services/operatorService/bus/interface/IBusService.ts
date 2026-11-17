import { ICreateBusDTO, IBus, ICreateBusFiles, IBusQueryParams, IBusListResponse, IResubmitBusFiles, IResubmitBusDTO } from "../../../../types/bus";

export interface IBusService {
  createBus(operatorId: string, data: ICreateBusDTO , files: ICreateBusFiles): Promise<IBus>;
  getBuses(operatorId : string , query : IBusQueryParams) : Promise <IBusListResponse>
  getDocumentSignedUrl(objectKey: string): Promise<string>;

  resubmitBus(
  operatorId: string,
  busId: string,
  data: IResubmitBusDTO,
  files: IResubmitBusFiles
): Promise<IBus>;
}
   