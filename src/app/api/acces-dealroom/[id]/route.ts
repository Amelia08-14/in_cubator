import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole, successResponse, errorResponse } from "@/lib/api-utils";
import * as z from "zod";


const UpdateAccessSchema = z.object({
  statut: z.enum(['ACCORDE', 'REFUSE', 'REVOQUE']),
});

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { session, error } = await requireRole(['PORTEUR_STARTUP']);
    if (error) return error;

    const data = await request.json();
    const parsedData = UpdateAccessSchema.safeParse(data);

    if (!parsedData.success) {
      return errorResponse('VALIDATION_ERROR', 'Données invalides', parsedData.error.flatten().fieldErrors, 400);
    }

    const { id } = await params;

    const access = await prisma.accesDealRoom.findUnique({
      where: { id }
    });

    if (!access) {
      return errorResponse('NOT_FOUND', 'Demande introuvable', undefined, 404);
    }

    const startup = await prisma.startupProfile.findUnique({
      where: { userId: session!.user.id }
    });

    if (!startup || access.startupId !== startup.id) {
      return errorResponse('FORBIDDEN', 'Accès non autorisé', undefined, 403);
    }

    const updated = await prisma.accesDealRoom.update({
      where: { id },
      data: {
        statut: parsedData.data.statut,
        accordeParId: session!.user.id,
        dateAcces: parsedData.data.statut === 'ACCORDE' ? new Date() : null,
      }
    });

    return successResponse(updated);
  } catch (error: any) {
    return errorResponse('SERVER_ERROR', error.message || 'Erreur interne', undefined, 500);
  }
}
