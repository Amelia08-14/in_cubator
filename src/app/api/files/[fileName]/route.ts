import { readFile } from "fs/promises";
import path from "path";

import { prisma } from "@/lib/prisma";
import { errorResponse, requireRole } from "@/lib/api-utils";
import { getPrivateStorageDirectory } from "@/lib/private-storage";

const SAFE_FILE_NAME = /^[a-zA-Z0-9_-]+\.(pdf|docx|xlsx|jpe?g|png|webp)$/;

const CONTENT_TYPES: Record<string, string> = {
  ".pdf": "application/pdf",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

export async function GET(
  _request: Request,
  context: { params: Promise<{ fileName: string }> },
) {
  const { session, error } = await requireRole([
    "PORTEUR_STARTUP",
    "INVESTISSEUR",
    "ADMIN",
    "GESTIONNAIRE",
  ]);
  if (error) return error;

  const { fileName } = await context.params;
  if (!SAFE_FILE_NAME.test(fileName) || path.basename(fileName) !== fileName) {
    return errorResponse("NOT_FOUND", "Fichier introuvable", undefined, 404);
  }

  const fichierUrl = `/api/files/${fileName}`;
  const document = await prisma.document.findFirst({
    where: { fichierUrl },
    select: {
      startupId: true,
      visibleInvestisseurs: true,
      startup: { select: { userId: true } },
    },
  });

  if (!document) {
    return errorResponse("NOT_FOUND", "Fichier introuvable", undefined, 404);
  }

  const role = session!.user.role;
  let authorized = role === "ADMIN" || role === "GESTIONNAIRE";

  if (role === "PORTEUR_STARTUP") {
    authorized = document.startup.userId === session!.user.id;
  } else if (role === "INVESTISSEUR" && document.visibleInvestisseurs) {
    const grant = await prisma.accesDealRoom.findFirst({
      where: {
        startupId: document.startupId,
        statut: "ACCORDE",
        investisseur: { userId: session!.user.id },
      },
      select: { id: true },
    });
    authorized = Boolean(grant);
  }

  if (!authorized) {
    return errorResponse("FORBIDDEN", "Accès au fichier refusé", undefined, 403);
  }

  try {
    const bytes = await readFile(path.join(getPrivateStorageDirectory(), fileName));
    const extension = path.extname(fileName).toLowerCase();
    const disposition = [".pdf", ".jpg", ".jpeg", ".png", ".webp"].includes(extension)
      ? "inline"
      : "attachment";

    return new Response(bytes, {
      status: 200,
      headers: {
        "Cache-Control": "private, no-store",
        "Content-Disposition": `${disposition}; filename="${fileName}"`,
        "Content-Type": CONTENT_TYPES[extension] ?? "application/octet-stream",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (readError) {
    if ((readError as NodeJS.ErrnoException).code === "ENOENT") {
      return errorResponse("NOT_FOUND", "Fichier introuvable", undefined, 404);
    }
    throw readError;
  }
}
