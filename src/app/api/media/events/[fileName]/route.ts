import { readFile } from "fs/promises";
import path from "path";

import { getPublicMediaDirectory } from "@/lib/public-media";

// Noms générés par l'envoi de couverture : 24 caractères hexadécimaux + extension.
const SAFE_FILE_NAME = /^[a-f0-9]{24}\.(jpg|png|webp)$/;

const CONTENT_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

// Images de couverture des évènements : publiques, comme les évènements eux-mêmes.
export async function GET(_request: Request, context: { params: Promise<{ fileName: string }> }) {
  const { fileName } = await context.params;
  if (!SAFE_FILE_NAME.test(fileName)) {
    return new Response("Not found", { status: 404 });
  }

  try {
    const buffer = await readFile(path.join(getPublicMediaDirectory(), "events", fileName));
    return new Response(new Uint8Array(buffer), {
      headers: {
        "Content-Type": CONTENT_TYPES[path.extname(fileName)] ?? "application/octet-stream",
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
