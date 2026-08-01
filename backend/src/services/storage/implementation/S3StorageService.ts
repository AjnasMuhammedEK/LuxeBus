import { PutObjectCommand ,DeleteObjectCommand } from "@aws-sdk/client-s3";
import s3Client from "../../../config/aws";
import { IStorageService } from "../interfaces/IStorageService";
import { v4 as uuid } from "uuid";

export class S3StorageService implements IStorageService {
    async uploadFile(file: Express.Multer.File, folder: string): Promise<string> {
        const fileName = `${folder}/${uuid()}-${file.originalname}`;
        const command = new PutObjectCommand({
            Bucket:process.env.AWS_BUCKET_NAME,
            Key:fileName,
            Body:file.buffer,
            ContentType:file.mimetype
        })
        await s3Client.send(command)
         return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
    }
}