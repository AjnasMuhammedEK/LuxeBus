import axios from "axios";
import env from '@/config/env'

export const publicApi = axios.create({
    baseURL:env.API_BASE_URL,
    withCredentials:true
    
})