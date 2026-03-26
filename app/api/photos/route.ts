import { ListObjectsV2Command } from "@aws-sdk/client-s3";
import { r2 } from "@/lib/r2";
import { getDownloadUrl } from "@/lib/presigned";

const BUCKET = process.env.R2_BUCKET_NAME!;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cursor = searchParams.get("cursor") ?? undefined;
  const limit = Number(searchParams.get("limit") ?? 30);

  const command = new ListObjectsV2Command({
    Bucket: BUCKET,
    Prefix: "photos/",
    MaxKeys: limit,
    ContinuationToken: cursor,
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
      })),
  );

  function getTakenAt(key: string): number {
    const filename = key.split("/")[1]; // "1771893928804-1771893928900-IMG_0001.jpg"
    return parseInt(filename.split("-")[0]);
  }

  // 최신순 정렬
  photos.sort((a, b) => getTakenAt(b.key) - getTakenAt(a.key));

  return Response.json({ photos, nextCursor: result.NextContinuationToken ?? null });
}
