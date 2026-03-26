import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { r2 } from "./r2";

const BUCKET = process.env.R2_BUCKET_NAME!;

// 업로드용 presigned URL
export async function getUploadUrl(key: string, contentType: string) {
  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    ContentType: contentType,
  });

  return await getSignedUrl(r2, command, { expiresIn: 3600 }); // 1시간 유효
}

// 조회용 presigned URL
export async function getDownloadUrl(key: string) {
  const command = new GetObjectCommand({
    Bucket: BUCKET,
    Key: key,
  });

  return await getSignedUrl(r2, command, { expiresIn: 3600 }); // 1시간 유효
}

// 다운로드용 presigned URL (공개 버킷인 경우)
export function getPublicDownloadUrl(key: string) {
  return `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com/${BUCKET}/${key}`;
}
