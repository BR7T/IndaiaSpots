import {
  S3Client,
  GetObjectCommand,
  PutObjectAclCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import * as dotenv from "dotenv";
dotenv.config();

const bucketName = "imagesindaiastpots";

const s3Client = new S3Client({
  region: "sa-east-1",
});

export async function generateSignedUrl(key, expiresIn, res) {
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
  });

  const signedUrl = await getSignedUrl(s3Client, command, {
    expiresIn: expiresIn,
  });
  res.send({ signedUrl: signedUrl });
}
