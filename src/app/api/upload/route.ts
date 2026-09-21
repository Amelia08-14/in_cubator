import { requireRole, successResponse, errorResponse } from "@/lib/api-utils";
import { getPrivateStorageDirectory } from "@/lib/private-storage";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";

const MAX_UPLOAD_SIZE = 10 * 1024 * 1024;
const ALLOWED_MIME_TYPES = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "image/jpeg",
  "image/png",
  "image/webp",
]);

const ALLOWED_EXTENSIONS: Record<string, ReadonlySet<string>> = {
  "application/pdf": new Set([".pdf"]),
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": new Set([".docx"]),
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": new Set([".xlsx"]),
  "image/jpeg": new Set([".jpg", ".jpeg"]),
  "image/png": new Set([".png"]),
  "image/webp": new Set([".webp"]),
};

function hasExpectedSignature(mimeType: string, buffer: Buffer) {
  if (mimeType === "application/pdf") return buffer.subarray(0, 5).toString() === "%PDF-";
  if (mimeType === "image/jpeg") {
    return buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  }
  if (mimeType === "image/png") {
    return buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  }
  if (mimeType === "image/webp") {
    return buffer.subarray(0, 4).toString() === "RIFF" && buffer.subarray(8, 12).toString() === "WEBP";
  }

  // DOCX and XLSX are ZIP containers. Antivirus remains required before production.
  return buffer.subarray(0, 4).equals(Buffer.from([0x50, 0x4b, 0x03, 0x04]));
}

export async function POST(request: Request) {
  try {
    const { error } = await requireRole(['PORTEUR_STARTUP', 'ADMIN', 'GESTIONNAIRE']);
    if (error) return error;

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return errorResponse("BAD_REQUEST", "Aucun fichier n'a été fourni.", undefined, 400);
    }

    if (file.size <= 0 || file.size > MAX_UPLOAD_SIZE) {
      return errorResponse(
        "PAYLOAD_TOO_LARGE",
        "Le fichier doit faire moins de 10 Mo.",
        undefined,
        413,
      );
    }

    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      return errorResponse(
        "UNSUPPORTED_MEDIA_TYPE",
        "Ce type de fichier n'est pas autorisé.",
        undefined,
        415,
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate a unique filename
    const uniqueSuffix = crypto.randomBytes(8).toString('hex');
    const extension = path.extname(file.name).toLowerCase();
    if (!ALLOWED_EXTENSIONS[file.type]?.has(extension) || !hasExpectedSignature(file.type, buffer)) {
      return errorResponse(
        "INVALID_FILE_CONTENT",
        "L'extension ou le contenu du fichier ne correspond pas au type annoncé.",
        undefined,
        415,
      );
    }
    const safeBaseName = path
      .basename(file.name, extension)
      .normalize("NFKD")
      .replace(/[^a-zA-Z0-9_-]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80) || "document";
    const fileName = `${safeBaseName}_${uniqueSuffix}${extension}`;

    // Stockage local privé de transition. La cible reste un stockage objet privé.
    const uploadDir = getPrivateStorageDirectory();
    
    // Ensure the directory exists
    await mkdir(uploadDir, { recursive: true });
    
    const filePath = path.join(uploadDir, fileName);
    
    await writeFile(filePath, buffer);
    const fileUrl = `/api/files/${fileName}`;

    return successResponse({ url: fileUrl });
  } catch (error: unknown) {
    console.error("Upload error:", error);
    const message = error instanceof Error ? error.message : "Erreur interne lors de l'upload.";
    return errorResponse("SERVER_ERROR", message, undefined, 500);
  }
}
