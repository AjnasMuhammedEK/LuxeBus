 
import { publicApi } from '@/services/publicAoi'

import { AUTH_BASE_ROUTE } from '@/constants/apiRoutes'
import type { UserRegisterFormData , UserLoginFormData, OperatorLoginFormData , userForgotPasswordEmailVeryfication ,UserVerifyForgotPasswordOtp, UserResetPassword } from '@/types/auth.types'
// import { passengerApi } from '@/services/api'
// import { operatorApi } from '@/services/api'
// import { adminAPi } from '@/services/api'
 
export const registerUser = async (data:UserRegisterFormData) => {
    const response = await publicApi.post(`/${AUTH_BASE_ROUTE}/register`,data)
    return response.data
}

export const userLogin = async (data : UserLoginFormData) => {
    const response = await publicApi.post(`/${AUTH_BASE_ROUTE}/login`,data)
    return response.data
}

export const operatorRegister = async (data : FormData) => {
    const response = await publicApi.post(`/${AUTH_BASE_ROUTE}/operatorRegister`,data)
    return response.data
}

export const operatorLogin = async (data:OperatorLoginFormData) =>{
    const response = await publicApi.post(`/${AUTH_BASE_ROUTE}/operatorLogin`,data)
    return response.data
}

export const adminLogin = async (data : UserLoginFormData) => {
    const response = await publicApi.post(`/${AUTH_BASE_ROUTE}/adminLogin`,data)
    return response.data
}

export const userForgotPasswordEmailVerification = async (data : userForgotPasswordEmailVeryfication) => {
    const response = await publicApi.post(`/${AUTH_BASE_ROUTE}/userForgotPasswordEmailVerify`,data)
    return response.data
}

export const userVerifyForgotPasswordOtp = async (data:UserVerifyForgotPasswordOtp) => {
    const response = await publicApi.post(`/${AUTH_BASE_ROUTE}/userVerifyForgotPasswordOtp`,data)
    return response.data
}

export const userResetPassword = async (data:UserResetPassword) => {
   const response = await publicApi.patch(`/${AUTH_BASE_ROUTE}/userResetPassword`,data)
   return response.data
}

export const googleLogin = async (credential: string) => {
    const response = await publicApi.post(`/${AUTH_BASE_ROUTE}/googleLogin`,{credential,});
    return response.data;
};



export const userLogout = async () => {
    const response = await publicApi.post(`/${AUTH_BASE_ROUTE}/userLogout`)
    return response.data
}

export const adminLogout = async () => {
    const response = await publicApi.post(`/${AUTH_BASE_ROUTE}/adminLogout`)
    return response.data
}

export const operatorLogout = async () => {
    const response = await publicApi.post(`/${AUTH_BASE_ROUTE}/operatorLogout`)
    return response.data
}