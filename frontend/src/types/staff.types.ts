// src/types/staff.types.ts

export interface StaffRegisterFormData {
    fullName: string;
    mobileNumber: string;
    email: string;
    role: "driver" | "conductor";
    joiningDate: string;
    password: string;
    confirmPassword: string;
}

export type StaffDocumentKey =
    | "idProof"
    | "commercialLicense";

export interface StaffDocumentFiles {
    idProof: File | null;
    commercialLicense: File | null;
}

export interface IStaff {
    _id: string;

    operatorId: string;

    fullName: string;

    phone: string;

    email: string;

    role: "driver" | "conductor";

    joiningDate: string;

    status: "on-duty" | "off-duty"  

    isVerified: boolean;
    
    isBlocked: boolean;

    idProof?: string | null;
    commercialLicense?: string | null;

    createdAt: string;
    updatedAt: string;
}