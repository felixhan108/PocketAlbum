import { ListObjectsV2Command } from "@aws-sdk/client-s3";
import { r2 } from "@/lib/r2";
import { getDownloadUrl } from "@/lib/presigned";

const BUCKET = process.env.R2_BUCKET_NAME!;

export async function GET() {
  const command = new ListObjectsV2Command({
    Bucket: BUCKET,
    Prefix: "photos/",
  });

  const result = await r2.send(command);
  const objects = result.Contents ?? [];

  const photos = await Promise.all(
    objects
      .filter((obj) => obj.Key)
      .map(async (obj) => ({
        key: obj.Key!,
        url: await getDownloadUrl(obj.Key!),
        lastModified: obj.LastModified,
      }))
  );

  // 최신순 정렬
  photos.sort((a, b) =>
    (b.lastModified?.getTime() ?? 0) - (a.lastModified?.getTime() ?? 0)
  );

  return Response.json({ photos });
}
