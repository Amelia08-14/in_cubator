import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole, successResponse, errorResponse } from "@/lib/api-utils";
import * as z from "zod";


const DecisionCandidatureSchema = z.object({
  statut: z.enum(['ENTRETIEN_PLANIFIE', 'ACCEPTEE', 'LISTE_ATTENTE', 'REFUSEE']),
  score: z.number().min(0).max(100).optional(),
  motifDecision: z.string().min(10).optional(), 
});

export async function GET(request: Request, context: { params: Promise<{ id: string }> | { id: string } }) {
  try {
    const params = await context.params;
    const { session, error } = await requireRole(['PORTEUR_STARTUP', 'GESTIONNAIRE', 'ADMIN']);
    if (error) return error;

    const candidature = await prisma.candidature.findUnique({
      where: { id: params.id },
      include: {
        startup: true,
        cohorte: true,
      }
    });

    if (!candidature) {
      return errorResponse('NOT_FOUND', 'Candidature introuvable', undefined, 404);
    }

    // Check ownership if it's a startup
    if (session!.user.role === 'PORTEUR_STARTUP') {
      const startupProfile = await prisma.startupProfile.findUnique({
        where: { userId: session!.user.id }
      });
      if (!startupProfile || candidature.startupId !== startupProfile.id) {
        return errorResponse('FORBIDDEN', 'Accès non autorisé', undefined, 403);
      }
    }

    return successResponse(candidature);
  } catch (error: any) {
    return errorResponse('SERVER_ERROR', error.message || 'Erreur interne', undefined, 500);
  }
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> | { id: string } }) {
  try {
    const params = await context.params;
    const { session, error } = await requireRole(['GESTIONNAIRE', 'ADMIN']);
    if (error) return error;

    const data = await request.json();
    const parsedData = DecisionCandidatureSchema.safeParse(data);

    if (!parsedData.success) {
      return errorResponse('VALIDATION_ERROR', 'Données invalides', parsedData.error.flatten().fieldErrors, 400);
    }

    if (parsedData.data.statut === 'REFUSEE' && !parsedData.data.motifDecision) {
      return errorResponse('VALIDATION_ERROR', 'Motif requis en cas de refus', { motifDecision: 'Requis' }, 400);
    }

    const updatedCandidature = await prisma.candidature.update({
      where: { id: params.id },
      data: {
        statut: parsedData.data.statut,
        score: parsedData.data.score,
        motifDecision: parsedData.data.motifDecision,
        evaluateurId: session!.user.id,
        dateDecision: new Date(),
      }
    });

    await prisma.auditLog.create({
      data: {
        userId: session!.user.id,
        action: 'CANDIDATURE_DECISION',
        entite: 'Candidature',
        entiteId: params.id,
        meta: { newStatus: parsedData.data.statut }
      }
    });

    return successResponse(updatedCandidature);
  } catch (error: any) {
    console.error("Internal Server Error in PATCH /api/candidatures/[id]:", error);
    return errorResponse('SERVER_ERROR', error.message || 'Erreur interne', undefined, 500);
  }
}
