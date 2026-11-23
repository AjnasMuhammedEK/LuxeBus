import { inject, injectable } from "inversify";
import { IBusService } from "../interface/IBusService";
import { TYPES } from "../../../../DI/types";
import { IBusRepository } from "../../../../repositories/Operator/bus/interfaces/IBusRepository";
import { ISeatLayoutRepository } from "../../../../repositories/seatLayout/interfaces/ISeatLayoutRepository";
import {
  ICreateBusDTO,
  IBus,
  ICreateBusFiles,
  IBusListResponse,
  IBusQueryParams,
  IResubmitBusDTO,
  IResubmitBusFiles,
} from "../../../../types/bus";
import { Types } from "mongoose";
import { IOperatorRepository } from "../../../../repositories/Operator/interface/IOperatorRepository";
import { IStorageService } from "../../../storage/interfaces/IStorageService";

@injectable()
export class BusService implements IBusService {
  constructor(
    @inject(TYPES.BusRepository) private _busRepository: IBusRepository,

    @inject(TYPES.SeatLayoutRepository)
    private _seatLayoutRepository: ISeatLayoutRepository,

    @inject(TYPES.OperatorRepository)
    private _operatorRepository: IOperatorRepository,

    @inject(TYPES.S3StorageService) private _storageService: IStorageService,
  ) {}

  async createBus(
    operatorId: string,
    data: ICreateBusDTO,
    files: ICreateBusFiles,
  ): Promise<IBus> {
    const operator =
      await this._operatorRepository.findOperatorById(operatorId);

    if (!operator) {
      throw new Error("Operator Not Exist");
    }

    if (operator.isBlocked) {
      throw new Error("Operator is blocked");
    }

    const busSeatLayout = await this._seatLayoutRepository.findLayoutById(
      data.seatLayoutId,
    );

    if (!busSeatLayout) {
      throw new Error("Bus Seat Layout not exist");
    }

    const registrationNumber = data.registrationNumber.toUpperCase();

    const busExist =
      await this._busRepository.findByRegistrationNumber(registrationNumber);

    if (busExist) {
      throw new Error("Bus Already Registered");
    }

    const seatLayoutSnapshot = {
      name: busSeatLayout.name,
      slug: busSeatLayout.slug,
      busType: busSeatLayout.busType,
      totalCapacity: busSeatLayout.totalCapacity,
      decks: busSeatLayout.decks,
      seats: busSeatLayout.seats,
      elements: busSeatLayout.elements,
    };
 
    const rc = await this._storageService.uploadFile(files.rc, "operatorBus");
    const fitnessCertificate = await this._storageService.uploadFile(
      files.fitnessCertificate,
      "operatorBus",
    );
    const insurance = await this._storageService.uploadFile(
      files.insurance,
      "operatorBus",
    );

    const allDoc = {
      rc,
      fitnessCertificate,
      insurance,
    };

    const createBusData: IBus = {
      operatorId: new Types.ObjectId(operatorId),
      amenities: data.amenities,
      approvalStatus: "PENDING",
      busType: busSeatLayout.busType,
      documents: allDoc,
      isActive: true,
      isDeleted:false,
      manufacturer: data.manufacturer,
      manufacturingYear: data.manufacturingYear,
      model: data.model,
      registrationNumber: registrationNumber,
      seatLayoutId: new Types.ObjectId(data.seatLayoutId),
      seatLayoutSnapshot: seatLayoutSnapshot,
      rejectReason: null,
    };

    const newBus = await this._busRepository.createBus(createBusData);

    return newBus;
  }

  async getBuses(
    operatorId: string,
    query: IBusQueryParams,
  ): Promise<IBusListResponse> {
    const response = await this._busRepository.getBuses(operatorId, query);

    return response;
  }

  async getDocumentSignedUrl(objectKey: string): Promise<string> {
    return await this._storageService.getSignedUrl(objectKey);
  }

  async resubmitBus(
    operatorId: string,
    busId: string,
    data: IResubmitBusDTO,
    files: IResubmitBusFiles,
  ): Promise<IBus> {
    
    const operator =
      await this._operatorRepository.findOperatorById(operatorId);

    if (!operator) {
      throw new Error("Operator not found");
    }

     
    const existingBus = await this._busRepository.findBusById(busId);

    if (!existingBus) {
      throw new Error("Bus not found");
    }

    if (existingBus.operatorId.toString() !== operatorId) {
      throw new Error("You are not authorized to update this bus");
    }

    const registrationNumber = data.registrationNumber.trim().toUpperCase();

    const duplicateBus =
      await this._busRepository.findByRegistrationNumber(registrationNumber);

    if (duplicateBus?.registrationNumber !== data.registrationNumber) {
      throw new Error("This registration number is already used");
    }

    const seatLayout = await this._seatLayoutRepository.findLayoutById(
      data.seatLayoutId,
    );

    if (!seatLayout || !seatLayout.isActive) {
      throw new Error("Selected seat layout is unavailable");
    }

    const documents = {
      ...existingBus.documents,
    };

    if (files.rc) {
      documents.rc = await this._storageService.uploadFile(
        files.rc,
        "operatorBus",
      );
    }

    if (files.fitnessCertificate) {
      documents.fitnessCertificate = await this._storageService.uploadFile(
        files.fitnessCertificate,
        "operatorBus",
      );
    }

    if (files.insurance) {
      documents.insurance = await this._storageService.uploadFile(
        files.insurance,
        "operatorBus",
      );
    }

    const seatLayoutSnapshot = {
      name: seatLayout.name,
      slug: seatLayout.slug,
      busType: seatLayout.busType,
      totalCapacity: seatLayout.totalCapacity,
      decks: seatLayout.decks,
      seats: seatLayout.seats,
      elements: seatLayout.elements,
    };

    const updatedBus = await this._busRepository.resubmitBus(
      busId,
      operatorId,
      {
        manufacturer: data.manufacturer.trim(),
        model: data.model.trim(),
        registrationNumber,
        manufacturingYear: data.manufacturingYear,
        busType: seatLayout.busType,
        seatLayoutId: new Types.ObjectId(data.seatLayoutId),
        seatLayoutSnapshot,
        amenities: data.amenities,
        documents,
        approvalStatus: "PENDING",
        rejectReason: null,
      },
    );

    if (!updatedBus) {
      throw new Error("Unable to resubmit bus. Please try again");
    }

    return updatedBus;
  }



  async deleteBus(
  operatorId: string,
  busId: string,
): Promise<IBus> {
  const existingBus = await this._busRepository.findBusById(busId);

  if (!existingBus) {
    throw new Error("Bus not found");
  }

  if (existingBus.operatorId.toString() !== operatorId) {
    throw new Error("You are not authorized to delete this bus");
  }

  if (existingBus.isDeleted) {
    throw new Error("Bus is already deleted");
  }

  const deletedBus = await this._busRepository.deleteBus(
    busId,
    operatorId,
  );

  if (!deletedBus) {
    throw new Error("Unable to delete bus. Please try again");
  }

  return deletedBus;
}
}
