
export type BusType =
  | "SEATER"
  | "SLEEPER"
  | "SEATER_CUM_SLEEPER"
  | "HYBRID";

export type SeatType =
  | "SLEEPER"
  | "SEMI_SLEEPER"
  | "SEATER";

export type BusDeck = "LOWER" | "UPPER";

export type LayoutElementType =
  | "DRIVER"
  | "TOILET"
  | "STAIRCASE"
  | "DOOR"
  | "EMERGENCY_EXIT";

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

export interface ISeat {
  seatId: string;
  seatNumber: string;
  type: SeatType;
  deck: BusDeck;
  row: number;
  col: number;
  rowSpan: number;
  colSpan: number;
}

export interface ILayoutElement {
  elementId: string;
  type: LayoutElementType;
  deck: BusDeck;
  row: number;
  col: number;
  rowSpan: number;
  colSpan: number;
  label?: string;
}

export interface IDeckConfig {
  name: BusDeck;
  rows: number;
  cols: number;
}

export interface ISeatLayout {
  _id: string;
  name: string;
  slug: string;
  busType: BusType;
  totalCapacity: number;
  decks: IDeckConfig[];
  seats: ISeat[];
  elements: ILayoutElement[];
  isActive: boolean;
}

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
  _id: string;
  operatorId: string;
  manufacturer: string;
  model: string;
  registrationNumber: string;
  manufacturingYear: number;
  busType: BusType;
  seatLayoutId: string;
  seatLayoutSnapshot: IBusSeatLayoutSnapshot;
  amenities: BusAmenity[];
  documents: IBusDocuments;
  approvalStatus: BusApprovalStatus;
  isActive: boolean;
  isDeleted: boolean;
  rejectReason?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface ICreateBusDTO {
  manufacturer: string;
  model: string;
  registrationNumber: string;
  manufacturingYear: number;
  busType: BusType;
  seatLayoutId: string;
  amenities: BusAmenity[];
}

export interface IBusDocumentFiles {
  rc: File | null;
  fitnessCertificate: File | null;
  insurance: File | null;
}
export interface IBusStats {
  total: number;
  approved: number;
  pending: number;
  rejected: number;
}

export interface IBusListQuery {
  page: number;
  limit: number;
  search: string;
  approvalStatus?: BusApprovalStatus;
}

export type BusFormErrors = Partial<
  Record<
    | "manufacturer"
    | "model"
    | "registrationNumber"
    | "manufacturingYear"
    | "seatLayoutId"
    | "rc"
    | "fitnessCertificate"
    | "insurance",
    string
  >
>;



export interface IBusOperatorInfo {
  _id: string;
  ownerName: string;
  legalEntityName: string;
  email: string;
  phone: string;
}
 
export interface IAdminBus extends Omit<IBus, "operatorId"> {
  operatorId: IBusOperatorInfo;
}

export interface IAdminBusListResponse {
  buses: IAdminBus[];
  total: number;
  stats: IBusStats;
}

export type BusDocumentKey = keyof IBusDocuments;