import { NextResponse } from "next/server";
import { requireRole, successResponse, errorResponse } from "@/lib/api-utils";
import { prisma } from "@/lib/prisma";
import { z } from "zod";


const UpdateObjectifSchema = z.object({
  statut: z.enum(['A_FAIRE', 'EN_COURS', 'TERMINE', 'EN_RETARD']),
});

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string; objectifId: string }> }
) {
  try {
    const { session, error } = await requireRole(['PORTEUR_STARTUP', 'ADMIN', 'GESTIONNAIRE']);
    if (error) return error;

    const { id, objectifId } = await context.params;

    // Verify ownership if PORTEUR_STARTUP
    if (session!.user.role === 'PORTEUR_STARTUP') {
      const profile = await prisma.startupProfile.findUnique({
        where: { userId: session!.user.id },
      });
      if (!profile || profile.id !== id) {
        return errorResponse("FORBIDDEN", "Vous n'avez pas accès à ces données.", undefined, 403);
      }
    }

    const body = await request.json();
    const parsedData = UpdateObjectifSchema.safeParse(body);

    if (!parsedData.success) {
      return errorResponse("VALIDATION_ERROR", "Données invalides", undefined, 400);
    }

    const objectif = await prisma.objectif.update({
      where: {
        id: objectifId,
        startupId: id, // Ensure it belongs to the right startup
      },
      data: parsedData.data,
    });

    return successResponse(objectif);
  } catch (error: any) {
    if (error.code === 'P2025') {
      return errorResponse("NOT_FOUND", "Objectif non trouvé", undefined, 404);
    }
    return errorResponse("SERVER_ERROR", error.message || "Erreur interne", undefined, 500);
  }
}
