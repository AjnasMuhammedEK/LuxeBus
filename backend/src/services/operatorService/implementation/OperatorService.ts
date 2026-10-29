
import { inject, injectable } from "inversify";

import { TYPES } from "../../../DI/types";
import { IOperatorService } from "../interface/IOperatorService";
import { IOperatorRepository } from "../../../repositories/Operator/interface/IOperatorRepository";
import { IStorageService } from "../../storage/interfaces/IStorageService";
import {
    IOperator,
    IOperatorResubmitData,
} from "../../../types/operator";

const documentKeys = [
    "registrationCertificate",
    "taxCertificate",
    "transportLicense",
] as const;

@injectable()
export class OperatorService implements IOperatorService {
    constructor(
        @inject(TYPES.OperatorRepository)
        private _operatorRepository: IOperatorRepository,

        @inject(TYPES.S3StorageService)
        private _s3Service: IStorageService
    ) {}

    async resubmitOperator(
        operatorId: string,
        data: IOperatorResubmitData,
        files: { [fieldname: string]: Express.Multer.File[] }
    ): Promise<IOperator> {

        // 1. Find operator
        const operator =
            await this._operatorRepository.findOperatorById(operatorId);

        if (!operator) {
            throw new Error("Operator not found");
        }

        // 2. Only rejected operators can resubmit
        if (operator.status !== "rejected") {
            throw new Error(
                "Only rejected registrations can be resubmitted"
            );
        }

        // 3. Prepare updated details
        const updateData: Partial<IOperator> = {
            ...data,
            status: "pending",
            rejectReason : null
        };

        // 4. Upload newly submitted documents
        for (const key of documentKeys) {
            const file = files?.[key]?.[0];

            if (file) {
                updateData[key] = await this._s3Service.uploadFile(
                    file,
                    "operator-documents"
                );
            }
        }

        // 5. Update operator in database
        const updatedOperator =
            await this._operatorRepository.resubmitOperator(
                operatorId,
                updateData
            );

        if (!updatedOperator) {
            throw new Error("Failed to resubmit operator details");
        }

        // 6. Return updated operator
        return updatedOperator;
    }
}
