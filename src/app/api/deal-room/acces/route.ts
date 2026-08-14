import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole, successResponse, errorResponse } from "@/lib/api-utils";
import { auth } from "@/auth";
import * as z from "zod";


const DemandeAccesSchema = z.object({
  startupId: z.string().cuid(),
});

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) return errorResponse('UNAUTHORIZED', 'Non authentifié', undefined, 401);

    const { searchParams } = new URL(request.url);
    const startupId = searchParams.get('startupId');

    const userId = session.user.id;
    const role = session.user.role;

    let where: any = {};

    if (role === 'PORTEUR_STARTUP') {
      const profile = await prisma.startupProfile.findUnique({ where: { userId } });
      where.startupId = profile?.id;
    } else if (role === 'INVESTISSEUR') {
      const profile = await prisma.investorProfile.findUnique({ where: { userId } });
      where.investisseurId = profile?.id;
      if (startupId) where.startupId = startupId;
    } else if (role === 'GESTIONNAIRE' || role === 'ADMIN') {
      if (startupId) where.startupId = startupId;
    } else {
      return errorResponse('FORBIDDEN', 'Accès non autorisé', undefined, 403);
    }

    const demandes = await prisma.accesDealRoom.findMany({
      where,
      include: {
        startup: true,
        investisseur: true,
      }
    });

    return successResponse(demandes);
  } catch (error: any) {
    return errorResponse('SERVER_ERROR', error.message || 'Erreur interne', undefined, 500);
  }
}

export async function POST(request: Request) {
  try {
    const { session, error } = await requireRole(['INVESTISSEUR']);
    if (error) return error;

    const data = await request.json();
    const parsedData = DemandeAccesSchema.safeParse(data);

    if (!parsedData.success) {
      return errorResponse('VALIDATION_ERROR', 'Données invalides', parsedData.error.flatten().fieldErrors, 400);
    }

    const investorProfile = await prisma.investorProfile.findUnique({ where: { userId: session!.user.id } });
    if (!investorProfile) {
      return errorResponse('NOT_FOUND', 'Profil investisseur introuvable', undefined, 404);
    }

    const { startupId } = parsedData.data;

    const existingDemande = await prisma.accesDealRoom.findUnique({
      where: {
        startupId_investisseurId: {
          startupId,
          investisseurId: investorProfile.id,
        }
      }
    });

    if (existingDemande) {
      return errorResponse('CONFLICT', 'Une demande existe déjà', undefined, 409);
    }

    const startupProfile = await prisma.startupProfile.findUnique({ where: { id: startupId } });
    if (!startupProfile) {
      return errorResponse('NOT_FOUND', 'Startup introuvable', undefined, 404);
    }

    const acces = await prisma.$transaction(async (tx) => {
      const newAcces = await tx.accesDealRoom.create({
        data: {
          startupId,
          investisseurId: investorProfile.id,
        }
      });

      await tx.notification.create({
        data: {
          userId: startupProfile.userId,
          type: "DEMANDE_ACCES_DEALROOM",
          titre: "Nouvelle demande d'accès Deal Room",
          message: `${investorProfile.organisation || 'Un investisseur'} a demandé l'accès à votre Deal Room.`,
          lienUrl: "/espace/deal-room/acces",
          canal: "IN_APP",
        }
      });

      return newAcces;
    });

    return successResponse(acces, undefined, 201);
  } catch (error: any) {
    return errorResponse('SERVER_ERROR', error.message || 'Erreur interne', undefined, 500);
  }
}
