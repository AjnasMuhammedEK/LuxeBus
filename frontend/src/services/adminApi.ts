import axios ,{type AxiosError , type InternalAxiosRequestConfig} from "axios";
import env from "@/config/env";
import { store } from "@/redux/store/store";
 
import { setAdminAccessToken , logoutAdmin } from "@/redux/slice/adminAuthSlice";

import { publicApi } from "./publicAoi";
import { AUTH_BASE_ROUTE } from "@/constants/apiRoutes";


export const adminApi = axios.create ({
    baseURL:env.API_BASE_URL,
    withCredentials:true
})

adminApi.interceptors.request.use((config) => {
    const state = store.getState()

    const token = state.adminAuth.accessToken

    if(token){
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

adminApi.interceptors.response.use((response) => response , async (error) => {

    const originalRequest = error.config

    if(error.response?.status === 401 && !originalRequest._retry){
        originalRequest._retry = true

        try {
            
            const response = await publicApi.post(`/${AUTH_BASE_ROUTE}/admin-refresh-token`)
            const accessToken = response.data.accessToken

            if(accessToken){
                store.dispatch(setAdminAccessToken(accessToken))
            }

            originalRequest.headers.Authorization = `Bearer ${accessToken}`

            return adminApi(originalRequest)

        } catch (refreshError) {
            console.error("Refresh token failed",refreshError);
            store.dispatch(logoutAdmin());
            return Promise.reject(refreshError); 
        }
    }

    return Promise.reject(error)
})