export type OperatorStatus = "pending" | "approved" | "rejected";


export interface IOperator {
  ownerName: string;
  email: string;
  phone:string;
  password : string;
  role:string,
  legalEntityName:string;
  gstNumber: string;
  yearOfIncorporation:string;
  panNumber :string;
  authorisedRepresentative :string;
  registrationCertificate: string
  taxCertificate: string
  transportLicense : string;
  status: OperatorStatus;
}

export interface IOperatorMappedData {
    id: string;
    ownerName: string;
    email: string;
    phone: string;
    role: string;
    legalEntityName: string;
    gstNumber: string;
    yearOfIncorporation: string;
    panNumber: string;
    authorisedRepresentative: string;
    registrationCertificate: string;
    taxCertificate: string;
    transportLicense: string;
    status: string;
}

export interface IOperatorRegisterData {
  ownerName: string;
  email: string;
  phone: string;
  password: string;
  legalEntityName: string;
  gstNumber: string;
  yearOfIncorporation: string;
  panNumber: string;
  authorisedRepresentative: string;
}