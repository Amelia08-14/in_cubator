import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole, successResponse, errorResponse } from "@/lib/api-utils";


export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { session, error } = await requireRole(['PORTEUR_STARTUP', 'GESTIONNAIRE', 'ADMIN']);
    if (error) return error;

    const { id } = await params;

    const candidature = await prisma.candidature.findUnique({
      where: { id },
      include: {
        startup: true,
        cohorte: true,
      }
    });

    if (!candidature) {
      return errorResponse('NOT_FOUND', 'Candidature introuvable', undefined, 404);
    }

    if (session!.user.role === 'PORTEUR_STARTUP') {
      const startupProfile = await prisma.startupProfile.findUnique({
        where: { userId: session!.user.id }
      });
      if (!startupProfile || candidature.startupId !== startupProfile.id) {
        return errorResponse('FORBIDDEN', 'Accès non autorisé', undefined, 403);
      }
    }

    if (!candidature.rapportPdfUrl) {
      return errorResponse('NOT_FOUND', 'Le rapport n\'a pas encore été généré', undefined, 404);
    }

    // In a real application, you might redirect to a signed S3 URL here,
    // but for now, we just return the URL or mock response.
    return successResponse({ url: candidature.rapportPdfUrl });
  } catch (error: any) {
    return errorResponse('SERVER_ERROR', error.message || 'Erreur interne', undefined, 500);
  }
}
