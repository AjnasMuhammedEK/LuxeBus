// import api from "@/services/api";
import { ADMIN_BASE_ROUTE } from '@/constants/apiRoutes'

import { adminApi } from '@/services/adminApi';


export const getOperators = async ( params :{
    page : number,
    limit : number,
    search : string ,
    sortBy : string,
    sortOrder : 'asc' | 'desc'
}) => {
    const response = await adminApi.get(`/${ADMIN_BASE_ROUTE}/getOperators`,{params});
    return response.data;
};

export const updateOperatorStatus = async ( operatorId: string,status: string) => {
    const response = await adminApi.patch(`/${ADMIN_BASE_ROUTE}/updateOperatorStatus/${operatorId}`,{status});
    return response.data;
};

export const getSignedDocmunetUrl = async( objectKey: string) =>{
    const response = await adminApi.get(`/${ADMIN_BASE_ROUTE}/document`,{params:{objectKey}})
    return response.data
}   

export const updateOperatorBlockStatus = async (id: string, isBlocked: boolean) => {
  const response = await adminApi.patch(`/${ADMIN_BASE_ROUTE}/operators/${id}/block`, { isBlocked })
  return response.data
}