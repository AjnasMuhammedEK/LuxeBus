import { Express } from "express";

export interface IStorageService {

    uploadFile(
        file: Express.Multer.File,
        folder:string
    ): Promise<string>;

    // deleteFile(
    //     key:string
    // ): Promise<void>;

}