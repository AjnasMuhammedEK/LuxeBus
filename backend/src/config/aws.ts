import dotenv from "dotenv";
dotenv.config();

import { S3Client } from "@aws-sdk/client-s3";

console.log("REGION:", process.env.AWS_REGION);
console.log("ACCESS:", process.env.AWS_ACCESS_KEY_ID);
console.log("SECRET:", process.env.AWS_SECRET_ACCESS_KEY?.substring(0, 5));

const s3Client = new S3Client({
    region:process.env.AWS_REGION,
    credentials:{
        accessKeyId:process.env.AWS_ACCESS_KEY_ID as string,
        secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY as string
    }
})
export default s3Client;