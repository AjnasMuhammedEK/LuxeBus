import { inject, injectable } from "inversify";
import { IBusController } from "../interface/IBusController";
import { TYPES } from "../../../../DI/types";
import { IBusService } from "../../../../services/operatorService/bus/interface/IBusService";
import { Request, Response, NextFunction } from "express";
import { HttpStatus } from "../../../../constants/httpStatusCodes";
import { createResponse } from "../../../../helper/responseHelper";
import {
  BusApprovalStatus,
  BusSortField,
  IResubmitBusDTO,
  IResubmitBusFiles,
} from "../../../../types/bus";
import { Types } from "mongoose";

@injectable()
export class BusController implements IBusController {
  constructor(@inject(TYPES.BusService) private _busService: IBusService) {}

  createBus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const operatorId = req.user?.id;

      if (!operatorId) {
        throw new Error("Unauthorized: User not authenticated");
      }

      const amenities = JSON.parse(req.body.amenities || "[]");

      if (
        !Array.isArray(amenities) ||
        !amenities.every((item) =>
          [
            "AC",
            "WIFI",
            "CHARGING_PORT",
            "WATER_BOTTLE",
            "READING_LIGHT",
          ].includes(item),
        )
      ) {
        throw new Error("Invalid amenities");
      }

      const files = req.files as {
        [fieldname: string]: Express.Multer.File[];
      };

      const rc = files?.rc?.[0];
      const fitnessCertificate = files?.fitnessCertificate?.[0];
      const insurance = files?.insurance?.[0];

      if (!rc || !fitnessCertificate || !insurance) {
        throw new Error("All bus documents are required");
      }

      const data = {
        ...req.body,
        amenities,
      };

      const createBus = await this._busService.createBus(operatorId, data, {
        rc,
        fitnessCertificate,
        insurance,
      });

      res
        .status(HttpStatus.OK)
        .json(createResponse(true, "Bus created successfully", createBus));
    } catch (error) {
      next(error);
    }
  };

  getBuses = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const operatorId = req.user?.id;

      if (!operatorId) {
        res
          .status(HttpStatus.UNAUTHORIZED)
          .json(createResponse(false, "Operator ID not found", null));
        return;
      }

      const {
        page = "1",
        limit = "5",
        search = "",
        sortBy = "createdAt",
        sortOrder = "desc",
        approvalStatus,
      } = req.query;

      const response = await this._busService.getBuses(operatorId as string, {
        page: Number(page),
        limit: Number(limit),
        search: String(search),
        sortBy: sortBy as BusSortField,
        sortOrder: sortOrder as "asc" | "desc",
        approvalStatus: approvalStatus as BusApprovalStatus | undefined,
      });

      res
        .status(HttpStatus.OK)
        .json(createResponse(true, "Get all buses", response));
    } catch (error) {
      next(error);
    }
  };

  getDocumentSignedUrl = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { objectKey } = req.query;

      console.log("Object key url", objectKey);

      if (!objectKey) {
        throw new Error("Object key is Missing");
      }
      const signedUrl = await this._busService.getDocumentSignedUrl(
        objectKey as string,
      );

      res.status(HttpStatus.OK).json(
        createResponse(true, "Document signed URL generated successfully", {
          signedUrl,
        }),
      );
    } catch (error) {
      next(error);
    }
  };

  resubmitBus = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const operatorId = req.user?.id;
      const { busId } = req.params;

      if (typeof busId !== "string" || !Types.ObjectId.isValid(busId)) {
        throw new Error("Invalid bus ID");
      }

      if (!operatorId) {
        throw new Error("Unauthorized");
      }

      const amenities: unknown = JSON.parse(req.body.amenities || "[]");

      const allowedAmenities = [
        "AC",
        "WIFI",
        "CHARGING_PORT",
        "WATER_BOTTLE",
        "READING_LIGHT",
      ];

      if (
        !Array.isArray(amenities) ||
        !amenities.every((item) => allowedAmenities.includes(item))
      ) {
        throw new Error("Invalid amenities");
      }

      const data: IResubmitBusDTO = {
        manufacturer: req.body.manufacturer,
        model: req.body.model,
        registrationNumber: req.body.registrationNumber,
        manufacturingYear: Number(req.body.manufacturingYear),
        seatLayoutId: req.body.seatLayoutId,
        amenities,
      };

      const uploadedFiles = req.files as
        | { [fieldname: string]: Express.Multer.File[] }
        | undefined;

      const files: IResubmitBusFiles = {
        rc: uploadedFiles?.rc?.[0],
        fitnessCertificate: uploadedFiles?.fitnessCertificate?.[0],
        insurance: uploadedFiles?.insurance?.[0],
      };

      const updatedBus = await this._busService.resubmitBus(
        operatorId,
        busId,
        data,
        files,
      );

      res
        .status(HttpStatus.OK)
        .json(createResponse(true, "Bus resubmitted successfully", updatedBus));
    } catch (error) {
      next(error);
    }
  };
}
