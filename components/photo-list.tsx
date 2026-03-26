"use client";

import { useEffect, useState } from "react";

interface Photo {
  key: string;
  url: string;
}

interface PhotoListProps {
  refreshTrigger?: number;
}

export function PhotoList({ refreshTrigger = 0 }: PhotoListProps) {
  // null = 로딩 중, [] = 로드 완료(빈 목록), Photo[] = 사진 있음
  const [photos, setPhotos] = useState<Photo[] | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/photos")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(({ photos }) => {
        if (!cancelled) setPhotos(photos ?? []);
      })
      .catch((err) => {
        console.error("[PhotoList] fetch error:", err);
        if (!cancelled) setPhotos([]);
      });

    return () => {
      cancelled = true;
    };
  }, [refreshTrigger]);

  if (photos === null) {
    return (
      <p className="text-sm text-muted-foreground text-center py-16">
        불러오는 중...
      </p>
    );
  }

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
