import { IStaff , IStaffRegisterData ,IStaffEditData , IStaffListResponse, IStaffQueryParams} from "../../../../types/staff";
 
export interface IstaffService {

    staffRegister(
        data: IStaffRegisterData,
        files: {
            [fieldname: string]: Express.Multer.File[];
        },
        operatorId : string
    ): Promise<void>;

    getStaffs(operatorId : string ,query: IStaffQueryParams ):Promise<IStaffListResponse>

    getDocumentSignedUrl(objectKey: string): Promise<string>
    
    editStaff(staffId: string,data: IStaffEditData,files: {[fieldname: string]: Express.Multer.File[] },operatorId: string): Promise<IStaff>;
}