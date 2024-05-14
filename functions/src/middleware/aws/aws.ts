import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';


import * as dotenv from "dotenv";
import { Response, NextFunction } from 'express';
dotenv.config();

const bucketName = 'imagesindaiastpots';

const s3Client = new S3Client({
    region: "sa-east-1",
})

export async function generateSignedUrl(req: { file: { key: any; expirationTime: any; }; }, res: Response, next: NextFunction) {
    const command = new PutObjectCommand({
        Bucket : bucketName,
        Key : req.file.key
    })
    
    const signedUrl = await getSignedUrl(s3Client, command, {
        expiresIn : req.file.expirationTime
    })
    res.send({signedUrl : signedUrl});
}



