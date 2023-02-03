import S3 from 'aws-sdk/clients/s3';
import { NextApiRequest, NextApiResponse } from 'next';

export default function getImageFromS3(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const bucket = process.env.BUCKET_NAME;
  const key = req.query.key;
  const s3 = new S3({
    apiVersion: '2006-03-01',
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_KEY,
    region: process.env.REGION,
    signatureVersion: 'v4',
  });
  const params = { Bucket: bucket, Key: key };
  const url = s3.getSignedUrl('getObject', params);
  res.status(200).json({
    url,
  });
}
