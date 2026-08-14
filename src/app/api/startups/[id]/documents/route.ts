import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole, successResponse, errorResponse } from "@/lib/api-utils";
import * as z from "zod";


const DocumentSchema = z.object({
  type: z.enum(['PITCH_DECK', 'BUSINESS_PLAN', 'KPI_REPORT', 'FINANCIER', 'CANDIDATURE', 'AUTRE']),
  fichierUrl: z.string(),
  visibleInvestisseurs: z.boolean().optional().default(false),
});

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  try {
    const { session, error } = await requireRole(['PORTEUR_STARTUP', 'ADMIN', 'GESTIONNAIRE']);
    if (error) return error;

    if (session!.user.role === 'PORTEUR_STARTUP') {
      const startupProfile = await prisma.startupProfile.findUnique({ where: { userId: session!.user.id } });
      if (!startupProfile || startupProfile.id !== id) {
        return errorResponse('FORBIDDEN', 'Accès non autorisé', undefined, 403);
      }
    }

    const data = await request.json();
    const parsedData = DocumentSchema.safeParse(data);

    if (!parsedData.success) {
      return errorResponse('VALIDATION_ERROR', 'Données invalides', parsedData.error.flatten().fieldErrors, 400);
    }

    const document = await prisma.document.create({
      data: {
        ...parsedData.data,
        startupId: id,
        uploadeParId: session!.user.id,
      }
    });

    return successResponse(document, undefined, 201);
  } catch (error: any) {
    return errorResponse('SERVER_ERROR', error.message || 'Erreur interne', undefined, 500);
  }
}
