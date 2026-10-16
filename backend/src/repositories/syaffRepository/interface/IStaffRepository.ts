import { Types } from "mongoose";
import { StaffDocument } from "../../../models/Staff";
import { IStaff , IStaffQueryParams , IStaffListResponse} from "../../../types/staff";

export interface IStaffRepository {
    staffRegister (staff : IStaff) : Promise <IStaff>

    findStaffByEmail (email:string):Promise<StaffDocument | null>

    getStaffs(
        operatorId: Types.ObjectId,
        query: IStaffQueryParams
    ): Promise<IStaffListResponse>;

    findStaffByIdAndOperator(
        staffId: string,
        operatorId: Types.ObjectId
    ): Promise<StaffDocument | null>;
    
    updateStaff(staffId: string,operatorId: Types.ObjectId,staffData: Partial<IStaff>): Promise<StaffDocument | null>;
    findStaffById(staffId: string): Promise<StaffDocument | null>;
}