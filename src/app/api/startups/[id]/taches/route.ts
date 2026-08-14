import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole, successResponse, errorResponse } from "@/lib/api-utils";
import * as z from "zod";


const TacheSchema = z.object({
  titre: z.string().min(2),
  objectifId: z.string().cuid().optional(),
  dateEcheance: z.string().datetime().optional(),
  assigneA: z.string().cuid().optional(),
});

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { session, error } = await requireRole(['PORTEUR_STARTUP', 'GESTIONNAIRE', 'ADMIN']);
    if (error) return error;

    const { id } = await params;

    // Verify ownership
    if (session!.user.role === 'PORTEUR_STARTUP') {
      const startupProfile = await prisma.startupProfile.findUnique({ where: { userId: session!.user.id } });
      if (!startupProfile || startupProfile.id !== id) {
        return errorResponse('FORBIDDEN', 'Accès non autorisé', undefined, 403);
      }
    }

    const data = await request.json();
    const parsedData = TacheSchema.safeParse(data);

    if (!parsedData.success) {
      return errorResponse('VALIDATION_ERROR', 'Données invalides', parsedData.error.flatten().fieldErrors, 400);
    }

    const tache = await prisma.tache.create({
      data: {
        ...parsedData.data,
        startupId: id,
        creePar: session!.user.id,
      }
    });

    return successResponse(tache, undefined, 201);
  } catch (error: any) {
    return errorResponse('SERVER_ERROR', error.message || 'Erreur interne', undefined, 500);
  }
}
