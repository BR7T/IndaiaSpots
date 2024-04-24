import AWS from 'aws-sdk';

import * as dotenv from "dotenv";
dotenv.config();
const s3 = new AWS.S3();

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

export function uploadToS3(filename,res) {
    const params = {
        Bucket: 'imagesindaiastpots',
        Key: filename,
        ACL: 'public-read',
        Expires : 60,
        ContentType: 'image/jpeg',
        Conditions: [
            ['content-length-range', 0, 3,145,728] 
        ]
    };

    s3.getSignedUrl('putObject', params, (err, url) => {
        if (err) {
          console.log(err);
        }
        res.json({ signedUrl: url });
    });
}