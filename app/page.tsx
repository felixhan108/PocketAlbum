import { Suspense } from "react";
import { UploadButton } from "@/components/upload-button";
import { PhotoList } from "@/components/photo-list";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col gap-6 py-16 px-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Pocket Album</h1>
          <UploadButton />
        </div>
        <Suspense
          fallback={
            <p className="text-sm text-muted-foreground text-center py-16">
              불러오는 중...
            </p>
          }
        >
          <PhotoList />
        </Suspense>
      </main>
    </div>
  );
}
