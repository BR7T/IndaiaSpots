import AWS, { S3 } from 'aws-sdk';

require('dotenv').config();
const s3 = new AWS.S3();

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

export function uploadToS3(file, res) {
    const params = {
        Bucket: 'imagesindaiastpots',
        Key: `uploads/${file.originalname}`, 
        Body: file.buffer,
        ContentType: file.mimetype, 
        ACL: 'public-read' 
    };

    s3.upload(params, function(err, data) {
        if(err) {
            res.send(500).send(err);
        }
        else {
            res.send(`Arquivo enviado com sucesso: ${data.Location}`);
        }
    })
}