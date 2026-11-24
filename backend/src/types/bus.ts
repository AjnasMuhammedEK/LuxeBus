
import type { Types } from "mongoose";

import type {
  BusType,
  IDeckConfig,
  ILayoutElement,
  ISeat,
} from "./seatLayout";

 
export type BusApprovalStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED";

 
export type BusAmenity =
  | "AC"
  | "WIFI"
  | "CHARGING_PORT"
  | "WATER_BOTTLE"
  | "READING_LIGHT";

 
export interface IBusDocuments {
  rc: string;
  fitnessCertificate: string;
  insurance: string;
}
 
export interface IBusSeatLayoutSnapshot {
  name: string;
  slug: string;

  busType: BusType;

  totalCapacity: number;

  decks: IDeckConfig[];

  seats: ISeat[];

  elements: ILayoutElement[];
 
}

 
export interface IBus {
  _id?: Types.ObjectId;
  operatorId: Types.ObjectId;

  manufacturer: string;
  model: string;
  registrationNumber: string;
  manufacturingYear: number;

  busType: BusType;

  seatLayoutId: Types.ObjectId;

  seatLayoutSnapshot: IBusSeatLayoutSnapshot;

  amenities: BusAmenity[];

  documents: IBusDocuments;
  isDeleted: boolean;
  approvalStatus: BusApprovalStatus;

  isActive: boolean;

  rejectReason?: string | null;
}

 
export interface ICreateBusDTO {
  manufacturer: string;
  model: string;
  registrationNumber: string;
  manufacturingYear: number;

  busType: BusType;

  seatLayoutId: string;

  amenities: BusAmenity[];

  documents: IBusDocuments;
}

export interface ICreateBusFiles {
  rc: Express.Multer.File;
  fitnessCertificate: Express.Multer.File;
  insurance: Express.Multer.File;
}

export type BusSortField =
  | "registrationNumber"
  | "manufacturer"
  | "model"
  | "manufacturingYear"
  | "approvalStatus"
  | "createdAt";

export type BusSortOrder = "asc" | "desc";

export interface IBusQueryParams {
  page: number;
  limit: number;
  search: string;
  sortBy: BusSortField;
  sortOrder: BusSortOrder;
  approvalStatus?: BusApprovalStatus;
}

export interface IBusPagination {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export interface IBusListResponse {
  buses: IBus[];
  stats: IBusStats;
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}

export interface IBusStats {
  total: number;
  approved: number;
  pending: number;
  rejected: number;
}
export interface IAdminBusOperatorInfo {
  _id: Types.ObjectId;
  ownerName: string;
  legalEntityName: string;
  email: string;
  phone: string;
}

export type IAdminBus = Omit<IBus, "operatorId"> & {
  operatorId: IAdminBusOperatorInfo;
};

export interface IAdminBusStats {
  total: number;
  approved: number;
  pending: number;
  rejected: number;
}

export interface IAdminBusListResponse {
  buses: IAdminBus[];
  total: number;
  stats: IAdminBusStats;
}

export interface IResubmitBusDTO {
  manufacturer: string;
  model: string;
  registrationNumber: string;
  manufacturingYear: number;
  seatLayoutId: string;
  amenities: BusAmenity[];
}

export interface IResubmitBusFiles {
  rc?: Express.Multer.File;
  fitnessCertificate?: Express.Multer.File;
  insurance?: Express.Multer.File;
}