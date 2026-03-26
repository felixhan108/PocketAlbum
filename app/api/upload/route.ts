import { getUploadUrl } from "@/lib/presigned";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const { filename, contentType, takenAt } = await request.json();

  if (!filename || !contentType || !takenAt) {
    return Response.json(
      { error: "filename and contentType required" },
      { status: 400 },
    );
  }

  const key = `photos/${takenAt}-${Date.now()}-${filename}`;
  const url = await getUploadUrl(key, contentType);

  return Response.json({ url, key });
}
