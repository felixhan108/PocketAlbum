"use client";

import { useRouter } from "next/navigation";
import { UploadButton } from "@/components/upload-button";

export function AlbumView({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Pocket Album</h1>
        <UploadButton onUploadComplete={() => router.refresh()} />
      </div>
      {children}
    </>
  );
}
