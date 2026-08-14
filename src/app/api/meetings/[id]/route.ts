import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole, successResponse, errorResponse } from "@/lib/api-utils";
import * as z from "zod";


const UpdateMeetingSchema = z.object({
  statut: z.enum(['CONFIRME', 'ANNULE', 'TERMINE']).optional(),
  notes: z.string().optional(),
  noteMentorat: z.number().min(1).max(5).optional(),
});

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { session, error } = await requireRole(['PORTEUR_STARTUP', 'MENTOR_EXPERT', 'INVESTISSEUR', 'GESTIONNAIRE', 'ADMIN']);
    if (error) return error;

    const data = await request.json();
    const parsedData = UpdateMeetingSchema.safeParse(data);

    if (!parsedData.success) {
      return errorResponse('VALIDATION_ERROR', 'Données invalides', parsedData.error.flatten().fieldErrors, 400);
    }

    const { id } = await params;

    const meeting = await prisma.meeting.findUnique({
      where: { id },
      include: { disponibilite: true }
    });

    if (!meeting) {
      return errorResponse('NOT_FOUND', 'Meeting introuvable', undefined, 404);
    }

    // Verify ownership
    const userId = session!.user.id;
    const role = session!.user.role;

    if (role === 'PORTEUR_STARTUP') {
      const p = await prisma.startupProfile.findUnique({ where: { userId } });
      if (meeting.startupId !== p?.id) return errorResponse('FORBIDDEN', 'Accès non autorisé', undefined, 403);
    } else if (role === 'MENTOR_EXPERT') {
      const p = await prisma.mentorProfile.findUnique({ where: { userId } });
      if (meeting.mentorId !== p?.id) return errorResponse('FORBIDDEN', 'Accès non autorisé', undefined, 403);
    } else if (role === 'INVESTISSEUR') {
      const p = await prisma.investorProfile.findUnique({ where: { userId } });
      if (meeting.investisseurId !== p?.id) return errorResponse('FORBIDDEN', 'Accès non autorisé', undefined, 403);
    }

    const updatedMeeting = await prisma.$transaction(async (tx) => {
      const updated = await tx.meeting.update({
        where: { id },
        data: parsedData.data
      });

      // If cancelled, free up the disponibilite
      if (parsedData.data.statut === 'ANNULE' && meeting.disponibiliteId) {
        await tx.disponibilite.update({
          where: { id: meeting.disponibiliteId },
          data: { reservee: false }
        });
      }

      // If mentor note is added, we should trigger a background job to recalculate mentor average score.
      // For MVP, if it's synchronous or we just rely on the next time someone requests it.
      // (The specs say recalcule noteMoyenne is an async job).

      return updated;
    });

    return successResponse(updatedMeeting);
  } catch (error: any) {
    return errorResponse('SERVER_ERROR', error.message || 'Erreur interne', undefined, 500);
  }
}
