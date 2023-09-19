import AWS from "aws-sdk";
import fs from "fs";

export default async function downloadFromS3(file_key: string) {
  try {
    AWS.config.update({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });

    const s3 = new AWS.S3({
      params: { Bucket: process.env.AWS_BUCKET_NAME },
      region: process.env.AWS_REGION,
    });
    const params = {
      Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME ?? "",
      Key: file_key,
    };

    const obj = await s3.getObject(params).promise();
    if (!obj.Body) {
      throw new Error("Empty response from S3 getObject");
    }
    const file_name = `/tmp/pdf-${Date.now()}.pdf`;
    fs.writeFileSync(file_name, obj.Body as Buffer);
    return file_name;
  } catch (error) {
    console.error(error);
    return error;
  }
}
