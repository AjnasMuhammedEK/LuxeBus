import axios ,{type AxiosError , type InternalAxiosRequestConfig} from "axios";
import env from "@/config/env";
import { store } from "@/redux/store/store";
 
import { setAccessToken , logout } from "@/redux/slice/authSlice";

import { publicApi } from "./publicAoi";
import { AUTH_BASE_ROUTE } from "@/constants/apiRoutes";

export const passengerApi = axios.create({
    baseURL:env.API_BASE_URL,
    withCredentials:true
})

passengerApi.interceptors.request.use((config) => {
    const state = store.getState()

    const token = state.auth.accessToken

    if(token){
        config.headers.Authorization = `Bearer ${token}`
    }

    return config
})

passengerApi.interceptors.response.use( (response) => response , async (error) => {
    const originalRequest = error.config

    if(error.response?.status === 401 && !originalRequest._retry){
        originalRequest._retry = true

        try {
            const response = await publicApi.post(`/${AUTH_BASE_ROUTE}/refresh-token`)

            const accessToken = response.data.accessToken

            if(accessToken){
                store.dispatch(setAccessToken(accessToken))
            }

            originalRequest.headers.Authorization = `Bearer ${accessToken}`

            return passengerApi(originalRequest)
        } catch (refreshError) {
            console.error("Refresh token failed",refreshError);
            store.dispatch(logout());
            return Promise.reject(refreshError);
        }
    }

    if(axios.isAxiosError(error)) {
        const message = error.response?.data?.message || 'something went wrong'

        return Promise.reject(new Error(message))
    }

    return Promise.reject(error)
})