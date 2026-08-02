import { PutObjectCommand ,DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import s3Client from "../../../config/aws";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { IStorageService } from "../interfaces/IStorageService";
import { v4 as uuid } from "uuid";

export class S3StorageService implements IStorageService {
    async uploadFile(file: Express.Multer.File, folder: string): Promise<string> {
       
        const objectKey = `${folder}/${uuid()}-${file.originalname}`

        const command = new PutObjectCommand({
            Bucket:process.env.AWS_BUCKET_NAME,
            Key:objectKey,
            Body:file.buffer,
            ContentType:file.mimetype
        })

        await s3Client.send(command)
        return objectKey
    }

    async getSignedUrl(objectKey: string): Promise<string> {
        const commad = new GetObjectCommand({
            Bucket:process.env.AWS_BUCKET_NAME,
            Key:objectKey
        })
        const signedurl = await getSignedUrl(
            s3Client,
            commad,
            {expiresIn:60*5}
        )
        return signedurl
    }
}