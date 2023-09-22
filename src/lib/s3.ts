import AWS from "aws-sdk";

const { S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY, S3_BUCKET_NAME, S3_REGION } =
  process.env;

export async function uploadToS3(file: File) {
  if (
    !S3_ACCESS_KEY_ID ||
    !S3_SECRET_ACCESS_KEY ||
    !S3_BUCKET_NAME ||
    !S3_REGION
  ) {
    console.error("Error: Missing AWS configuration environment variables");
    throw new Error("AWS configuration error");
  }

  try {
    AWS.config.update({
      accessKeyId: S3_ACCESS_KEY_ID,
      secretAccessKey: S3_SECRET_ACCESS_KEY,
    });

    const s3 = new AWS.S3({
      params: {
        Bucket: S3_BUCKET_NAME,
      },
      region: S3_REGION,
    });

    const file_key =
      "uploads/" + Date.now().toString() + file.name.replace(/ /g, "-");

    const params = {
      Bucket: S3_BUCKET_NAME,
      Key: file_key,
      Body: file,
    };

    await s3
      .putObject(params)
      .on("httpUploadProgress", (evt) => {
        console.log(
          "Uploading to S3...",
          parseInt(((evt.loaded * 100) / evt.total).toString()) + "%"
        );
      })
      .promise();

    console.log("Successfully uploaded to S3!");

    return {
      file_key,
      file_name: file.name,
    };
  } catch (error) {
    console.error("Error uploading to S3:", error);
    throw new Error("Failed to upload to S3");
  }
}

export function getS3URL(file_key: string) {
  if (!S3_BUCKET_NAME || !S3_REGION) {
    console.error("Error: Missing AWS configuration for generating S3 URL");
    throw new Error("AWS configuration error");
  }
  return `https://${S3_BUCKET_NAME}.s3.${S3_REGION}.amazonaws.com/${file_key}`;
}
