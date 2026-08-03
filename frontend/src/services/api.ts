import axios from "axios";
import env from '@/config/env'
 

const api = axios.create({
  baseURL: env.API_BASE_URL,
});


api.interceptors.request.use((config) => {

    const token =localStorage.getItem("userToken") ||localStorage.getItem("adminToken") ||localStorage.getItem("operatorToken");
    if(token){
        config.headers.Authorization = `Bearer ${token}`;
    }    
    return config;
})

export default api;