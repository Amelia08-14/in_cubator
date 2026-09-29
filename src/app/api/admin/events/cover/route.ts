import crypto from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

import { errorResponse, requireRole, successResponse } from "@/lib/api-utils";
import { EVENT_MEDIA_PREFIX, getPublicMediaDirectory } from "@/lib/public-media";

const MAX_SIZE = 5 * 1024 * 1024;

const TYPES: Record<string, { extension: string; matches: (b: Buffer) => boolean }> = {
  "image/jpeg": {
    extension: ".jpg",
    matches: (b) => b.length >= 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff,
  },
  "image/png": {
    extension: ".png",
    matches: (b) => b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])),
  },
  "image/webp": {
    extension: ".webp",
    matches: (b) => b.subarray(0, 4).toString() === "RIFF" && b.subarray(8, 12).toString() === "WEBP",
  },
};

// Envoi de l'image de couverture d'un évènement (réservé à l'équipe).
export async function POST(request: Request) {
  try {
    const { error } = await requireRole(["ADMIN", "GESTIONNAIRE"]);
    if (error) return error;

    const file = (await request.formData()).get("file");
    if (!(file instanceof File)) {
      return errorResponse("BAD_REQUEST", "Aucune image n'a été fournie.", undefined, 400);
    }
    if (file.size <= 0 || file.size > MAX_SIZE) {
      return errorResponse("PAYLOAD_TOO_LARGE", "L'image doit faire moins de 5 Mo.", undefined, 413);
    }

    const type = TYPES[file.type];
    const buffer = Buffer.from(await file.arrayBuffer());
    if (!type || !type.matches(buffer)) {
      return errorResponse("UNSUPPORTED_MEDIA_TYPE", "Formats acceptés : JPG, PNG ou WebP.", undefined, 415);
    }

    // Le nom est généré : rien de ce que l'utilisateur envoie n'entre dans le chemin.
    const fileName = `${crypto.randomBytes(12).toString("hex")}${type.extension}`;
    const directory = path.join(getPublicMediaDirectory(), "events");
    await mkdir(directory, { recursive: true });
    await writeFile(path.join(directory, fileName), buffer);

    return successResponse({ url: `${EVENT_MEDIA_PREFIX}${fileName}` }, undefined, 201);
  } catch (error) {
    console.error("Event cover upload error:", error);
    return errorResponse("SERVER_ERROR", "L'image n'a pas pu être enregistrée.", undefined, 500);
  }
}
