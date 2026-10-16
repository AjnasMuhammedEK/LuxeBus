import { injectable } from "inversify";
import { Operator, OperatorDocument } from "../../../models/Operator";
import { IAdminRepository } from "../interface/IAdminRepository";
import { IOperator } from "../../../types/operator";
import { BaseRepositary } from "../../BaseRepository";
import { QueryFilter } from "mongoose";

@injectable()
export class AdminRepository implements IAdminRepository {

    private operatorRepository = new BaseRepositary(Operator)

    async getOperators(page: number,limit: number,search: string, sortBy: string, sortOrder: string): Promise<{
        operators: OperatorDocument[];
        totalItems: number;
    }>  {


        const skip = (page - 1) * limit;

        const filter: QueryFilter<IOperator> = {};   
        
        if (search) {
            filter.$or = [
                { legalEntityName: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
                { phone: { $regex: search, $options: "i" } },
                
            ];
        }

        const allowedSortFields = [
            "legalEntityName",
            "ownerName",
            'createdAt'
        ];

        const safeSortBy = allowedSortFields.includes(sortBy)
            ? sortBy
            : "createdAt";

        const safeSortOrder = sortOrder === "asc" ? 1 : -1;

        const [operators, totalItems] = await Promise.all([
            Operator.find(filter)
                .sort({ [safeSortBy]: safeSortOrder })
                .skip(skip)
                .limit(limit),

            Operator.countDocuments(filter),
        ]);        

        return {
            operators,
            totalItems,
        };
    }

    async updateOperatorStatus(operatorId: string,status: string , reason : string | null): Promise<IOperator | null> {

        return await this.operatorRepository.updateById(operatorId,{ status , rejectReason : reason ?? null });
    }

    async updateOperatorBlock(operatorId: string,isBlocked: boolean): Promise<IOperator | null> {

        return await this.operatorRepository.updateById(operatorId,{ isBlocked });
    }

    async findOperatorById(operatorId: string): Promise<IOperator | null> {
        return await this.operatorRepository.findById(operatorId)
    }
}