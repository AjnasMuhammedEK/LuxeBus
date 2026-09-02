// import axios from "axios";
// import env from "@/config/env";
// import { store } from "@/redux/store/store";
 


// export const passengerApi = axios.create({
//   baseURL : env.API_BASE_URL,
//   withCredentials:true
// })

// passengerApi.interceptors.request.use ((config) => {
//   const state = store.getState()

//   const token = state.auth.accessToken
//   if(token){
//     config.headers.Authorization = `Bearer ${token}`
//   }

//   return config
// })


// export const operatorApi = axios.create({
//   baseURL:env.API_BASE_URL,
//   withCredentials:true
// })

// operatorApi.interceptors.request.use ((config) => {
//   const state = store.getState()

//   const token = state.operatorAuth.accessToken

//   if(token){
//     config.headers.Authorization = `Bearer ${token}`
//   }

//   return config
// }) 

// export const adminAPi = axios.create ({
//   baseURL : env.API_BASE_URL,
//   withCredentials:true
// })

// adminAPi.interceptors.request.use((config) => {
//   const state = store.getState()

//   const token = state.adminAuth.accessToken

//   if(token){
//     config.headers.Authorization = `Bearer ${token}`
//   }

//   return config
// })