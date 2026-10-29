import { opperatorApi } from "@/services/operatorApi";
import { OPERATOR_BASE_ROUTE } from "@/constants/apiRoutes";

export const operatorResubmit = async (data: FormData) => {
    const response = await opperatorApi.patch(`/${OPERATOR_BASE_ROUTE}/resubmitOperator`, data)
    return response.data
}