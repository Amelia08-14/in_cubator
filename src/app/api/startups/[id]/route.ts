import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole, successResponse, errorResponse } from "@/lib/api-utils";


export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { session, error } = await requireRole(['PORTEUR_STARTUP', 'GESTIONNAIRE', 'ADMIN', 'INVESTISSEUR', 'MENTOR_EXPERT']);
    if (error) return error;

    const { id } = await params;

    const startup = await prisma.startupProfile.findUnique({
      where: { id },
      include: {
        membres: true,
      }
    });

    if (!startup) {
      return errorResponse('NOT_FOUND', 'Startup introuvable', undefined, 404);
    }

    return successResponse(startup);
  } catch (error: any) {
    return errorResponse('SERVER_ERROR', error.message || 'Erreur interne', undefined, 500);
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { session, error } = await requireRole(['PORTEUR_STARTUP', 'GESTIONNAIRE', 'ADMIN']);
    if (error) return error;

    const data = await request.json();
    const { id } = await params;

    // Verify ownership
    if (session!.user.role === 'PORTEUR_STARTUP') {
      const existing = await prisma.startupProfile.findUnique({ where: { id } });
      if (!existing || existing.userId !== session!.user.id) {
        return errorResponse('FORBIDDEN', 'Accès non autorisé', undefined, 403);
      }
    }

    const updatedStartup = await prisma.startupProfile.update({
      where: { id },
      data: {
        nom: data.nom,
        description: data.description,
        pitchResume: data.pitchResume,
        siteWeb: data.siteWeb,
        visiblePublic: data.visiblePublic,
      }
    });

    return successResponse(updatedStartup);
  } catch (error: any) {
    return errorResponse('SERVER_ERROR', error.message || 'Erreur interne', undefined, 500);
  }
}
