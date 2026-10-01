import axios  from "axios";
import env from "@/config/env";
import { store } from "@/redux/store/store";
 
import { setOperatorAccessToken , logoutOperator } from "@/redux/slice/operatorAuthSlice";

import { publicApi } from "./publicAoi";
import { AUTH_BASE_ROUTE } from "@/constants/apiRoutes";
 
export const opperatorApi = axios.create({
    baseURL : env.API_BASE_URL,
    withCredentials:true
})

opperatorApi.interceptors.request.use((config) => {
    const state = store.getState()

    const token = state.operatorAuth.accessToken

    if(token){
        config.headers.Authorization = `Bearer ${token}`
    }

    return config
})

opperatorApi.interceptors.response.use((response) => response, async (error) => {

    const originalRequest = error.config

    if(error.response?.status === 401 && !originalRequest._retry){
        originalRequest._retry = true

        try {
            
            const response = await publicApi.post(`/${AUTH_BASE_ROUTE}/operator-refresh-token`)

            const accessToken = response.data.data.accessToken

            if(accessToken){
                store.dispatch(setOperatorAccessToken(accessToken))
            }

            originalRequest.headers.Authorization = `Bearer ${accessToken}`

            return opperatorApi(originalRequest)
        } catch (refreshError) {
            console.error("Refresh token failed",refreshError);
            store.dispatch(logoutOperator());
            return Promise.reject(refreshError);
        }
    }

    if(axios.isAxiosError(error)){
        const message = error.response?.data?.message || 'Something Went Wrong'

        return Promise.reject(new Error(message))
    }

    return Promise.reject(error)
})