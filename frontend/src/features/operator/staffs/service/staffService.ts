import { opperatorApi } from "@/services/operatorApi";
import { OPERATOR_BASE_ROUTE } from "@/constants/apiRoutes";


export const staffRegister = async (data:FormData) => {
    console.log(data ,'Form Data Fronedn Servoce')
    const response = await opperatorApi.post(`/${OPERATOR_BASE_ROUTE}/staffRegister`,data)
    return response.data
}

export const getStaffs = async (params : {
    page : number,
    limit : number,
    search : string ,
    sortBy : string,
    sortOrder : 'asc' | 'desc'
}) => {
    const response = await opperatorApi.get(`/${OPERATOR_BASE_ROUTE}/getStaffs`,{params})
    // console.log(response)
    return response.data
}


export const getSignedDocmunetUrl = async( objectKey: string) =>{
    const response = await opperatorApi.get(`/${OPERATOR_BASE_ROUTE}/document`,{params:{objectKey}})
    return response.data
}  

export const editStaff = async (staffId : string , data : FormData) => {
    const response = await opperatorApi.patch(`/${OPERATOR_BASE_ROUTE}/editStaff/${staffId}`,data)
    return response.data
}