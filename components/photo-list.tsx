"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface Photo {
  key: string;
  url: string;
}

interface PhotoListProps {
  refreshTrigger?: number;
  cols?: 1 | 2 | 3;
}

const colsClass: Record<1 | 2 | 3, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
};

export function PhotoList({ refreshTrigger = 0, cols = 3 }: PhotoListProps) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const fetchPage = useCallback((cur: string | null, reset = false) => {
    setLoading(true);
    const url = cur
      ? `/api/photos?cursor=${encodeURIComponent(cur)}`
      : "/api/photos";
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(({ photos: newPhotos, nextCursor }) => {
        setPhotos((prev) => (reset ? newPhotos : [...prev, ...newPhotos]));
        setCursor(nextCursor);
        setHasMore(nextCursor !== null);
      })
      .catch((err) => console.error("[PhotoList] fetch error:", err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchPage(null, true);
  }, [refreshTrigger, fetchPage]);

  useEffect(() => {
    if (!sentinelRef.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !loading && hasMore) {
        fetchPage(cursor);
      }
    });
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [cursor, loading, hasMore, fetchPage]);

  return (
    <div>
      {photos.length === 0 && !loading && (
        <p className="text-sm text-muted-foreground text-center py-16">
          업로드된 사진이 없습니다.
        </p>
      )}
      <div className={`grid gap-3 ${colsClass[cols]}`}>
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
      <div
        ref={sentinelRef}
        className="py-4 text-center text-sm text-muted-foreground"
      >
        {loading ? "불러오는 중..." : !hasMore ? "모두 불러왔습니다." : ""}
      </div>
    </div>
  );
}
