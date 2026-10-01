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

}