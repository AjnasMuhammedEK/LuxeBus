import { OperatorDocument } from "../../models/Operator";
import { IOperatorMappedData } from "../../types/operator";

export const operatorDataMapping = (operator:OperatorDocument) :IOperatorMappedData => {
    return {
        
        id:operator._id.toString(),
        ownerName:operator.ownerName,
        email: operator.email,
        phone: operator.phone,
        role: operator.role,
        legalEntityName: operator.legalEntityName,
        gstNumber: operator.gstNumber,
        yearOfIncorporation: operator.yearOfIncorporation,
        panNumber: operator.panNumber,
        authorisedRepresentative: operator.authorisedRepresentative,
        registrationCertificate: operator.registrationCertificate,
        taxCertificate: operator.taxCertificate,
        transportLicense: operator.transportLicense,
        status: operator.status,
        rejectReason : operator.rejectReason

    }
}