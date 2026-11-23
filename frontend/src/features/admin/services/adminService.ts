// import api from "@/services/api";
import { ADMIN_BASE_ROUTE } from '@/constants/apiRoutes'

import { adminApi } from '@/services/adminApi';
import type { BusApprovalStatus, BusDocumentKey, IAdminBusListResponse, IBusListQuery } from '@/types/fleet.types';


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

export const updateOperatorStatus = async ( operatorId: string,status: string , reason : string | null) => {
    const response = await adminApi.patch(`/${ADMIN_BASE_ROUTE}/updateOperatorStatus/${operatorId}`,{status,reason});
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




export const getAdminBuses = async (
  query: IBusListQuery
): Promise<IAdminBusListResponse> => {
  const res = await adminApi.get(`/${ADMIN_BASE_ROUTE}/buses`, { params: query });
  return res.data.data;
};

export const updateBusStatus = async (
  busId: string,
  approvalStatus: BusApprovalStatus,
  rejectReason?: string
) => {
  const res = await adminApi.patch(`/${ADMIN_BASE_ROUTE}/buses/${busId}/status`, {
    approvalStatus,
    rejectReason,
  });
  return res.data.data;
};

 export const getBusDocumentUrl = async (
  busId: string,
  docKey: BusDocumentKey
): Promise<string> => {
  const res = await adminApi.get(`/${ADMIN_BASE_ROUTE}/buses/${busId}/documents/${docKey}`);
  return res.data.data.url;
};


export const updateBusActiveStatus = async (busId: string,isActive: boolean,) => {
  const res = await adminApi.patch(`/${ADMIN_BASE_ROUTE}/buses/${busId}/active-status`,{ isActive },);

  return res.data.data;
};