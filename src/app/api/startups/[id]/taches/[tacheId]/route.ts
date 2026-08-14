import { NextResponse } from "next/server";
import { StatutObjectif } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireRole, successResponse, errorResponse } from "@/lib/api-utils";
import * as z from "zod";


const UpdateTacheSchema = z.object({
  statut: z.enum(['A_FAIRE', 'EN_COURS', 'TERMINE', 'EN_RETARD']),
});

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string; tacheId: string }> }
) {
  try {
    const { id, tacheId } = await context.params;
    const { session, error } = await requireRole(['PORTEUR_STARTUP', 'GESTIONNAIRE', 'ADMIN']);
    if (error) return error;

    // Verify ownership if startup
    if (session!.user.role === 'PORTEUR_STARTUP') {
      const startupProfile = await prisma.startupProfile.findUnique({ where: { userId: session!.user.id } });
      if (!startupProfile || startupProfile.id !== id) {
        return errorResponse('FORBIDDEN', 'Accès non autorisé', undefined, 403);
      }
    }

    const data = await request.json();
    const parsedData = UpdateTacheSchema.safeParse(data);

    if (!parsedData.success) {
      return errorResponse('VALIDATION_ERROR', 'Données invalides', parsedData.error.flatten().fieldErrors, 400);
    }

    const { statut } = parsedData.data;

    // Verify the task exists and belongs to the startup
    const tache = await prisma.tache.findFirst({
      where: {
        id: tacheId,
        startupId: id,
      }
    });

    if (!tache) {
      return errorResponse('NOT_FOUND', 'Tâche introuvable', undefined, 404);
    }

    const updatedTache = await prisma.tache.update({
      where: { id: tacheId },
      data: { statut }
    });

    return successResponse(updatedTache);
  } catch (error: any) {
    return errorResponse('SERVER_ERROR', error.message || 'Erreur interne', undefined, 500);
  }
}
