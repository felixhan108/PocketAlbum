interface Photo {
  key: string;
  url: string;
  lastModified?: string;
}

async function getPhotos(): Promise<Photo[]> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/photos`, { cache: "no-store" });
  if (!res.ok) return [];
  const { photos } = await res.json();
  return photos;
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
