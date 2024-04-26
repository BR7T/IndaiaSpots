import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Readable } from 'stream';

import * as dotenv from "dotenv";
dotenv.config();

const s3Client = new S3Client({
    region: "sa-east-1",
})

const bucketName = 'imagesindaiastpots';

export async function generateSignedUrl(key, expiresIn, res) {
    const command = new GetObjectCommand({
        Bucket : bucketName,
        Key : key
    })
    
    const signedUrl = getSignedUrl(s3Client, command, {
        expiresIn : expiresIn
    })
    res.send({signedUrl : signedUrl});
}



