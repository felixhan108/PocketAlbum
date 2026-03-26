"use client";

import { useState } from "react";
import { UploadButton } from "@/components/upload-button";
import { PhotoList } from "@/components/photo-list";
import { Option } from "./option";

export function AlbumView() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [cols, setCols] = useState<1 | 2 | 3>(1);

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Pocket Album</h1>
        <UploadButton
          onUploadComplete={() => setRefreshTrigger((n) => n + 1)}
        />
      </div>
      <div>
        <Option cols={cols} onColsChange={setCols} />
      </div>
      <PhotoList refreshTrigger={refreshTrigger} cols={cols} />
    </>
  );
}
