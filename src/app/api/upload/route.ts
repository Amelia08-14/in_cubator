import { NextResponse } from "next/server";
import { requireRole, successResponse, errorResponse } from "@/lib/api-utils";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const { session, error } = await requireRole(['PORTEUR_STARTUP', 'ADMIN', 'GESTIONNAIRE']);
    if (error) return error;

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return errorResponse("BAD_REQUEST", "Aucun fichier n'a été fourni.", undefined, 400);
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate a unique filename
    const uniqueSuffix = crypto.randomBytes(8).toString('hex');
    const extension = path.extname(file.name);
    const fileName = `${path.basename(file.name, extension)}_${uniqueSuffix}${extension}`;

    // Upload to simulated S3 (local public folder for MVP)
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    
    // Ensure the directory exists
    await mkdir(uploadDir, { recursive: true });
    
    const filePath = path.join(uploadDir, fileName);
    
    await writeFile(filePath, buffer);
    const fileUrl = `/uploads/${fileName}`;

    return successResponse({ url: fileUrl });
  } catch (error: any) {
    console.error("Upload error:", error);
    return errorResponse("SERVER_ERROR", error.message || "Erreur interne lors de l'upload.", undefined, 500);
  }
}
