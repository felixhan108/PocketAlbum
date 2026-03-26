import { ListObjectsV2Command } from "@aws-sdk/client-s3";
import { r2 } from "@/lib/r2";
import { getDownloadUrl } from "@/lib/presigned";

const BUCKET = process.env.R2_BUCKET_NAME!;

interface Photo {
  key: string;
  url: string;
  lastModified?: Date;
}

async function getPhotos(): Promise<Photo[]> {
  const result = await r2.send(
    new ListObjectsV2Command({ Bucket: BUCKET, Prefix: "photos/" })
  );

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

  return photos.sort(
    (a, b) => (b.lastModified?.getTime() ?? 0) - (a.lastModified?.getTime() ?? 0)
  );
}

export async function PhotoList() {
  const photos = await getPhotos();

  if (photos.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-16">
        업로드된 사진이 없습니다.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
      {photos.map((photo) => (
        <div
          key={photo.key}
          className="aspect-square overflow-hidden rounded-lg bg-muted"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photo.url}
            alt={photo.key.split("/").pop() ?? "photo"}
            className="h-full w-full object-cover"
          />
        </div>
      ))}
    </div>
  );
}
