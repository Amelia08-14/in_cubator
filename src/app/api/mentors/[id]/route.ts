import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse, requireRole } from "@/lib/api-utils";
import { auth } from "@/auth";
import { currentRealm } from "@/lib/realm";


export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { session, error } = await requireRole(['PORTEUR_STARTUP', 'GESTIONNAIRE', 'ADMIN']);
    if (error) return error;

    const { id } = await params;

    const mentor = await prisma.mentorProfile.findUnique({
      where: { id },
      include: {
        disponibilites: {
          where: {
            dateDebut: { gte: new Date() },
            reservee: false
          },
          select: {
            id: true,
            dateDebut: true,
            dateFin: true,
          }
        }
      }
    });

    if (!mentor) {
      return errorResponse('NOT_FOUND', 'Mentor introuvable', undefined, 404);
    }

    // Hide sensitive info if not authenticated
    if (!session?.user) {
      (mentor as any).tarifIndicatif = null;
    }

    return successResponse(mentor);
  } catch (error: any) {
    return errorResponse('SERVER_ERROR', error.message || 'Erreur interne', undefined, 500);
  }
}
