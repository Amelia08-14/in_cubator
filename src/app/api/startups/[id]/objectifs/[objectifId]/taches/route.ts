import { NextResponse } from "next/server";
import { StatutObjectif } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireRole, successResponse, errorResponse } from "@/lib/api-utils";
import * as z from "zod";


const TacheSchema = z.object({
  titre: z.string().min(2),
  dateEcheance: z.string().datetime().optional(),
});

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string, objectifId: string }> }
) {
  try {
    const { id, objectifId } = await context.params;
    const { session, error } = await requireRole(['GESTIONNAIRE', 'ADMIN']);
    if (error) return error;

    const data = await request.json();
    const parsedData = TacheSchema.safeParse(data);

    if (!parsedData.success) {
      return errorResponse('VALIDATION_ERROR', 'Données invalides', parsedData.error.flatten().fieldErrors, 400);
    }

    // Verify objective belongs to startup
    const objectif = await prisma.objectif.findUnique({
      where: { id: objectifId }
    });

    if (!objectif || objectif.startupId !== id) {
      return errorResponse('NOT_FOUND', 'Objectif introuvable', undefined, 404);
    }

    const tache = await prisma.tache.create({
      data: {
        titre: parsedData.data.titre,
        dateEcheance: parsedData.data.dateEcheance,
        statut: StatutObjectif.A_FAIRE,
        startupId: id,
        objectifId: objectifId,
        creePar: session!.user.id,
      }
    });

    return successResponse(tache, undefined, 201);
  } catch (error: any) {
    return errorResponse('SERVER_ERROR', error.message || 'Erreur interne', undefined, 500);
  }
}
