import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "inversify";

import { TYPES } from "../../../DI/types";
import { IAdminController } from "../interfaces/IAdminController";
import { IAdminService } from "../../../services/AdminServices/interface/IAdminService";
import { HttpStatus } from "../../../constants/httpStatusCodes";
import { createResponse } from "../../../helper/responseHelper";
import { IBusQueryParams } from "../../../types/bus";
import { Types } from "mongoose";

@injectable()
export class AdminController implements IAdminController {
  constructor(
    @inject(TYPES.AdminService)
    private _adminService: IAdminService,
  ) {}

  getOperators = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const search = (req.query.search as string) || "";
      const sortBy = (req.query.sortBy as string) || "createdAt";
      const sortOrder = (req.query.sortOrder as string) || "desc";
      const response = await this._adminService.getOperators(
        page,
        limit,
        search,
        sortBy,
        sortOrder,
      );

      res
        .status(HttpStatus.OK)
        .json(createResponse(true, "Operators fetched successfully", response));
    } catch (error) {
      console.log("ERROR in AdminController getPendingOperators:", error);
      next(error);
    }
  };

  updateOperatorStatus = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      console.log("req.params //////", req.params);
      const operatorId = req.params.operatorId as string;

      console.log("Operator Id in controller", operatorId);
      const { status, reason } = req.body;

      const operator = await this._adminService.updateOperatorStatus(
        operatorId,
        status,
        reason,
      );

      res
        .status(HttpStatus.OK)
        .json(
          createResponse(
            true,
            "Operator status updated successfully",
            operator,
          ),
        );
    } catch (error) {
      console.log("ERROR in updateOperatorStatus:", error);
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

      if (!objectKey) {
        throw new Error("Object key is Missing");
      }
      const signedUrl = await this._adminService.getDocumentSignedUrl(
        objectKey as string,
      );
      // console.log('Backend signer url' , signedUrl)

      res.status(HttpStatus.OK).json(
        createResponse(true, "Document signed URL generated successfully", {
          signedUrl,
        }),
      );
    } catch (error) {
      next(error);
    }
  };

  updateOperatorBlock = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const operatorId = req.params.operatorId as string;

      const { isBlocked } = req.body;

      const operator = await this._adminService.updateOperatorBlock(
        operatorId,
        isBlocked,
      );

      res
        .status(HttpStatus.OK)
        .json(
          createResponse(
            true,
            "Operator blocked updated successfully",
            operator,
          ),
        );
    } catch (error) {
      console.log("ERROR in updateOperatorBlock:", error);
      next(error);
    }
  };

  getAdminBuses = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const page = Math.max(1, Number(req.query.page) || 1);

      const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 10));

      const search = (req.query.search as string) || "";

      const allowedStatuses = ["PENDING", "APPROVED", "REJECTED"];

      const requestedStatus = req.query.approvalStatus as string;

      if (requestedStatus && !allowedStatuses.includes(requestedStatus)) {
        throw new Error("Invalid bus approval status");
      }

      const query: IBusQueryParams = {
        page,
        limit,
        search: search.trim(),
        sortBy: "createdAt",
        sortOrder: "desc",
        ...(requestedStatus && {
          approvalStatus: requestedStatus as
            | "PENDING"
            | "APPROVED"
            | "REJECTED",
        }),
      };

      const result = await this._adminService.getAdminBuses(query);

      res
        .status(HttpStatus.OK)
        .json(createResponse(true, "Buses fetched successfully", result));
    } catch (error) {
      next(error);
    }
  };

  getBusDocumentSignedUrl = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const busId = req.params.busId;
      const docKey = req.params.docKey;

      if (typeof busId !== "string" || typeof docKey !== "string") {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json(createResponse(false, "Invalid request parameters", null));
        return;
      }

      const allowedDocKeys = ["rc", "fitnessCertificate", "insurance"] as const;

      if (!allowedDocKeys.includes(docKey as (typeof allowedDocKeys)[number])) {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json(createResponse(false, "Invalid document key", null));
        return;
      }

      const signedUrl = await this._adminService.getBusDocumentSignedUrl(
        busId,
        docKey as (typeof allowedDocKeys)[number],
      );

      res.status(HttpStatus.OK).json(
        createResponse(true, "Bus document URL generated successfully", {
          url: signedUrl,
        }),
      );
    } catch (error) {
      next(error);
    }
  };

  updateBusStatus = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { busId } = req.params;
      const { approvalStatus, rejectReason } = req.body;

      
      if (typeof busId !== "string" || !Types.ObjectId.isValid(busId)) {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json(createResponse(false, "Invalid bus ID", null));
        return;
      }

      
      if (approvalStatus !== "APPROVED" && approvalStatus !== "REJECTED") {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json(createResponse(false, "Invalid approval status", null));
        return;
      }

       
      if (
        approvalStatus === "REJECTED" &&
        (typeof rejectReason !== "string" || rejectReason.trim().length < 5)
      ) {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json(
            createResponse(
              false,
              "Rejection reason must contain at least 5 characters",
              null,
            ),
          );
        return;
      }

      const updatedBus = await this._adminService.updateBusStatus(
        busId,
        approvalStatus,
        approvalStatus === "REJECTED" ? rejectReason.trim() : undefined,
      );

      res
        .status(HttpStatus.OK)
        .json(
          createResponse(
            true,
            `Bus ${approvalStatus.toLowerCase()} successfully`,
            updatedBus,
          ),
        );
    } catch (error) {
      next(error);
    }
  };
}
