import S3 from 'aws-sdk/clients/s3';
import { NextApiRequest, NextApiResponse } from 'next';

const s3 = new S3({
  apiVersion: '2006-03-01',
  accessKeyId: process.env.ACCESS_KEY,
  secretAccessKey: process.env.SECRET_KEY,
  region: process.env.REGION,
  signatureVersion: 'v4',
});

export default function attachImage(req: NextApiRequest, res: NextApiResponse) {
  const Key = req.query.key as string;
  const Bucket = process.env.BUCKET_NAME;
  if (Bucket) {
    const s3Params = {
      Bucket,
      Key,
    };

    const uploadUrl = s3.deleteObject(s3Params, function (err, data) {
      if (err) console.log(err, err.stack); // error
      else console.log(data); // deleted
    });

    res.status(200).json({
      uploadUrl,
      key: Key,
    });
  }
}
