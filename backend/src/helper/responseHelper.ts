import { ICommonResponse } from "../types/commonResponse";

export const createResponse = <T>(success:boolean,  message:string,data:T|null) :ICommonResponse<T> => {
    return {
        success,
        message,
        data
    }
}