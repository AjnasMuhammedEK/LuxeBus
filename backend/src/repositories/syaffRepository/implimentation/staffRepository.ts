import { Staff, StaffDocument } from "../../../models/Staff";
import { IStaff ,IStaffQueryParams, IStaffListResponse} from "../../../types/staff";
import { BaseRepositary } from "../../BaseRepository";
import { IStaffRepository } from "../interface/IStaffRepository";
import { QueryFilter, Types } from "mongoose";

export class StaffRepository extends BaseRepositary<IStaff> implements IStaffRepository {

    constructor (){
        super(Staff)
    }

    async staffRegister (staffData : IStaff) : Promise<StaffDocument>{
        return await this.create(staffData)
    }

    async findStaffByEmail(email: string): Promise<StaffDocument | null> {
        return await this.findOne({email})
    }

    async getStaffs (operatorId : Types.ObjectId , query: IStaffQueryParams) : Promise<IStaffListResponse > {
         
        const {page , limit , search , sortBy,sortOrder}= query

        const skip = (page - 1) * limit

        const filter: QueryFilter<IStaff> = { operatorId };

        if(search){
            filter.$or = [
                {
                    fullName :{
                        $regex:search,
                        $options:'i'
                    }
                },
                {
                    email:{
                        $regex:search,
                        $options:'i'
                    }
                }
            ]
        }

        const sortDirection = sortOrder === 'asc' ? 1 : -1

        const sort :Record<string ,1|-1> = {
            [sortBy]:sortDirection
        }

        const [staff , totalItems] = await Promise.all([
            this.model.find(filter).sort(sort).skip(skip).limit(limit),

            this.model.countDocuments(filter)
        ])

        const totalPages = Math.ceil(totalItems / limit)

        return {
            staff ,
            pagination :{
                page,
                limit,
                totalItems,
                totalPages
            }
        }
    }


    async findStaffByIdAndOperator(staffId: string,operatorId: Types.ObjectId): Promise<StaffDocument | null> {

        return await this.findOne({
            _id: new Types.ObjectId(staffId),
            operatorId
        });
    }


    async updateStaff(staffId: string,operatorId: Types.ObjectId,staffData: Partial<IStaff>) {

        return await this.updateOne(
            {
                _id: new Types.ObjectId(staffId),
                operatorId: operatorId,
            },
            {
                $set: staffData,
            }
        );
    }

    async findStaffById(staffId: string): Promise<StaffDocument | null> {
        return await this.findById(staffId);
    }
}