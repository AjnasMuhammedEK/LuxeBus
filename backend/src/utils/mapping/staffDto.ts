import { StaffDocument } from "../../models/Staff";
import { IStaffMappedData } from "../../types/staff";

export const staffDataMapping = (staff : StaffDocument) : IStaffMappedData => {
    return {

        id: staff._id.toString(),
        operatorId:staff.operatorId.toString(),
        fullName:staff.fullName,
        email : staff.email,
        mobileNumber:staff.phone,
        role:staff.role,
        joiningDate:staff.joiningDate,
        commercialLicense:staff.commercialLicense,
        idProof:staff.idProof,
        isBlocked:staff.isBlocked,
        isVerified:staff.isBlocked,
        status:staff.status
    }
}