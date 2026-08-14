import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole, successResponse, errorResponse } from "@/lib/api-utils";
import * as z from "zod";


const DisponibiliteSchema = z.object({
  dateDebut: z.string().datetime(),
  dateFin: z.string().datetime(),
});

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { session, error } = await requireRole(['MENTOR_EXPERT', 'GESTIONNAIRE', 'ADMIN']);
    if (error) return error;

    const { id } = await params;

    if (session!.user.role === 'MENTOR_EXPERT') {
      const mentorProfile = await prisma.mentorProfile.findUnique({ where: { userId: session!.user.id } });
      if (!mentorProfile || mentorProfile.id !== id) {
        return errorResponse('FORBIDDEN', 'Accès non autorisé', undefined, 403);
      }
    }

    const data = await request.json();
    const parsedData = DisponibiliteSchema.safeParse(data);

    if (!parsedData.success) {
      return errorResponse('VALIDATION_ERROR', 'Données invalides', parsedData.error.flatten().fieldErrors, 400);
    }

    const disponibilite = await prisma.disponibilite.create({
      data: {
        ...parsedData.data,
        mentorId: id,
      }
    });

    return successResponse(disponibilite, undefined, 201);
  } catch (error: any) {
    return errorResponse('SERVER_ERROR', error.message || 'Erreur interne', undefined, 500);
  }
}
