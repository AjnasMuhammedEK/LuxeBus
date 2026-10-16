export interface IOperator {

    _id:string;

    ownerName:string;

    email:string;

    phone:string;


    legalEntityName:string;

    gstNumber:string;

    panNumber:string;


    role:"operator";

    isBlocked : boolean

    status:
    | "pending"
    | "approved"
    | "rejected"
    | "suspended";

    rejectReason: string | null

    yearOfIncorporation: string
    authorisedRepresentative: string
    registrationCertificate: string
    taxCertificate: string
    transportLicense: string
    createdAt: string

}