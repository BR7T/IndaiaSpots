import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import * as dotenv from "dotenv";
import { Request, Response, NextFunction } from 'express';
dotenv.config();

const bucketName = 'imagesindaiastpots';

const s3Client = new S3Client({
    region: "sa-east-1",
})

export async function generateSignedUrl(req: Request, res: Response, next: NextFunction) {
    const command = new PutObjectCommand({
        Bucket : bucketName,
        Key : req.body.file.filename
    })
    
    const signedUrl = await getSignedUrl(s3Client, command, {
        expiresIn : req.body.file.expirationTime
    })
    res.send({signedUrl : signedUrl});
}



