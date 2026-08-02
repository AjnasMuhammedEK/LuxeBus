import api from '@/services/api'

import { AUTH_BASE_ROUTE } from '@/constants/apiRoutes'
import type { UserRegisterFormData , UserLoginFormData, OperatorLoginFormData , userForgotPasswordEmailVeryfication ,UserVerifyForgotPasswordOtp, UserResetPassword } from '@/types/auth.types'

 
export const registerUser = async (data:UserRegisterFormData) => {
    const response = await api.post(`/${AUTH_BASE_ROUTE}/register`,data)
    return response.data
}

export const userLogin = async (data : UserLoginFormData) => {
    const response = await api.post(`/${AUTH_BASE_ROUTE}/login`,data)
    return response.data
}

export const operatorRegister = async (data : FormData) => {
    const response = await api.post(`/${AUTH_BASE_ROUTE}/operatorRegister`,data)
    return response.data
}

export const operatorLogin = async (data:OperatorLoginFormData) =>{
    const response = await api.post(`/${AUTH_BASE_ROUTE}/operatorLogin`,data)
    return response.data
}

export const adminLogin = async (data : UserLoginFormData) => {
    const response = await api.post(`/${AUTH_BASE_ROUTE}/adminLogin`,data)
    return response.data
}

export const userForgotPasswordEmailVerification = async (data : userForgotPasswordEmailVeryfication) => {
    const response = await api.post(`/${AUTH_BASE_ROUTE}/userForgotPasswordEmailVerify`,data)
    return response.data
}

export const userVerifyForgotPasswordOtp = async (data:UserVerifyForgotPasswordOtp) => {
    const response = await api.post(`/${AUTH_BASE_ROUTE}/userVerifyForgotPasswordOtp`,data)
    return response.data
}

export const userResetPassword = async (data:UserResetPassword) => {
    const response = await api.patch(`/${AUTH_BASE_ROUTE}/userResetPassword`,data)
    return response.data
}

export const googleLogin = async (credential: string) => {
  const response = await api.post(`/${AUTH_BASE_ROUTE}/googleLogin`,{credential,});
  return response.data;
};