    export interface UserRegisterFormData {
        name : string,
        email : string,
        phone : string,
        password : string
    }

    export interface UserLoginFormData {
        email : string,
        password : string
    }

    export interface userForgotPasswordEmailVeryfication{
        email : string
    }

    export interface UserVerifyForgotPasswordOtp {
        email : string,
        otp : string
    }

    export interface OperatorRegisterFormData {
        ownerName: string
        email: string
        phone: string
        password: string
        confirmPassword: string
        legalEntityName: string
        gstNumber: string
        yearOfIncorporation: string
        panNumber: string
        authorisedRepresentative: string
    }

    export type OperatorDocumentKey =
        | 'registrationCertificate'
        | 'taxCertificate'
        | 'transportLicense'

    export interface OperatorDocumentFiles {
        registrationCertificate: File | null
        taxCertificate: File | null
        transportLicense: File | null
    }


    export interface OperatorLoginFormData {
        email: string
        password: string
    }

    export interface UserResetPassword{
        email :string,
        password : string
    }
export interface GoogleLoginRequest {
    credential: string;
}


export interface StaffLoginFromData {
    email:string , 
    password : string
}
export interface OperatorOtpGenerate {
    email : string
}