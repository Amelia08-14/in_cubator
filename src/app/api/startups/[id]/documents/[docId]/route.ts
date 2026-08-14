import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole, successResponse, errorResponse } from "@/lib/api-utils";
import * as z from "zod";


const UpdateDocumentSchema = z.object({
  visibleInvestisseurs: z.boolean(),
});

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string; docId: string }> }
) {
  try {
    const { id, docId } = await context.params;
    const { session, error } = await requireRole(['PORTEUR_STARTUP']);
    if (error) return error;

    const startupProfile = await prisma.startupProfile.findUnique({ where: { userId: session!.user.id } });
    if (!startupProfile || startupProfile.id !== id) {
      return errorResponse('FORBIDDEN', 'Accès non autorisé', undefined, 403);
    }

    const data = await request.json();
    const parsedData = UpdateDocumentSchema.safeParse(data);

    if (!parsedData.success) {
      return errorResponse('VALIDATION_ERROR', 'Données invalides', parsedData.error.flatten().fieldErrors, 400);
    }

    const { visibleInvestisseurs } = parsedData.data;

    const doc = await prisma.document.findFirst({
      where: {
        id: docId,
        startupId: id,
      }
    });

    if (!doc) {
      return errorResponse('NOT_FOUND', 'Document introuvable', undefined, 404);
    }

    const updatedDoc = await prisma.document.update({
      where: { id: docId },
      data: { visibleInvestisseurs }
    });

    return successResponse(updatedDoc);
  } catch (error: any) {
    return errorResponse('SERVER_ERROR', error.message || 'Erreur interne', undefined, 500);
  }
}
