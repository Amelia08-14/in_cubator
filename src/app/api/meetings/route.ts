import { NextResponse } from "next/server";
import { TypeMeeting } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireRole, successResponse, errorResponse } from "@/lib/api-utils";
import { auth } from "@/auth";
import * as z from "zod";


const CreateMeetingSchema = z.object({
  type: z.enum(['MENTORAT', 'INVESTISSEUR', 'AUTRE']),
  startupId: z.string().cuid(),
  mentorId: z.string().cuid().optional(),
  investisseurId: z.string().cuid().optional(),
  disponibiliteId: z.string().cuid().optional(),
});

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) return errorResponse('UNAUTHORIZED', 'Non authentifié', undefined, 401);

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') as TypeMeeting;

    const where: any = {};
    if (type) where.type = type;

    // Filter by current user's profile
    const userId = session.user.id;
    const role = session.user.role;

    if (role === 'PORTEUR_STARTUP') {
      const profile = await prisma.startupProfile.findUnique({ where: { userId } });
      where.startupId = profile?.id;
    } else if (role === 'MENTOR_EXPERT') {
      const profile = await prisma.mentorProfile.findUnique({ where: { userId } });
      where.mentorId = profile?.id;
    } else if (role === 'INVESTISSEUR') {
      const profile = await prisma.investorProfile.findUnique({ where: { userId } });
      where.investisseurId = profile?.id;
    } else if (role !== 'ADMIN' && role !== 'GESTIONNAIRE') {
      where.demandeParId = userId;
    }

    const meetings = await prisma.meeting.findMany({
      where,
      include: {
        startup: true,
        mentor: true,
        investisseur: true,
        disponibilite: true,
      }
    });

    return successResponse(meetings);
  } catch (error: any) {
    return errorResponse('SERVER_ERROR', error.message || 'Erreur interne', undefined, 500);
  }
}

export async function POST(request: Request) {
  try {
    const { session, error } = await requireRole(['PORTEUR_STARTUP', 'INVESTISSEUR']);
    if (error) return error;

    const data = await request.json();
    const parsedData = CreateMeetingSchema.safeParse(data);

    if (!parsedData.success) {
      return errorResponse('VALIDATION_ERROR', 'Données invalides', parsedData.error.flatten().fieldErrors, 400);
    }

    const { type, startupId, mentorId, investisseurId, disponibiliteId } = parsedData.data;

    let finalStartupId = startupId;

    if (session!.user.role === 'PORTEUR_STARTUP') {
      const startupProfile = await prisma.startupProfile.findUnique({ where: { userId: session!.user.id } });
      if (!startupProfile || startupProfile.id !== startupId) {
        return errorResponse('FORBIDDEN', 'Accès non autorisé', undefined, 403);
      }
    } else if (session!.user.role === 'INVESTISSEUR') {
      const investorProfile = await prisma.investorProfile.findUnique({ where: { userId: session!.user.id } });
      if (!investorProfile || investorProfile.id !== investisseurId) {
        return errorResponse('FORBIDDEN', 'Accès non autorisé', undefined, 403);
      }
    }

    // Verify if disponibilite is already booked
    if (disponibiliteId) {
      const disp = await prisma.disponibilite.findUnique({ where: { id: disponibiliteId } });
      if (!disp || disp.reservee) {
        return errorResponse('CONFLICT', 'Créneau indisponible', undefined, 409);
      }
    }

    const meeting = await prisma.$transaction(async (tx) => {
      const newMeeting = await tx.meeting.create({
        data: {
          type,
          startupId: finalStartupId,
          mentorId,
          investisseurId,
          disponibiliteId,
          demandeParId: session!.user.id,
        }
      });

      if (disponibiliteId) {
        await tx.disponibilite.update({
          where: { id: disponibiliteId },
          data: { reservee: true }
        });
      }

      return newMeeting;
    });

    return successResponse(meeting, undefined, 201);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return errorResponse('CONFLICT', 'Ce créneau est déjà réservé', undefined, 409);
    }
    return errorResponse('SERVER_ERROR', error.message || 'Erreur interne', undefined, 500);
  }
}
