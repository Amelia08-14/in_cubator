import { NextResponse } from "next/server";
import { StatutAcces } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireRole, successResponse, errorResponse } from "@/lib/api-utils";
import * as z from "zod";


const UpdateAccesSchema = z.object({
  statut: z.enum(['DEMANDE', 'ACCORDE', 'REFUSE', 'REVOQUE']),
});

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const { session, error } = await requireRole(['PORTEUR_STARTUP']);
    if (error) return error;

    const startupProfile = await prisma.startupProfile.findUnique({ where: { userId: session!.user.id } });
    if (!startupProfile) {
      return errorResponse('FORBIDDEN', 'Accès non autorisé', undefined, 403);
    }

    const data = await request.json();
    const parsedData = UpdateAccesSchema.safeParse(data);

    if (!parsedData.success) {
      return errorResponse('VALIDATION_ERROR', 'Données invalides', parsedData.error.flatten().fieldErrors, 400);
    }

    const { statut } = parsedData.data;

    const acces = await prisma.accesDealRoom.findUnique({
      where: { id },
    });

    if (!acces || acces.startupId !== startupProfile.id) {
      return errorResponse('NOT_FOUND', 'Demande introuvable ou accès refusé', undefined, 404);
    }

    const updatedAcces = await prisma.$transaction(async (tx) => {
      const updated = await tx.accesDealRoom.update({
        where: { id },
        data: { statut }
      });

      // Log the action to AuditLog for security/IP reasons
      await tx.auditLog.create({
        data: {
          userId: session!.user.id,
          action: `DEALROOM_ACCES_${statut}`,
          entite: 'AccesDealRoom',
          entiteId: id,
          meta: JSON.stringify({ investisseurId: acces.investisseurId, startupId: acces.startupId })
        }
      });

      return updated;
    });

    return successResponse(updatedAcces);
  } catch (error: any) {
    return errorResponse('SERVER_ERROR', error.message || 'Erreur interne', undefined, 500);
  }
}
