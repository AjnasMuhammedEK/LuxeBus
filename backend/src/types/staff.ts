import { Types } from "mongoose";

export type StaffRole = "driver" | "conductor";

export type StaffStatus = "on-duty" | "off-duty";

export interface IStaff {
    operatorId: Types.ObjectId;

    fullName: string;

    phone: string;

    email: string;

    password: string;

    role: StaffRole;

    joiningDate: string;

    idProof: string;

    commercialLicense: string;

    status: StaffStatus;

    isBlocked: boolean;
}

export interface IStaffMappedData {
    id: string;

    operatorId: string;

    fullName: string;

    mobileNumber: string;

    email: string;

    role: StaffRole;

    joiningDate: string;

    idProof: string;

    commercialLicense: string;

    status: StaffStatus;

    isVerified: boolean;

    isBlocked: boolean;
}

export interface IStaffRegisterData {
 

    fullName: string;

    mobileNumber: string;

    email: string;

    password: string;

    role: StaffRole;

    joiningDate: string;

    status: StaffStatus;

    isBlocked?: boolean;
}

export interface IStaffEditData {
    fullName: string;
    email: string;
    mobileNumber: string;
    role: StaffRole;
    joiningDate: string;
    isBlocked:boolean
}

export type StaffSortField =
    | "fullName"
    | "email"
    | "createdAt";

export type SortOrder = "asc" | "desc";

export interface IStaffQueryParams {
    page: number;
    limit: number;
    search: string;
    sortBy: StaffSortField;
    sortOrder: SortOrder;
}

export interface IStaffPagination {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
}

export interface IStaffListResponse {
    staff: IStaff[];
    pagination: IStaffPagination;
}

 