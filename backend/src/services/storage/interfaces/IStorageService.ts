export interface IStorageService {

    uploadFile(file: Express.Multer.File,folder:string): Promise<string>;
    
    getSignedUrl(objectKey: string): Promise<string>;


}