import api from "@/services/api";
import { ADMIN_BASE_ROUTE } from '@/constants/apiRoutes'

export const getOperators = async () => {
    const response = await api.get(`/${ADMIN_BASE_ROUTE}/getOperators`);
    return response.data;
};

export const updateOperatorStatus = async ( operatorId: string,status: string) => {
    const response = await api.patch(`/${ADMIN_BASE_ROUTE}/updateOperatorStatus/${operatorId}`,{status});
    return response.data;
};