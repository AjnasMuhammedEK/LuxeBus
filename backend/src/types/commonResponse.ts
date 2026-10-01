export interface ICommonResponse<T> {
    success:boolean,
    message: string,
    data : T | null
}